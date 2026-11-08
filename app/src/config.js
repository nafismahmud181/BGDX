// Public client config. The anon key is meant to be public: row-level security in the database decides what each user can see.
export const SUPABASE_URL = 'https://tcggmvwplynvxspdrpwy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZ2dtdndwbHludnhzcGRycHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwODE1MDIsImV4cCI6MjEwOTY1NzUwMn0.X82DmTRgdtbhc_6b-d-7Ljn-737KZ9NmYd_TPuqVPBo';
export const EMAIL_DOMAIN = 'users.bgdx.app'; // usernames map to <username>@users.bgdx.app (no email is ever sent)
