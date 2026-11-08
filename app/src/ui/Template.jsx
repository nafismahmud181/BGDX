// GENERATED once from the original index.html template by tools/convert-template.mjs, then maintained by hand.
// Every value comes from the logic class's renderVals() as `v`.
import React from 'react';

// 'a:b;c-d:e' → { a: 'b', cD: 'e' } for the few places where the logic supplies a CSS string.
const css = s => Object.fromEntries(String(s || '').split(';').map(d => d.trim()).filter(Boolean).map(d => { const i = d.indexOf(':'); return [d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), d.slice(i + 1).trim()]; }));

export default function Template({ v }) {
  return (
    <>
    <div style={{ minHeight: v.rootMinH, display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: v.rootPad, boxSizing: "border-box", fontFamily: "'Geist',system-ui,sans-serif" }}>
      <div style={{ display: v.jumpDisp, flexWrap: "wrap", gap: "6px", justifyContent: "center", maxWidth: "720px" }}>
        {(v.jumps || []).map((j, __i4) => (
          <React.Fragment key={__i4}>
            <button onClick={j.onClick} style={{ border: "none", font: "500 12px 'Geist Mono',monospace", padding: "7px 11px", borderRadius: "999px", cursor: "pointer", background: j.bg, color: j.fg }}>
              {j.label}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div style={v.frameStyle}>
        <div style={v.themeVars}>
          {v.showSide ? (
            <>
              <aside style={{ width: "248px", flex: "none", boxSizing: "border-box", padding: "24px 16px", minHeight: "0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "22px", borderRight: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 8px" }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "9px", background: "var(--ink)", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "2px", padding: "7px 6px", boxSizing: "border-box" }}>
                    <span style={{ width: "4px", height: "100%", borderRadius: "2px", background: "#FF2E63" }} />
                    <span style={{ width: "4px", height: "75%", borderRadius: "2px", background: "#FF8A00" }} />
                    <span style={{ width: "4px", height: "52%", borderRadius: "2px", background: "#6B4BFF" }} />
                    <span style={{ width: "4px", height: "30%", borderRadius: "2px", background: "#C8FF2E" }} />
                  </span>
                  <span style={{ font: "700 20px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                    {"BGDX"}
                  </span>
                </div>
                <button onClick={v.openSheet} style={{ height: "48px", border: "none", borderRadius: "24px", background: "var(--sig)", color: "#0F0F12", font: "600 15px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {"New task"}
                  <span style={{ font: "600 11px 'Geist Mono',monospace", padding: "2px 6px", borderRadius: "6px", background: "rgba(15,15,18,.12)" }}>
                    {"N"}
                  </span>
                </button>
                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(v.sideNav || []).map((n, __i9) => (
                    <React.Fragment key={__i9}>
                      <button onClick={n.onClick} style={{ height: "46px", border: "none", borderRadius: "23px", padding: "0 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", font: "500 15px 'Geist',sans-serif", transition: "background .2s", textAlign: "left", background: n.bg, color: n.fg }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={n.d} />
                        </svg>
                        <span style={{ flex: "1" }}>
                          {n.label}
                        </span>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", opacity: ".7" }}>
                          {n.badge}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                </nav>
                <span style={{ flex: "1" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 8px" }}>
                  <span style={{ font: "500 11px 'Geist Mono',monospace", color: "var(--mute)", letterSpacing: ".08em" }}>
                    {"PRIORITY"}
                  </span>
                  {(v.priLegend || []).map((p, __i9) => (
                    <React.Fragment key={__i9}>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", font: "500 13px 'Geist',sans-serif", color: "var(--ink)" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "5px", background: p.c }} />
                        <span style={{ fontFamily: "'Geist Mono',monospace", color: "var(--mute)", width: "22px" }}>
                          {p.label}
                        </span>
                        {p.name}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                  <button onClick={v.goAccount} aria-label="Account" style={{ width: "40px", height: "40px", borderRadius: "20px", border: "none", cursor: "pointer", background: "var(--ink)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 11px 'Geist Mono',monospace" }}>
                    {v.meInitial}
                  </button>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ font: "600 14px 'Geist',sans-serif", color: "var(--ink)" }}>
                      {"BGD MART"}
                    </span>
                    <span style={{ font: "400 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                      {v.syncText}
                    </span>
                  </div>
                  <button onClick={v.toggleDark} aria-label="Toggle theme" style={{ width: "40px", height: "40px", borderRadius: "20px", border: "none", background: "var(--surf)", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                      <path d={v.themeIcon} />
                    </svg>
                  </button>
                </div>
              </aside>
            </>
          ) : null}
          <div style={v.mainOuter}>
            <div style={v.mainInner}>
              {/* ONBOARDING */}
              {v.isOnboard ? (
                <>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", padding: "24px 24px 28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "44px" }}>
                      <span style={{ font: "600 13px 'Geist Mono',monospace", letterSpacing: ".08em", color: "var(--mute)" }}>
                        {v.obCount}
                      </span>
                      <button onClick={v.finishOb} style={{ border: "none", background: "none", font: "500 14px 'Geist',sans-serif", color: "var(--mute)", cursor: "pointer", padding: "12px 0" }}>
                        {"Skip"}
                      </button>
                    </div>
                    {v.ob0 ? (
                      <>
                        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", gap: "28px" }}>
                          <div style={{ display: "flex", gap: "6px", height: "120px", alignItems: "flex-end" }}>
                            <div style={{ flex: "1", height: "100%", borderRadius: "14px", background: "#FF2E63" }} />
                            <div style={{ flex: "1", height: "78%", borderRadius: "14px", background: "#FF8A00" }} />
                            <div style={{ flex: "1", height: "56%", borderRadius: "14px", background: "#6B4BFF" }} />
                            <div style={{ flex: "1", height: "34%", borderRadius: "14px", background: "#12C79A" }} />
                          </div>
                          <div style={{ font: "700 88px/0.9 'Geist',sans-serif", letterSpacing: "-.05em", color: "var(--ink)" }}>
                            {"BGDX"}
                          </div>
                          <div style={{ font: "400 19px/1.4 'Geist',sans-serif", color: "var(--mute)", textWrap: "pretty", maxWidth: "300px" }}>
                            {"Tech ops for BGD MART. One board for every bug, feature and fire. No Jira."}
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.ob1 ? (
                      <>
                        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
                          <div style={{ font: "600 34px/1.05 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)", textWrap: "pretty" }}>
                            {"Four colors."}
                            <br />
                            {"Zero ambiguity."}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {(v.priLegend || []).map((p, __i14) => (
                              <React.Fragment key={__i14}>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px", borderRadius: "18px", background: p.c, color: p.on }}>
                                  <span style={{ font: "600 14px 'Geist Mono',monospace" }}>
                                    {p.label}
                                  </span>
                                  <span style={{ font: "600 17px 'Geist',sans-serif", flex: "1" }}>
                                    {p.name}
                                  </span>
                                  <span style={{ font: "400 13px 'Geist',sans-serif", opacity: ".85" }}>
                                    {p.hint}
                                  </span>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.ob2 ? (
                      <>
                        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
                          <div style={{ font: "600 34px/1.05 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)", textWrap: "pretty" }}>
                            {"Your sheet"}
                            <br />
                            {"is the database."}
                          </div>
                          <div style={{ font: "400 16px/1.45 'Geist',sans-serif", color: "var(--mute)", textWrap: "pretty" }}>
                            {"Edit in Google Sheets or in BGDX. Changes land instantly here, sync in the background, and queue up when you are offline."}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--surf)", color: "var(--ink)" }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="4" y="3" width="16" height="18" rx="2" />
                              <path d="M4 9h16M4 15h16M10 9v12" />
                            </svg>
                            <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ font: "600 16px 'Geist',sans-serif" }}>
                                {"Google Sheets"}
                              </span>
                              <span style={{ font: "400 13px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {"Secured with your access key"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </>
                    ) : null}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {(v.obDots || []).map((d, __i12) => (
                          <React.Fragment key={__i12}>
                            <span style={{ height: "6px", borderRadius: "3px", transition: "all .3s", width: d.w, background: d.bg }} />
                          </React.Fragment>
                        ))}
                      </div>
                      <button onClick={v.obNext} style={{ border: "none", height: "56px", padding: "0 28px", borderRadius: "28px", background: "var(--sig)", color: "#0F0F12", font: "600 16px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                        {v.obCta}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {v.isLogin ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "22px", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "44px" }}>
                      <span style={{ width: "14px", height: "100%", borderRadius: "5px", background: "#FF2E63" }} />
                      <span style={{ width: "14px", height: "75%", borderRadius: "5px", background: "#FF8A00" }} />
                      <span style={{ width: "14px", height: "52%", borderRadius: "5px", background: "#6B4BFF" }} />
                      <span style={{ width: "14px", height: "30%", borderRadius: "5px", background: "var(--sig)" }} />
                    </div>
                    <div style={{ font: "700 56px/0.9 'Geist',sans-serif", letterSpacing: "-.05em", color: "var(--ink)" }}>
                      {"BGDX"}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ font: "600 26px/1.1 'Geist',sans-serif", letterSpacing: "-.025em", color: "var(--ink)", textWrap: "pretty" }}>
                        {v.lTitle}
                      </div>
                      <div style={{ font: "400 15px/1.45 'Geist',sans-serif", color: "var(--mute)", textWrap: "pretty" }}>
                        {v.lSub}
                      </div>
                    </div>
                    {v.lStep1 ? (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <span style={{ font: "500 11px 'Geist Mono',monospace", letterSpacing: ".08em", color: "var(--mute)", padding: "0 4px" }}>
                              {"USERNAME"}
                            </span>
                            <input value={v.lUser ?? ''} onChange={v.onLUser} onKeyDown={v.onKeyEnter} placeholder="Username from your admin" autoComplete="username" autoCapitalize="off" autoCorrect="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", height: "56px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--surf)", padding: "0 16px", font: "400 17px 'Geist',sans-serif", color: "var(--ink)", outline: "none" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <span style={{ font: "500 11px 'Geist Mono',monospace", letterSpacing: ".08em", color: "var(--mute)", padding: "0 4px" }}>
                              {"PASSWORD"}
                            </span>
                            <div style={{ position: "relative" }}>
                              <input type={v.lKeyType} value={v.lKey ?? ''} onChange={v.onLKey} onKeyDown={v.onKeyEnter} placeholder="Password" autoComplete="current-password" autoCapitalize="off" style={{ width: "100%", boxSizing: "border-box", height: "56px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--surf)", padding: "0 16px", font: "400 17px 'Geist',sans-serif", color: "var(--ink)", outline: "none", paddingRight: "76px" }} />
                              <button onClick={v.toggleKey} style={{ position: "absolute", right: "6px", top: "8px", height: "40px", padding: "0 14px", border: "none", background: "none", color: "var(--mute)", font: "600 13px 'Geist',sans-serif", cursor: "pointer" }}>
                                {v.lShowTxt}
                              </button>
                            </div>
                          </div>
                          {v.hasLErr ? (
                            <>
                              <div style={{ padding: "14px 16px", borderRadius: "16px", background: "#FF2E63", color: "#fff", font: "500 14px/1.4 'Geist',sans-serif" }}>
                                {v.lErr}
                              </div>
                            </>
                          ) : null}
                          <button onClick={v.doConnect} style={{ height: "58px", border: "none", borderRadius: "29px", background: "var(--sig)", color: "#0F0F12", font: "600 17px 'Geist',sans-serif", cursor: "pointer" }}>
                            {v.lBtn}
                          </button>
                          <div style={{ textAlign: "center", font: "400 13px/1.4 'Geist',sans-serif", color: "var(--mute)", padding: "0 12px" }}>
                            {"Forgot your password? Ask your admin to reset it."}
                          </div>
                        </div>
                      </>
                    ) : null}
                    {v.lStep2 ? (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {(v.lWho || []).map((o, __i13) => (
                            <React.Fragment key={__i13}>
                              <button onClick={o.onClick} style={{ height: "58px", border: "none", borderRadius: "18px", background: "var(--surf)", color: "var(--ink)", font: "600 17px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", padding: "0 16px", textAlign: "left" }}>
                                <span style={{ width: "34px", height: "34px", borderRadius: "17px", flex: "none", background: "var(--ink)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 13px 'Geist Mono',monospace" }}>
                                  {o.initial}
                                </span>
                                {o.label}
                              </button>
                            </React.Fragment>
                          ))}
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }}>
                            <span style={{ font: "500 11px 'Geist Mono',monospace", letterSpacing: ".08em", color: "var(--mute)", padding: "0 4px" }}>
                              {"NOT LISTED? TYPE YOUR NAME"}
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input value={v.lMe ?? ''} onChange={v.onLMe} onKeyDown={v.onMeEnter} placeholder="Your name" style={{ width: "100%", boxSizing: "border-box", height: "56px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--surf)", padding: "0 16px", font: "400 17px 'Geist',sans-serif", color: "var(--ink)", outline: "none", flex: "1", minWidth: "0" }} />
                              <button onClick={v.doFinish} style={{ flex: "none", height: "56px", padding: "0 22px", border: "none", borderRadius: "28px", background: "var(--ink)", color: "var(--bg)", font: "600 15px 'Geist',sans-serif", cursor: "pointer" }}>
                                {"Go"}
                              </button>
                            </div>
                          </div>
                          {v.hasLErr ? (
                            <>
                              <div style={{ padding: "14px 16px", borderRadius: "16px", background: "#FF2E63", color: "#fff", font: "500 14px/1.4 'Geist',sans-serif" }}>
                                {v.lErr}
                              </div>
                            </>
                          ) : null}
                          <button onClick={v.backStep} style={{ height: "40px", border: "none", background: "none", color: "var(--mute)", font: "500 13px 'Geist',sans-serif", cursor: "pointer" }}>
                            {"Use a different key"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {v.isAccount ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", padding: "8px 16px 110px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "52px" }}>
                      <button onClick={v.back} aria-label="Back" style={{ width: "44px", height: "44px", marginLeft: "-6px", border: "none", background: "none", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 5l-7 7 7 7" />
                        </svg>
                      </button>
                      <span style={{ font: "600 26px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                        {"Account"}
                      </span>
                    </div>
                    <div style={{ background: "var(--surf)", borderRadius: "22px", padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ width: "14px", height: "14px", borderRadius: "7px", flex: "none", background: v.syncColor }} />
                      <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ font: "600 17px 'Geist',sans-serif", color: "var(--ink)" }}>
                          {v.acctTitle}
                        </span>
                        <span style={{ font: "400 13px/1.4 'Geist Mono',monospace", color: "var(--mute)" }}>
                          {v.syncText}
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "var(--surf)", borderRadius: "22px", padding: "6px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                          {"WORKSPACE"}
                        </span>
                        <span style={{ font: "500 14px 'Geist',sans-serif", color: "var(--ink)", textAlign: "right", wordBreak: "break-all" }}>
                          {v.acctHost}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                          {"SIGNED IN AS"}
                        </span>
                        <span style={{ font: "500 14px 'Geist',sans-serif", color: "var(--ink)" }}>
                          {v.acctMe}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "14px 0" }}>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                          {"PENDING CHANGES"}
                        </span>
                        <span style={{ font: "500 14px 'Geist',sans-serif", color: "var(--ink)" }}>
                          {v.acctPend}
                        </span>
                      </div>
                    </div>
                    {v.isSheet ? (
                      <>
                        <button onClick={v.syncNow} style={{ height: "56px", border: "none", borderRadius: "28px", background: "var(--sig)", color: "#0F0F12", font: "600 16px 'Geist',sans-serif", cursor: "pointer", marginTop: "8px" }}>
                          {"Sync now"}
                        </button>
                      </>
                    ) : null}
                    {v.showPushBtn ? (
                      <>
                        <button onClick={v.togglePush} style={{ height: "56px", border: "none", borderRadius: "28px", background: "var(--surf)", color: "var(--ink)", font: "600 16px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" />
                          </svg>
                          {v.pushLabel}
                        </button>
                      </>
                    ) : null}
                    {v.hasPushHint ? (
                      <>
                        <div style={{ padding: "2px 12px 6px", font: "400 13px/1.45 'Geist',sans-serif", color: v.pushHintColor, textAlign: "center", textWrap: "pretty" }}>
                          {v.pushHint}
                        </div>
                      </>
                    ) : null}
                    {v.isAdmin && v.isSheet ? (
                      <button onClick={v.goPeople} style={{ height: "56px", border: "none", borderRadius: "28px", background: "var(--surf)", color: "var(--ink)", font: "600 16px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zM22 19v-1a4 4 0 00-3-3.9M16 4.1a3 3 0 010 5.8" /></svg>
                        {"Manage people"}
                      </button>
                    ) : null}
                    <button onClick={v.acctAction} style={{ height: "56px", border: "none", borderRadius: "28px", background: "var(--ink)", color: "var(--bg)", font: "600 16px 'Geist',sans-serif", cursor: "pointer" }}>
                      {v.acctActionLabel}
                    </button>
                    <button onClick={v.toggleDark} style={{ height: "56px", border: "none", borderRadius: "28px", background: "var(--surf)", color: "var(--ink)", font: "600 16px 'Geist',sans-serif", cursor: "pointer" }}>
                      {"Switch theme"}
                    </button>
                    <div style={{ textAlign: "center", font: "400 12px 'Geist Mono',monospace", color: "var(--mute)", paddingTop: "8px" }}>
                      {"BGDX v"}{v.version}
                    </div>
                  </div>
                </>
              ) : null}
              {/* PEOPLE (admins) */}
              {v.isPeople ? (
                <div style={{ flex: 1, overflow: "auto", padding: "8px 16px 110px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "52px" }}>
                    <button onClick={v.back} aria-label="Back" style={{ width: "44px", height: "44px", marginLeft: "-6px", border: "none", background: "none", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
                    </button>
                    <span style={{ flex: 1, font: "600 26px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>{"People"}</span>
                    <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>{v.peopleCount}</span>
                  </div>
                  <div style={{ background: "var(--surf)", borderRadius: "22px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ font: "500 11px 'Geist Mono',monospace", letterSpacing: ".08em", color: "var(--mute)" }}>{"ADD A PERSON"}</span>
                    <input value={v.pName ?? ''} onChange={v.onPName} placeholder="Name on tasks (e.g. Sabbir)" list="bgdx-owner-names" autoComplete="off" style={{ width: "100%", boxSizing: "border-box", height: "50px", borderRadius: "16px", border: "1px solid var(--line)", background: "var(--bg)", padding: "0 14px", font: "400 16px 'Geist',sans-serif", color: "var(--ink)", outline: "none" }} />
                    <datalist id="bgdx-owner-names">{(v.ownerNames || []).map(n => <option key={n} value={n} />)}</datalist>
                    <input value={v.pUser ?? ''} onChange={v.onPUser} placeholder="Username (they sign in with this)" autoComplete="off" autoCapitalize="off" spellCheck={false} style={{ width: "100%", boxSizing: "border-box", height: "50px", borderRadius: "16px", border: "1px solid var(--line)", background: "var(--bg)", padding: "0 14px", font: "400 16px 'Geist',sans-serif", color: "var(--ink)", outline: "none" }} />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input value={v.pPass ?? ''} onChange={v.onPPass} placeholder="Password" autoComplete="new-password" autoCapitalize="off" spellCheck={false} style={{ flex: 1, minWidth: 0, boxSizing: "border-box", height: "50px", borderRadius: "16px", border: "1px solid var(--line)", background: "var(--bg)", padding: "0 14px", font: "400 15px 'Geist Mono',monospace", color: "var(--ink)", outline: "none" }} />
                      <button onClick={v.genPass} style={{ flex: "none", height: "50px", padding: "0 14px", borderRadius: "16px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "600 13px 'Geist',sans-serif", cursor: "pointer" }}>{"Generate"}</button>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {(v.roleOpts || []).map(r => (
                        <button key={r.label} onClick={r.onClick} style={{ flex: 1, height: "44px", borderRadius: "22px", border: "1px solid var(--line)", background: r.bg, color: r.fg, font: "600 14px 'Geist',sans-serif", cursor: "pointer" }}>{r.label}</button>
                      ))}
                    </div>
                    {v.hasPErr ? <div style={{ padding: "12px 14px", borderRadius: "14px", background: "#FF2E63", color: "#fff", font: "500 14px/1.4 'Geist',sans-serif" }}>{v.pErr}</div> : null}
                    {v.hasPMsg ? <div style={{ padding: "12px 14px", borderRadius: "14px", background: "var(--sig)", color: "#0F0F12", font: "500 14px/1.45 'Geist',sans-serif", whiteSpace: "pre-line", userSelect: "text" }}>{v.pMsg}</div> : null}
                    <button onClick={v.addPerson} style={{ height: "52px", border: "none", borderRadius: "26px", background: "var(--ink)", color: "var(--bg)", font: "600 16px 'Geist',sans-serif", cursor: "pointer" }}>{v.addLabel}</button>
                  </div>
                  {(v.people || []).map(p => (
                    <div key={p.id} style={{ flex: "none", background: "var(--surf)", borderRadius: "20px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px", opacity: p.op }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ width: "38px", height: "38px", borderRadius: "19px", flex: "none", background: "var(--ink)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px 'Geist Mono',monospace" }}>{p.initial}</span>
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
                          <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>{p.name}</span>
                          <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>{p.sub}</span>
                        </div>
                        <span style={{ font: "600 11px 'Geist Mono',monospace", padding: "4px 8px", borderRadius: "8px", background: p.tagBg, color: p.tagFg }}>{p.tag}</span>
                      </div>
                      {p.canEdit ? (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {p.actions.map(a => (
                            <button key={a.label} onClick={a.onClick} style={{ height: "34px", padding: "0 12px", borderRadius: "17px", border: "1px solid var(--line)", background: "transparent", color: a.danger ? "#FF2E63" : "var(--ink)", font: "600 12px 'Geist',sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}>{a.label}</button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
              {/* NOTIFICATIONS */}
              {v.isInbox ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", padding: "8px 16px 110px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "52px" }}>
                      <button onClick={v.back} aria-label="Back" style={{ width: "44px", height: "44px", marginLeft: "-6px", border: "none", background: "none", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 5l-7 7 7 7" />
                        </svg>
                      </button>
                      <span style={{ flex: "1", font: "600 26px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                        {"Notifications"}
                      </span>
                      <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>
                        {v.inboxSub}
                      </span>
                    </div>
                    {(v.inboxItems || []).map((n, __i10) => (
                      <React.Fragment key={__i10}>
                        <div onClick={n.open} style={{ flex: "none", display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px", borderRadius: "20px", cursor: "pointer", background: n.bg, border: `1px solid ${n.bd}` }}>
                          <span style={{ width: "38px", height: "38px", borderRadius: "19px", flex: "none", background: n.c, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={n.d} />
                            </svg>
                          </span>
                          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                              <span style={{ flex: "1", font: "600 15px/1.3 'Geist',sans-serif", color: "var(--ink)" }}>
                                {n.title}
                              </span>
                              <span style={{ font: "500 11px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>
                                {n.when}
                              </span>
                              <span style={{ display: n.dot, width: "8px", height: "8px", borderRadius: "4px", background: "#FF2E63", flex: "none", alignSelf: "center" }} />
                            </div>
                            <span style={{ font: "400 14px/1.4 'Geist',sans-serif", color: "var(--mute)", whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                              {n.body}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    {v.inboxEmpty ? (
                      <>
                        <div style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
                          <span style={{ width: "56px", height: "56px", borderRadius: "28px", background: "var(--surf)", color: "var(--mute)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" />
                            </svg>
                          </span>
                          <span style={{ font: "600 17px 'Geist',sans-serif", color: "var(--ink)" }}>
                            {"No notifications yet"}
                          </span>
                          <span style={{ font: "400 14px/1.45 'Geist',sans-serif", color: "var(--mute)", maxWidth: "280px" }}>
                            {"Task assignments, changes to your tasks and the morning reminder will show up here."}
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {/* ADMIN HOME */}
              {v.isAdminDesk ? (
                <>
                  <div style={{ flex: "1", minHeight: "0", display: "flex", flexDirection: "column", gap: "18px", padding: "28px 32px" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "500 13px 'Geist Mono',monospace", color: "var(--mute)" }}>
                          {v.dateLabel}{" · "}{v.weekNo}
                        </span>
                        <span style={{ font: "600 38px/1 'Geist',sans-serif", letterSpacing: "-.04em", color: "var(--ink)" }}>
                          {"Who is doing what"}
                        </span>
                        <span style={{ font: "400 14px 'Geist',sans-serif", color: "var(--mute)" }}>
                          {v.teamSummary}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "52px" }}>
                        {(v.week || []).map((d, __i12) => (
                          <React.Fragment key={__i12}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                              <div style={{ width: "20px", borderRadius: "6px", height: d.h, background: d.bg }} />
                              <span style={{ font: "500 10px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {d.l}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <button onClick={v.showMine} style={{ height: "48px", padding: "0 20px", borderRadius: "24px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "600 14px 'Geist',sans-serif", cursor: "pointer" }}>
                        {"My tasks"}
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "190px repeat(3,minmax(0,1fr))", gap: "10px", padding: "0 2px" }}>
                      <span />
                      {(v.laneHeads || []).map((hd, __i11) => (
                        <React.Fragment key={__i11}>
                          <span style={{ font: "600 12px 'Geist Mono',monospace", letterSpacing: ".08em", color: "var(--mute)" }}>
                            {hd}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ flex: "1", minHeight: "0", overflow: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(v.lanes || []).map((l, __i11) => (
                        <React.Fragment key={__i11}>
                          <div style={{ flex: "none", minHeight: "84px", display: "grid", gridTemplateColumns: "190px repeat(3,minmax(0,1fr))", gap: "10px", alignItems: "stretch" }}>
                            <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ width: "32px", height: "32px", borderRadius: "16px", flex: "none", background: "var(--surf2)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 11px 'Geist Mono',monospace" }}>
                                  {l.ini}
                                </span>
                                <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                                  {l.name}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "3px" }}>
                                {(l.meter || []).map((m, __i16) => (
                                  <React.Fragment key={__i16}>
                                    <div style={{ flex: "1", height: "5px", borderRadius: "3px", background: m.bg }} />
                                  </React.Fragment>
                                ))}
                              </div>
                              <span style={{ font: "500 11px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {l.sub}
                              </span>
                            </div>
                            {(l.cols || []).map((c, __i14) => (
                              <React.Fragment key={__i14}>
                                <div style={{ background: "var(--surf2)", borderRadius: "20px", padding: "8px", display: "flex", flexDirection: "column", gap: "6px", justifyContent: "center", minWidth: "0" }}>
                                  {(c.cards || []).map((k, __i17) => (
                                    <React.Fragment key={__i17}>
                                      <div onClick={k.open} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px", borderRadius: "14px", background: "var(--surf)", cursor: "pointer" }}>
                                        <span style={{ width: "4px", alignSelf: "stretch", borderRadius: "2px", flex: "none", background: k.c }} />
                                        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                                          <span style={{ font: "500 13px/1.25 'Geist',sans-serif", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {k.title}
                                          </span>
                                          <span style={{ font: "500 11px 'Geist Mono',monospace", color: k.tagC }}>
                                            {k.tag}
                                          </span>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {v.isAdminMob ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", padding: "8px 16px 110px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
                      <span style={{ font: "700 17px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                        {"BGDX"}
                      </span>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button onClick={v.showMine} style={{ height: "40px", padding: "0 16px", borderRadius: "20px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "600 13px 'Geist',sans-serif", cursor: "pointer" }}>
                          {"My tasks"}
                        </button>
                        <button onClick={v.goInbox} aria-label="Notifications" style={{ position: "relative", width: "44px", height: "44px", borderRadius: "22px", border: "none", background: "var(--surf)", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" />
                          </svg>
                          {v.hasUnread ? (
                            <>
                              <span style={{ position: "absolute", top: "-2px", right: "-2px", minWidth: "18px", height: "18px", padding: "0 5px", boxSizing: "border-box", borderRadius: "9px", background: "#FF2E63", color: "#fff", font: "600 10px/18px 'Geist Mono',monospace", textAlign: "center", border: "2px solid var(--bg)" }}>
                                {v.inboxBadge}
                              </span>
                            </>
                          ) : null}
                        </button>
                        <button onClick={v.goAccount} aria-label="Account" style={{ width: "44px", height: "44px", borderRadius: "22px", border: "none", cursor: "pointer", background: "var(--ink)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px 'Geist Mono',monospace" }}>
                          {v.meInitial}
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: "14px 4px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ font: "500 13px 'Geist Mono',monospace", color: "var(--mute)" }}>
                        {v.dateLabel}
                      </span>
                      <span style={{ font: "600 34px/1 'Geist',sans-serif", letterSpacing: "-.04em", color: "var(--ink)" }}>
                        {"Who is doing what"}
                      </span>
                      <span style={{ font: "400 13px/1.4 'Geist',sans-serif", color: "var(--mute)" }}>
                        {v.teamSummary}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(v.lanes || []).map((l, __i11) => (
                        <React.Fragment key={__i11}>
                          <div style={{ background: "var(--surf)", borderRadius: "22px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ width: "32px", height: "32px", borderRadius: "16px", flex: "none", background: "var(--surf2)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 11px 'Geist Mono',monospace" }}>
                                {l.ini}
                              </span>
                              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px" }}>
                                <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                                  {l.name}
                                </span>
                                <div style={{ display: "flex", gap: "3px" }}>
                                  {(l.meter || []).map((m, __i17) => (
                                    <React.Fragment key={__i17}>
                                      <div style={{ flex: "1", height: "4px", borderRadius: "2px", background: m.bg }} />
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                              <span style={{ font: "500 11px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {l.sub}
                              </span>
                            </div>
                            {(l.flat || []).map((k, __i14) => (
                              <React.Fragment key={__i14}>
                                <div onClick={k.open} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px", borderRadius: "14px", background: "var(--surf2)", cursor: "pointer" }}>
                                  <span style={{ width: "4px", alignSelf: "stretch", borderRadius: "2px", flex: "none", background: k.c }} />
                                  <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <span style={{ font: "500 14px/1.25 'Geist',sans-serif", color: "var(--ink)" }}>
                                      {k.title}
                                    </span>
                                    <span style={{ font: "500 11px 'Geist Mono',monospace", color: k.tagC }}>
                                      {k.when}{" · "}{k.tag}
                                    </span>
                                  </div>
                                </div>
                              </React.Fragment>
                            ))}
                            {l.isFree ? (
                              <>
                                <span style={{ font: "400 13px 'Geist',sans-serif", color: "var(--mute)" }}>
                                  {"Nothing open. Free to take work."}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {/* TODAY */}
              {v.isToday ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", padding: "8px 16px 110px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
                      <span style={{ font: "700 17px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                        {"BGDX"}
                      </span>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {v.isAdmin ? (
                          <>
                            <button onClick={v.showTeam} style={{ height: "40px", padding: "0 16px", borderRadius: "20px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "600 13px 'Geist',sans-serif", cursor: "pointer" }}>
                              {"Team"}
                            </button>
                          </>
                        ) : null}
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", font: "500 11px 'Geist Mono',monospace", color: "var(--mute)" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "4px", background: v.syncColor }} />
                          {v.syncShort}
                        </span>
                        <button onClick={v.toggleDark} aria-label="Toggle theme" style={{ width: "44px", height: "44px", borderRadius: "22px", border: "none", background: "var(--surf)", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {v.dark ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
                              </svg>
                            </>
                          ) : null}
                          {v.light ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
                              </svg>
                            </>
                          ) : null}
                        </button>
                        <button onClick={v.goInbox} aria-label="Notifications" style={{ position: "relative", width: "44px", height: "44px", borderRadius: "22px", border: "none", background: "var(--surf)", color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15zM10 20.5a2 2 0 004 0" />
                          </svg>
                          {v.hasUnread ? (
                            <>
                              <span style={{ position: "absolute", top: "-2px", right: "-2px", minWidth: "18px", height: "18px", padding: "0 5px", boxSizing: "border-box", borderRadius: "9px", background: "#FF2E63", color: "#fff", font: "600 10px/18px 'Geist Mono',monospace", textAlign: "center", border: "2px solid var(--bg)" }}>
                                {v.inboxBadge}
                              </span>
                            </>
                          ) : null}
                        </button>
                        <button onClick={v.goAccount} aria-label="Account" style={{ width: "44px", height: "44px", borderRadius: "22px", border: "none", cursor: "pointer", background: "var(--ink)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px 'Geist Mono',monospace" }}>
                          {v.meInitial}
                        </button>
                      </div>
                    </div>
                    <div style={{ padding: "18px 4px 20px" }}>
                      <div style={{ font: "500 14px 'Geist Mono',monospace", color: "var(--mute)", letterSpacing: ".02em" }}>
                        {v.dateLabel}
                      </div>
                      <div style={{ font: "600 40px/1 'Geist',sans-serif", letterSpacing: "-.04em", color: "var(--ink)", marginTop: "8px" }}>
                        {v.todayHeadline}
                      </div>
                      <div style={{ display: "flex", gap: "3px", marginTop: "18px", height: "6px" }}>
                        {(v.todaySegs || []).map((s, __i12) => (
                          <React.Fragment key={__i12}>
                            <div style={{ flex: "1", borderRadius: "3px", transition: "background .3s", background: s.bg }} />
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ font: "400 13px 'Geist',sans-serif", color: "var(--mute)", marginTop: "8px" }}>
                        {v.todaySub}
                      </div>
                    </div>
                    {v.hasNow ? (
                      <>
                        <div onClick={v.now.open} style={{ background: "var(--sig)", color: "#0F0F12", borderRadius: "26px", padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ font: "600 12px 'Geist Mono',monospace", letterSpacing: ".08em" }}>
                              {"NOW DOING"}
                            </span>
                            <span style={{ font: "600 12px 'Geist Mono',monospace", padding: "4px 8px", borderRadius: "8px", background: v.now.c, color: v.now.on }}>
                              {v.now.pl}{" · "}{v.now.type}
                            </span>
                          </div>
                          <div style={{ font: "600 22px/1.15 'Geist',sans-serif", letterSpacing: "-.02em", textWrap: "pretty" }}>
                            {v.now.title}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1" }}>
                              <span style={{ font: "500 12px 'Geist Mono',monospace" }}>
                                {v.now.subTxt}{" checklist · PR "}{v.now.pr}
                              </span>
                              <div style={{ height: "4px", borderRadius: "2px", background: "rgba(15,15,18,.15)" }}>
                                <div style={{ height: "100%", borderRadius: "2px", background: "#0F0F12", width: v.now.subPct }} />
                              </div>
                            </div>
                            <button onClick={v.now.focus} style={{ border: "none", height: "48px", padding: "0 18px", borderRadius: "24px", background: "#0F0F12", color: "var(--sig)", font: "600 14px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 4.5v15l13-7.5z" />
                              </svg>
                              {"Focus"}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                        {(v.ownerChips || []).map((o, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={o.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: o.bg, color: o.fg }}>
                              {o.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px 10px" }}>
                      <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)", whiteSpace: "nowrap" }}>
                        {"Due & overdue"}
                      </span>
                      <span style={{ font: "500 13px 'Geist Mono',monospace", color: "var(--mute)" }}>
                        {v.todayLeftN}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(v.todayList || []).map((t, __i11) => (
                        <React.Fragment key={__i11}>
                          <div onClick={t.open} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px", background: "var(--surf)", borderRadius: "20px", cursor: "pointer", transition: "opacity .3s", opacity: t.op }}>
                            <button onClick={t.toggle} aria-label="Complete" style={{ width: "26px", height: "26px", borderRadius: "13px", flex: "none", padding: "0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s", border: `2.5px solid ${t.c}`, background: t.checkBg, color: t.on }}>
                              {t.done ? (
                                <>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                                  </svg>
                                </>
                              ) : null}
                            </button>
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div style={{ font: "500 15px/1.3 'Geist',sans-serif", color: "var(--ink)", textWrap: "pretty", textDecoration: t.deco }}>
                                {t.title}
                              </div>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                <span style={{ padding: "3px 7px", borderRadius: "7px", background: t.c, color: t.on }}>
                                  {t.pl}
                                </span>
                                <span style={{ padding: "3px 7px", borderRadius: "7px", background: "var(--surf2)", color: "var(--ink)" }}>
                                  {t.typeO}
                                </span>
                                {t.hasSubs ? (
                                  <>
                                    <span>
                                      {"☐ "}{t.subTxt}
                                    </span>
                                  </>
                                ) : null}
                                {t.hasPr ? (
                                  <>
                                    <span>
                                      {"PR "}{t.pr}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "24px 4px 10px" }}>
                      <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                        {"Coming up"}
                      </span>
                      <button onClick={v.goBoard} style={{ border: "none", background: "none", font: "500 13px 'Geist',sans-serif", color: "var(--mute)", cursor: "pointer", padding: "8px 0" }}>
                        {"Board →"}
                      </button>
                    </div>
                    <div style={{ background: "var(--surf)", borderRadius: "20px", overflow: "hidden" }}>
                      {(v.upcoming || []).map((t, __i11) => (
                        <React.Fragment key={__i11}>
                          <div onClick={t.open} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: "1px solid var(--line)", cursor: "pointer" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "5px", flex: "none", background: t.c }} />
                            <span style={{ flex: "1", minWidth: "0", font: "500 14px 'Geist',sans-serif", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t.title}
                            </span>
                            <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                              {t.due}
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {/* BOARD */}
              {v.isBoard ? (
                <>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", minHeight: "0" }}>
                    <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", height: "48px" }}>
                      <span style={{ font: "600 28px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                        {"Board"}
                      </span>
                      <span style={{ font: "500 13px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>
                        {v.openCount}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", padding: "14px 16px 12px", overflowX: "auto" }}>
                      {(v.colTabs || []).map((c, __i11) => (
                        <React.Fragment key={__i11}>
                          <button onClick={c.onClick} style={{ flex: "none", padding: "0 16px", height: "44px", border: "none", borderRadius: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", font: "600 14px 'Geist',sans-serif", transition: "all .2s", background: c.bg, color: c.fg }}>
                            {c.name}
                            <span style={{ font: "500 12px 'Geist Mono',monospace", opacity: ".7" }}>
                              {c.n}
                            </span>
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ padding: "0 16px 12px" }}>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                        {(v.ownerChips || []).map((o, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={o.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: o.bg, color: o.fg }}>
                              {o.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: "1", overflow: "auto", padding: "0 16px 110px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(v.colItems || []).map((t, __i11) => (
                        <React.Fragment key={__i11}>
                          <div onClick={t.open} style={{ background: "var(--surf)", borderRadius: "22px", padding: "16px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ font: "600 12px 'Geist Mono',monospace", padding: "4px 8px", borderRadius: "8px", background: t.c, color: t.on }}>
                                {t.pl}{" "}{t.pn}
                              </span>
                              <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", flex: "1" }}>
                                {t.key}
                              </span>
                              <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {t.due}
                              </span>
                            </div>
                            <div style={{ font: "500 16px/1.3 'Geist',sans-serif", color: "var(--ink)", textWrap: "pretty", textDecoration: t.deco }}>
                              {t.title}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                              <span style={{ padding: "3px 7px", borderRadius: "7px", background: "var(--surf2)", color: "var(--ink)" }}>
                                {t.typeO}
                              </span>
                              {t.hasSubs ? (
                                <>
                                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--surf2)", overflow: "hidden", display: "block" }}>
                                      <span style={{ display: "block", height: "100%", background: t.c, width: t.subPct }} />
                                    </span>
                                    {t.subTxt}
                                  </span>
                                </>
                              ) : null}
                              {t.hasPr ? (
                                <>
                                  <span>
                                    {"PR "}{t.pr}
                                  </span>
                                </>
                              ) : null}
                              <span style={{ flex: "1" }} />
                              <button onClick={t.advance} aria-label="Move" style={{ height: "32px", padding: "0 12px", borderRadius: "16px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "600 12px 'Geist',sans-serif", cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>
                                {t.advLabel}
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                      {v.colEmpty ? (
                        <>
                          <div style={{ padding: "60px 20px", textAlign: "center", font: "400 14px 'Geist',sans-serif", color: "var(--mute)" }}>
                            {"Nothing here. Enjoy it."}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : null}
              {v.isBoardDesk ? (
                <>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", minHeight: "0", padding: "28px 32px 0" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                      <span style={{ font: "600 32px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                        {"Board"}
                      </span>
                      <span style={{ font: "500 13px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>
                        {v.openCount}
                      </span>
                    </div>
                    <div style={{ padding: "16px 0 0", marginBottom: "-2px" }}>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                        {(v.ownerChips || []).map((o, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={o.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: o.bg, color: o.fg }}>
                              {o.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: "1", display: "grid", gridTemplateColumns: "repeat(5,minmax(250px,1fr))", gap: "14px", minHeight: "0", overflowX: "auto", padding: "18px 0 28px" }}>
                      {(v.boardCols || []).map((c, __i11) => (
                        <React.Fragment key={__i11}>
                          <div style={{ display: "flex", flexDirection: "column", minHeight: "0", background: "var(--surf2)", borderRadius: "26px", padding: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 14px" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "10px", font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                                <span style={{ width: "10px", height: "10px", borderRadius: "5px", background: c.dot }} />
                                {c.name}
                              </span>
                              <span style={{ font: "600 12px 'Geist Mono',monospace", padding: "3px 9px", borderRadius: "10px", background: "var(--surf)", color: "var(--ink)" }}>
                                {c.n}
                              </span>
                            </div>
                            <div style={{ flex: "1", overflow: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                              {(c.items || []).map((t, __i15) => (
                                <React.Fragment key={__i15}>
                                  <div onClick={t.open} style={{ background: "var(--surf)", borderRadius: "20px", padding: "14px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <span style={{ font: "600 11px 'Geist Mono',monospace", padding: "3px 7px", borderRadius: "7px", background: t.c, color: t.on }}>
                                        {t.pl}
                                      </span>
                                      <span style={{ font: "500 11px 'Geist Mono',monospace", color: "var(--mute)", flex: "1" }}>
                                        {t.key}
                                      </span>
                                      <span style={{ font: "500 11px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>
                                        {t.due}
                                      </span>
                                    </div>
                                    <div style={{ font: "500 15px/1.3 'Geist',sans-serif", color: "var(--ink)", textWrap: "pretty", textDecoration: t.deco }}>
                                      {t.title}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", font: "500 11px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap" }}>
                                      <span style={{ padding: "3px 7px", borderRadius: "7px", background: "var(--surf2)", color: "var(--ink)" }}>
                                        {t.typeO}
                                      </span>
                                      {t.hasSubs ? (
                                        <>
                                          <span>
                                            {"☐ "}{t.subTxt}
                                          </span>
                                        </>
                                      ) : null}
                                      {t.hasPr ? (
                                        <>
                                          <span>
                                            {"PR "}{t.pr}
                                          </span>
                                        </>
                                      ) : null}
                                      <span style={{ flex: "1" }} />
                                      <button onClick={t.advance} style={{ height: "30px", padding: "0 11px", borderRadius: "15px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", font: "600 12px 'Geist',sans-serif", cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>
                                        {t.advLabel}
                                      </button>
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {/* SEARCH */}
              {v.isSearch ? (
                <>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", minHeight: "0" }}>
                    <div style={{ padding: "16px 16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "52px", padding: "0 16px", borderRadius: "26px", background: "var(--surf)", color: "var(--mute)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="11" cy="11" r="6.5" />
                          <path d="M20 20l-4-4" />
                        </svg>
                        <input value={v.q ?? ''} onChange={v.onQ} placeholder="Search tasks, IDs, owners" style={{ flex: "1", border: "none", outline: "none", background: "transparent", font: "400 16px 'Geist',sans-serif", color: "var(--ink)", minWidth: "0" }} />
                        {v.hasQ ? (
                          <>
                            <button onClick={v.clearQ} aria-label="Clear" style={{ border: "none", background: "none", color: "var(--mute)", cursor: "pointer", padding: "8px", display: "flex" }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                <path d="M6 6l12 12M18 6L6 18" />
                              </svg>
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "8px 16px 12px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {(v.priFilters || []).map((p, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={p.onClick} style={{ flex: "1", height: "40px", borderRadius: "20px", cursor: "pointer", font: "600 13px 'Geist Mono',monospace", transition: "all .2s", border: `2px solid ${p.c}`, background: p.bg, color: p.fg }}>
                              {p.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                        {(v.typeFilters || []).map((f, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={f.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: f.bg, color: f.fg }}>
                              {f.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                        {(v.ownerChips || []).map((o, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={o.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: o.bg, color: o.fg }}>
                              {o.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                        {(v.statusFilters || []).map((f, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={f.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: f.bg, color: f.fg }}>
                              {f.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "4px 20px 8px", font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                      {v.resultsLabel}
                    </div>
                    <div style={{ flex: "1", overflow: "auto", padding: "0 16px 110px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(v.results || []).map((t, __i11) => (
                        <React.Fragment key={__i11}>
                          <div onClick={t.open} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "var(--surf)", borderRadius: "18px", cursor: "pointer" }}>
                            <span style={{ width: "4px", alignSelf: "stretch", borderRadius: "2px", flex: "none", background: t.c }} />
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ font: "500 14px/1.3 'Geist',sans-serif", color: "var(--ink)", textDecoration: t.deco }}>
                                {t.title}
                              </span>
                              <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {t.key}{" · "}{t.typeO}{" · "}{t.statusName}
                              </span>
                            </div>
                            <span style={{ font: "600 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                              {t.pl}
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {/* REVIEW */}
              {v.isReview ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", padding: "8px 16px 110px" }}>
                    <div style={{ padding: "8px 4px 20px" }}>
                      <div style={{ font: "500 14px 'Geist Mono',monospace", color: "var(--mute)" }}>
                        {v.weekLabel}
                      </div>
                      <div style={{ font: "600 28px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)", marginTop: "6px" }}>
                        {"Weekly review"}
                      </div>
                    </div>
                    <div style={{ background: "var(--ink)", color: "var(--bg)", borderRadius: "26px", padding: "22px", display: "flex", flexDirection: "column", gap: "20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ font: "700 72px/0.85 'Geist',sans-serif", letterSpacing: "-.05em" }}>
                            {v.doneCount}
                          </div>
                          <div style={{ font: "500 14px 'Geist',sans-serif", marginTop: "10px", opacity: ".7" }}>
                            {"tasks shipped"}
                          </div>
                        </div>
                        <span style={{ font: "600 13px 'Geist Mono',monospace", padding: "6px 10px", borderRadius: "10px", background: "var(--sig)", color: "#0F0F12" }}>
                          {v.weekDelta}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "96px" }}>
                        {(v.week || []).map((d, __i12) => (
                          <React.Fragment key={__i12}>
                            <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%", justifyContent: "flex-end" }}>
                              <div style={{ width: "100%", borderRadius: "8px", height: d.h, background: d.bg }} />
                              <span style={{ font: "500 11px 'Geist Mono',monospace", opacity: ".6" }}>
                                {d.l}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                      <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "600 26px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                          {v.blockedN}
                        </span>
                        <span style={{ font: "400 13px 'Geist',sans-serif", color: "var(--mute)" }}>
                          {"blocked now"}
                        </span>
                      </div>
                      <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "600 26px 'Geist',sans-serif", letterSpacing: "-.03em", color: "var(--ink)" }}>
                          {v.overdueN}
                        </span>
                        <span style={{ font: "400 13px 'Geist',sans-serif", color: "var(--mute)" }}>
                          {"overdue"}
                        </span>
                      </div>
                    </div>
                    <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "18px 16px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                        {"Shipped by priority"}
                      </span>
                      <div style={{ display: "flex", gap: "3px", height: "14px" }}>
                        {(v.priMix || []).map((p, __i12) => (
                          <React.Fragment key={__i12}>
                            <div style={{ borderRadius: "4px", flex: p.n, background: p.c }} />
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                        {(v.priMix || []).map((p, __i12) => (
                          <React.Fragment key={__i12}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "4px", background: p.c }} />
                              {p.label}{" · "}{p.n}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "24px 4px 10px" }}>
                      <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                        {"Shipped"}
                      </span>
                    </div>
                    <div style={{ background: "var(--surf)", borderRadius: "20px", overflow: "hidden" }}>
                      {(v.doneList || []).map((t, __i11) => (
                        <React.Fragment key={__i11}>
                          <div onClick={t.open} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: "1px solid var(--line)", cursor: "pointer" }}>
                            <span style={{ width: "20px", height: "20px", borderRadius: "10px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: t.c, color: t.on }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            </span>
                            <span style={{ flex: "1", minWidth: "0", font: "500 14px 'Geist',sans-serif", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t.title}
                            </span>
                            <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                              {t.due}
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", padding: "16px", borderRadius: "20px", border: "1.5px dashed var(--line)" }}>
                      <span style={{ flex: "1", font: "400 14px/1.4 'Geist',sans-serif", color: "var(--mute)" }}>
                        <span style={{ color: "var(--ink)", fontWeight: "600" }}>
                          {v.carryN}{" open tasks"}
                        </span>
                        {" still open."}
                      </span>
                      <button onClick={v.goBoard} style={{ border: "none", height: "40px", padding: "0 16px", borderRadius: "20px", background: "var(--surf2)", color: "var(--ink)", font: "600 13px 'Geist',sans-serif", cursor: "pointer" }}>
                        {"Plan"}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {/* DETAIL */}
              {v.isDetail ? (
                <>
                  <div style={{ flex: "1", overflow: "auto", paddingBottom: "100px" }}>
                    <div style={{ padding: "4px 16px 26px", transition: "background .25s", background: v.d.c, color: v.d.on }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px" }}>
                        <button onClick={v.back} aria-label="Back" style={{ width: "44px", height: "44px", marginLeft: "-10px", border: "none", background: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 5l-7 7 7 7" />
                          </svg>
                        </button>
                        <span style={{ font: "500 13px 'Geist Mono',monospace", opacity: ".85", whiteSpace: "nowrap" }}>
                          {v.d.key}
                        </span>
                      </div>
                      <div style={{ font: "600 12px 'Geist Mono',monospace", letterSpacing: ".08em", opacity: ".85", marginTop: "6px" }}>
                        {v.d.pl}{" "}{v.d.pn}{" · "}{v.d.type}
                      </div>
                      <div style={{ font: "600 27px/1.12 'Geist',sans-serif", letterSpacing: "-.025em", marginTop: "10px", textWrap: "pretty" }}>
                        {v.d.title}
                      </div>
                      <div style={{ font: "500 13px 'Geist Mono',monospace", marginTop: "14px", opacity: ".85" }}>
                        {v.d.dueLine}
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", paddingLeft: "4px" }}>
                          {"STATUS"}
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {(v.statusOpts || []).map((s, __i13) => (
                            <React.Fragment key={__i13}>
                              <button onClick={s.onClick} style={{ height: "38px", padding: "0 14px", borderRadius: "19px", cursor: "pointer", font: "600 13px 'Geist',sans-serif", transition: "all .2s", border: `2px solid ${s.bd}`, background: s.bg, color: s.fg }}>
                                {s.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", padding: "4px 0 0 4px" }}>
                          {"PRIORITY"}
                        </span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {(v.priOpts || []).map((p, __i13) => (
                            <React.Fragment key={__i13}>
                              <button onClick={p.onClick} style={{ flex: "1", height: "44px", borderRadius: "14px", cursor: "pointer", font: "600 13px 'Geist Mono',monospace", transition: "all .2s", border: `2px solid ${p.c}`, background: p.bg, color: p.fg }}>
                                {p.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", paddingLeft: "4px" }}>
                          {"OWNER"}
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {(v.ownerOpts || []).map((o, __i13) => (
                            <React.Fragment key={__i13}>
                              <button onClick={o.onClick} style={{ height: "38px", padding: "0 14px", border: "none", borderRadius: "19px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: o.bg, color: o.fg }}>
                                {o.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", padding: "4px 0 0 4px" }}>
                          {"COST"}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button onClick={v.toggleCost} style={{ height: "44px", padding: "0 16px", borderRadius: "14px", border: "1px solid var(--line)", background: "var(--surf2)", color: "var(--ink)", font: "600 13px 'Geist Mono',monospace", cursor: "pointer", whiteSpace: "nowrap" }}>
                            {"Required: "}{v.d.costReqTxt}
                          </button>
                          <input type="number" inputMode="decimal" value={v.d.costVal ?? ''} onChange={v.onCost} placeholder="Tentative cost" style={{ flex: "1", minWidth: "0", height: "44px", boxSizing: "border-box", borderRadius: "14px", border: "1px solid var(--line)", background: "transparent", padding: "0 14px", font: "400 15px 'Geist',sans-serif", color: "var(--ink)", outline: "none" }} />
                        </div>
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", padding: "4px 0 0 4px" }}>
                          {"NOTES"}
                        </span>
                        <textarea value={v.d.notes ?? ''} onChange={v.onNotes} rows="3" placeholder="Context, links, decisions" style={{ width: "100%", boxSizing: "border-box", borderRadius: "14px", border: "1px solid var(--line)", background: "transparent", padding: "12px 14px", font: "400 15px/1.4 'Geist',sans-serif", color: "var(--ink)", outline: "none", resize: "vertical" }} />
                        <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", paddingLeft: "4px" }}>
                          {"START "}{v.d.startTxt}{" · END "}{v.d.endTxt}
                        </span>
                      </div>
                      <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px 8px" }}>
                          <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                            {"CHECKLIST"}
                          </span>
                          <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                            {v.d.subTxt}
                          </span>
                        </div>
                        {(v.subRows || []).map((s, __i12) => (
                          <React.Fragment key={__i12}>
                            <button onClick={s.toggle} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "0 4px", border: "none", background: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}>
                              <span style={{ width: "22px", height: "22px", borderRadius: "7px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s", border: `2px solid ${v.d.c}`, background: s.bg, color: v.d.on }}>
                                {s.d ? (
                                  <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                                    </svg>
                                  </>
                                ) : null}
                              </span>
                              <span style={{ font: "400 15px 'Geist',sans-serif", color: "var(--ink)", textDecoration: s.deco, opacity: s.op }}>
                                {s.t}
                              </span>
                            </button>
                          </React.Fragment>
                        ))}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "0 4px" }}>
                          <span style={{ width: "22px", height: "22px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mute)" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </span>
                          <input value={v.newSub ?? ''} onChange={v.onNewSub} onKeyDown={v.onSubKey} placeholder="Add step, press Enter" style={{ flex: "1", border: "none", outline: "none", background: "transparent", font: "400 15px 'Geist',sans-serif", color: "var(--ink)", minWidth: "0" }} />
                        </div>
                      </div>
                      <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                        <span style={{ width: "44px", height: "44px", borderRadius: "14px", flex: "none", background: "var(--surf2)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="6" cy="5" r="2" />
                            <circle cx="6" cy="19" r="2" />
                            <circle cx="18" cy="19" r="2" />
                            <path d="M6 7v10M18 17V9a3 3 0 00-3-3h-4" />
                            <path d="M13 3.5L10.5 6 13 8.5" />
                          </svg>
                        </span>
                        {v.d.hasPr ? (
                          <>
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                                {"PR "}{v.d.pr}
                              </span>
                              <span style={{ font: "400 12px 'Geist Mono',monospace", color: "var(--mute)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {v.d.branch}
                              </span>
                            </div>
                            <span style={{ font: "600 12px 'Geist Mono',monospace", padding: "5px 9px", borderRadius: "8px", background: v.d.prBg, color: v.d.prFg }}>
                              {v.d.prState}
                            </span>
                          </>
                        ) : null}
                        {v.d.noPr ? (
                          <>
                            <span style={{ flex: "1", font: "500 15px 'Geist',sans-serif", color: "var(--mute)" }}>
                              {"No pull request"}
                            </span>
                            <button onClick={v.linkPr} style={{ border: "none", height: "40px", padding: "0 16px", borderRadius: "20px", background: "var(--ink)", color: "var(--bg)", font: "600 13px 'Geist',sans-serif", cursor: "pointer" }}>
                              {"Link PR"}
                            </button>
                          </>
                        ) : null}
                      </div>
                      {v.d.shot ? (
                        <>
                          <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)", paddingLeft: "4px" }}>
                              {"BUG SCREENSHOT"}
                            </span>
                            <div style={{ height: "150px", borderRadius: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--mute)", background: "repeating-linear-gradient(135deg,var(--surf2) 0 10px,transparent 10px 20px)", border: "1px solid var(--line)" }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <circle cx="9" cy="10" r="2" />
                                <path d="M21 16l-5-5-9 9" />
                              </svg>
                              <span style={{ font: "500 12px 'Geist Mono',monospace" }}>
                                {"checkout-error.png"}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {v.d.hasFrom ? (
                        <>
                          <div style={{ background: "var(--surf)", borderRadius: "20px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                            <span style={{ width: "44px", height: "44px", borderRadius: "22px", flex: "none", background: "var(--sig)", color: "#0F0F12", display: "flex", alignItems: "center", justifyContent: "center", font: "600 15px 'Geist',sans-serif" }}>
                              {v.d.fromInitial}
                            </span>
                            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                              <span style={{ font: "500 12px 'Geist Mono',monospace", color: "var(--mute)" }}>
                                {"REQUESTED BY"}
                              </span>
                              <span style={{ font: "600 15px 'Geist',sans-serif", color: "var(--ink)" }}>
                                {v.d.from}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div style={v.detailBar}>
                    <button onClick={v.d.focus} style={{ width: "100%", maxWidth: "688px", height: "56px", border: "none", borderRadius: "28px", background: "var(--ink)", color: "var(--bg)", font: "600 16px 'Geist',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
                      </svg>
                      {"Start focus session"}
                    </button>
                  </div>
                </>
              ) : null}
              {/* FOCUS */}
              {v.isFocus ? (
                <>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", background: "#0B0B0E", color: "#F4F3F8", padding: "8px 20px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px" }}>
                      <button onClick={v.back} aria-label="Close" style={{ width: "44px", height: "44px", marginLeft: "-10px", border: "none", background: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                      <span style={{ font: "600 12px 'Geist Mono',monospace", letterSpacing: ".08em", color: "#8E8D99" }}>
                        {"FOCUS · "}{v.f.key}
                      </span>
                      <span style={{ width: "44px" }} />
                    </div>
                    <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
                      <div style={{ position: "relative", width: "260px", height: "260px" }}>
                        <svg width="260" height="260" viewBox="0 0 260 260" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="130" cy="130" r="120" fill="none" stroke="#1F1F26" strokeWidth="10" />
                          <circle cx="130" cy="130" r="120" fill="none" stroke={v.f.c} strokeWidth="10" strokeLinecap="round" strokeDasharray="753.98" strokeDashoffset={v.ringOff} style={{ transition: "stroke-dashoffset 1s linear" }} />
                        </svg>
                        <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <span style={{ font: "600 60px 'Geist Mono',monospace", letterSpacing: "-.04em" }}>
                            {v.clock}
                          </span>
                          <span style={{ font: "500 12px 'Geist Mono',monospace", color: "#8E8D99" }}>
                            {v.focusState}
                          </span>
                        </div>
                      </div>
                      <div style={{ font: "600 22px/1.2 'Geist',sans-serif", letterSpacing: "-.02em", textAlign: "center", textWrap: "pretty", maxWidth: "320px" }}>
                        {v.f.title}
                      </div>
                      {v.f.nextSub ? (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "16px", background: "#16161C", font: "400 14px 'Geist',sans-serif", maxWidth: "320px" }}>
                            <span style={{ font: "600 11px 'Geist Mono',monospace", color: v.f.c }}>
                              {"NEXT"}
                            </span>
                            {v.f.nextSub}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={v.toggleRun} style={{ flex: "1", height: "60px", border: "none", borderRadius: "30px", background: "#1F1F26", color: "#F4F3F8", font: "600 16px 'Geist',sans-serif", cursor: "pointer" }}>
                        {v.runLabel}
                      </button>
                      <button onClick={v.f.complete} style={{ flex: "1", height: "60px", border: "none", borderRadius: "30px", font: "600 16px 'Geist',sans-serif", cursor: "pointer", background: v.f.c, color: v.f.on }}>
                        {"Mark done"}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {/* BOTTOM NAV */}
          {v.showNav ? (
            <>
              <div style={{ position: "absolute", left: "12px", right: "12px", bottom: "calc(12px + env(safe-area-inset-bottom))", height: "68px", borderRadius: "34px", background: "var(--surf)", boxShadow: "0 10px 30px rgba(0,0,0,.12),0 0 0 1px var(--line)", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px", zIndex: "20" }}>
                <button onClick={v.goToday} aria-label="Today" style={{ width: "52px", height: "52px", border: "none", borderRadius: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", background: v.nav.today.bg, color: v.nav.today.fg }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
                  </svg>
                </button>
                <button onClick={v.goBoard} aria-label="Board" style={{ width: "52px", height: "52px", border: "none", borderRadius: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", background: v.nav.board.bg, color: v.nav.board.fg }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                    <rect x="3" y="4" width="5" height="16" rx="1.5" />
                    <rect x="10" y="4" width="5" height="11" rx="1.5" />
                    <rect x="17" y="4" width="4" height="7" rx="1.5" />
                  </svg>
                </button>
                <button onClick={v.openSheet} aria-label="Quick add" style={{ width: "56px", height: "56px", border: "none", borderRadius: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--sig)", color: "#0F0F12", boxShadow: "0 6px 16px rgba(0,0,0,.18)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <button onClick={v.goReview} aria-label="Review" style={{ width: "52px", height: "52px", border: "none", borderRadius: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", background: v.nav.review.bg, color: v.nav.review.fg }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M5 20v-8M12 20V5M19 20v-5" />
                  </svg>
                </button>
                <button onClick={v.goSearch} aria-label="Search" style={{ width: "52px", height: "52px", border: "none", borderRadius: "26px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", background: v.nav.search.bg, color: v.nav.search.fg }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="M20 20l-4-4" />
                  </svg>
                </button>
              </div>
            </>
          ) : null}
          {/* QUICK ADD SHEET */}
          <div style={{ position: "absolute", inset: "0", zIndex: "40", pointerEvents: v.sheetPE }}>
            <div onClick={v.closeSheet} style={{ position: "absolute", inset: "0", background: "rgba(0,0,0,.45)", transition: "opacity .25s", opacity: v.sheetOp }} />
            <div style={v.sheetBox}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--line)", alignSelf: "center", marginBottom: "4px", display: v.handleDisp }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "6px", marginTop: "9px", flex: "none", transition: "background .2s", background: v.pv.c }} />
                <textarea ref={v.inputRef} value={v.draft ?? ''} onChange={v.onDraft} onKeyDown={v.onDraftKey} rows="2" placeholder="What needs doing?" style={{ flex: "1", border: "none", outline: "none", resize: "none", background: "transparent", font: "500 20px/1.35 'Geist',sans-serif", color: "var(--ink)", minWidth: "0" }} />
              </div>
              <div style={{ font: "400 12px 'Geist Mono',monospace", color: "var(--mute)", paddingLeft: "24px" }}>
                {"Shortcuts: !p0–!p3 · #tech #ops · @name"}
              </div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                {(v.sheetOwners || []).map((o, __i8) => (
                  <React.Fragment key={__i8}>
                    <button onClick={o.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "1px solid var(--line)", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: o.bg, color: o.fg }}>
                      {"@"}{o.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {(v.sheetPri || []).map((p, __i8) => (
                  <React.Fragment key={__i8}>
                    <button onClick={p.onClick} style={{ flex: "1", height: "44px", borderRadius: "14px", cursor: "pointer", font: "600 13px 'Geist Mono',monospace", transition: "all .2s", border: `2px solid ${p.c}`, background: p.bg, color: p.fg }}>
                      {p.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
                {(v.sheetTypes || []).map((f, __i8) => (
                  <React.Fragment key={__i8}>
                    <button onClick={f.onClick} style={{ flex: "none", height: "36px", padding: "0 14px", border: "none", borderRadius: "18px", cursor: "pointer", font: "500 13px 'Geist',sans-serif", background: f.bg, color: f.fg }}>
                      {f.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {(v.sheetDue || []).map((f, __i8) => (
                  <React.Fragment key={__i8}>
                    <button onClick={f.onClick} style={{ height: "36px", padding: "0 12px", borderRadius: "10px", cursor: "pointer", font: "500 12px 'Geist Mono',monospace", border: "1px solid var(--line)", background: f.bg, color: f.fg }}>
                      {f.label}
                    </button>
                  </React.Fragment>
                ))}
                <span style={{ flex: "1" }} />
                <button onClick={v.addTask} style={{ height: "48px", padding: "0 22px", border: "none", borderRadius: "24px", font: "600 15px 'Geist',sans-serif", cursor: "pointer", transition: "opacity .2s", background: "var(--ink)", color: "var(--bg)", opacity: v.addOp }}>
                  {"Add"}
                </button>
              </div>
            </div>
          </div>
          {v.hasToast ? (
            <>
              <div style={{ ...css(v.toastPos), zIndex: "30", padding: "14px 18px", borderRadius: "16px", background: "var(--ink)", color: "var(--bg)", font: "500 14px 'Geist',sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  {v.toast}
                </span>
                <span style={{ font: "500 12px 'Geist Mono',monospace", opacity: ".7" }}>
                  {"BGDX"}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
    </>
  );
}
