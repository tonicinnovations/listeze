-- v1.0 initial schema
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  plan text not null default 'trial',  -- trial | solo | team | brokerage | lifetime
  trial_generations_used int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.users(id) on delete cascade,
  plan text not null default 'team',
  seat_limit int not null default 5,
  stripe_subscription_id text,
  brand_logo_url text,
  brand_primary_color text,
  created_at timestamptz default now()
);

create table public.team_members (
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text not null default 'member',  -- owner | admin | member
  created_at timestamptz default now(),
  primary key (team_id, user_id)
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  address text not null,
  bedrooms int,
  bathrooms numeric,
  square_feet int,
  lot_size text,
  property_features text,
  location_highlights text,
  property_type text,
  tone_preset text,
  language text not null default 'en',
  created_at timestamptz default now()
);

create table public.generations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  format text not null,
  content text not null,
  fair_housing_score int,
  fair_housing_flags jsonb,
  model_used text,
  tokens_in int,
  tokens_out int,
  cost_cents int,
  created_at timestamptz default now()
);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index idx_listings_user on public.listings(user_id);
create index idx_generations_listing on public.generations(listing_id);
create index idx_generations_user on public.generations(user_id);
create index idx_usage_events_user on public.usage_events(user_id, created_at desc);

-- RLS
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.generations enable row level security;
alter table public.usage_events enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- RLS Policies
create policy "users see own row" on public.users
  for select using (auth.uid() = id);

create policy "users update own row" on public.users
  for update using (auth.uid() = id);

create policy "users see own listings" on public.listings
  for all using (auth.uid() = user_id);

create policy "users see own generations" on public.generations
  for all using (auth.uid() = user_id);

create policy "users see own usage" on public.usage_events
  for all using (auth.uid() = user_id);

create policy "team members see team" on public.teams
  for select using (
    exists (select 1 from public.team_members where team_id = teams.id and user_id = auth.uid())
  );

create policy "team members see membership" on public.team_members
  for select using (user_id = auth.uid());

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
