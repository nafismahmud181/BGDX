// One-time converter: original BGDX template (../index.html, <x-dc> markup with {{ }} bindings)
// → src/ui/Template.jsx (plain React). After conversion, Template.jsx is the source of truth.
// Usage: node tools/convert-template.mjs [path/to/index.html]
import fs from 'node:fs';
import { parseDocument } from 'htmlparser2';

const src = fs.readFileSync(process.argv[2] || new URL('../../index.html', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const tpl = src.slice(src.indexOf('<x-dc>'), src.indexOf('</x-dc>') + '</x-dc>'.length);
const doc = parseDocument(tpl, { lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true, decodeEntities: true });

const ATTR = {
  class: 'className', for: 'htmlFor', autocomplete: 'autoComplete', autofocus: 'autoFocus', spellcheck: 'spellCheck',
  readonly: 'readOnly', tabindex: 'tabIndex', maxlength: 'maxLength', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint',
  autocapitalize: 'autoCapitalize', autocorrect: 'autoCorrect', viewbox: 'viewBox', 'xmlns:xlink': 'xmlnsXlink',
};
const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const attrName = n => ATTR[n] || ATTR[n.toLowerCase()] || (/^(aria|data)-/.test(n) ? n : n.includes('-') ? camel(n) : n);
const BIND = /\{\{\s*([\w$.]+)\s*\}\}/g;
const ONLY = /^\s*\{\{\s*([\w$.]+)\s*\}\}\s*$/;

function expr(path, scope) { const root = path.split('.')[0]; return scope.includes(root) ? path : 'v.' + path; }
function cssKey(k) { k = k.trim(); if (k.startsWith('--')) return JSON.stringify(k); if (k.startsWith('-webkit-')) k = 'Webkit-' + k.slice(8); else if (k.startsWith('-ms-')) k = 'ms-' + k.slice(4); return camel(k); }
// Split "a:b;c:d" on semicolons outside quotes/parentheses.
function splitDecls(s) { const out = []; let cur = '', depth = 0, q = null; for (const ch of s) { if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ';' && !depth) { out.push(cur); cur = ''; continue; } cur += ch; } out.push(cur); return out.map(d => d.trim()).filter(Boolean); }
function styleExpr(val, scope) {
  const only = ONLY.exec(val); if (only) return expr(only[1], scope);
  const props = splitDecls(val).map(d => { const i = d.indexOf(':'); const k = d.slice(0, i), v = d.slice(i + 1).trim();
    const parts = []; let last = 0, m; BIND.lastIndex = 0;
    while ((m = BIND.exec(v))) { if (m.index > last) parts.push(JSON.stringify(v.slice(last, m.index))); parts.push(expr(m[1], scope)); last = m.index + m[0].length; }
    if (last < v.length) parts.push(JSON.stringify(v.slice(last)));
    const value = parts.length === 1 && !BIND.test(v) ? parts[0] : parts.length === 1 ? parts[0] : '`' + parts.map(p => p.startsWith('"') ? JSON.parse(p).replace(/[`$\\]/g, c => '\\' + c) : '${' + p + '}').join('') + '`';
    return cssKey(k) + ': ' + value; });
  return '{ ' + props.join(', ') + ' }';
}
function attrsOf(el, scope) {
  const out = [];
  for (const [n, raw] of Object.entries(el.attribs || {})) {
    if (n.startsWith('hint-')) continue;
    const name = attrName(n);
    if (n === 'style') { out.push(`style={${styleExpr(raw, scope)}}`); continue; }
    const only = ONLY.exec(raw);
    if (only) { const e = expr(only[1], scope); out.push(`${name}={${name === 'value' && el.name !== 'sc-if' ? `${e} ?? ''` : e}}`); continue; }
    if (BIND.test(raw)) { BIND.lastIndex = 0; out.push(`${name}={\`${raw.replace(/[`\\]/g, c => '\\' + c).replace(BIND, (_, p) => '${' + expr(p, scope) + '}')}\`}`); continue; }
    if (raw === '' && /^(autofocus|disabled|readonly|required|checked|multiple|hidden)$/i.test(n)) { out.push(name); continue; }
    out.push(`${name}=${JSON.stringify(raw)}`);
  }
  return out.length ? ' ' + out.join(' ') : '';
}
function text(t, scope) {
  let s = t.data;
  if (!s.trim()) return s.includes('\n') ? '' : '{" "}';
  s = s.replace(/\s+/g, ' ');
  const parts = []; let last = 0, m; BIND.lastIndex = 0;
  while ((m = BIND.exec(s))) { if (m.index > last) parts.push(`{${JSON.stringify(s.slice(last, m.index))}}`); parts.push(`{${expr(m[1], scope)}}`); last = m.index + m[0].length; }
  if (last < s.length) parts.push(`{${JSON.stringify(s.slice(last))}}`);
  return parts.join('');
}
const VOID = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);
function kids(nodes, scope, ind) { return nodes.map(n => node(n, scope, ind)).filter(Boolean).join('\n'); }
function node(n, scope, ind) {
  const pad = '  '.repeat(ind);
  if (n.type === 'text') { const t = text(n, scope); return t ? pad + t : ''; }
  if (n.type === 'comment') return pad + `{/* ${n.data.trim().replace(/\*\//g, '* /')} */}`;
  if (n.type !== 'tag') return '';
  if (n.name === 'helmet') return ''; // head tags live in app/index.html
  if (n.name === 'x-dc') return kids(n.children, scope, ind);
  if (n.name === 'sc-if') {
    const c = expr(ONLY.exec(n.attribs.value)[1], scope);
    return `${pad}{${c} ? (\n${pad}  <>\n${kids(n.children, scope, ind + 2)}\n${pad}  </>\n${pad}) : null}`;
  }
  if (n.name === 'sc-for') {
    const list = expr(ONLY.exec(n.attribs.list)[1], scope), as = n.attribs.as;
    return `${pad}{(${list} || []).map((${as}, __i${ind}) => (\n${pad}  <React.Fragment key={__i${ind}}>\n${kids(n.children, [...scope, as], ind + 2)}\n${pad}  </React.Fragment>\n${pad}))}`;
  }
  const a = attrsOf(n, scope);
  if (!n.children.length || VOID.has(n.name)) return `${pad}<${n.name}${a} />`;
  return `${pad}<${n.name}${a}>\n${kids(n.children, scope, ind + 1)}\n${pad}</${n.name}>`;
}

const body = kids(doc.children, [], 2);
const out = `// GENERATED once from the original index.html template by tools/convert-template.mjs, then maintained by hand.
// Every value comes from the logic class's renderVals() as \`v\`.
import React from 'react';

export default function Template({ v }) {
  return (
    <>
${body}
    </>
  );
}
`;
fs.mkdirSync(new URL('../src/ui/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../src/ui/Template.jsx', import.meta.url), out);
console.log('Template.jsx written:', out.split('\n').length, 'lines');
