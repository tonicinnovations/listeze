-- v1.12 — Add preferred_language to users
alter table public.users add column if not exists preferred_language text not null default 'en';
