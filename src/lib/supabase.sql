-- 1️⃣ Create profiles table
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null,
    avatar_url text,
    bio text,
    settings jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- 2️⃣ Create marketplace listings
create type listing_type as enum ('BUY', 'SELL', 'LOOKING');

create table listings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    title text not null,
    description text not null,
    type listing_type not null,
    images text[] default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Trigger to auto-update updated_at
create function update_updated_at_column()
returns trigger as $$
begin
   new.updated_at = now();
   return new;
end;
$$ language 'plpgsql';

create trigger update_listings_updated_at
before update on listings
for each row
execute function update_updated_at_column();

-- 3️⃣ Reviews table
create table reviews (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    title text,
    content text not null,
    rating int check (rating >= 1 and rating <= 5),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create trigger update_reviews_updated_at
before update on reviews
for each row
execute function update_updated_at_column();

-- 4️⃣ Comments table
create table comments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    post_id uuid not null, -- references listings.id or reviews.id
    post_type text check (post_type in ('listing', 'review')),
    content text not null,
    created_at timestamp with time zone default now()
);

-- 5️⃣ Indexes
create index idx_listings_user on listings(user_id);
create index idx_reviews_user on reviews(user_id);
create index idx_comments_user on comments(user_id);
create index idx_comments_post on comments(post_id);

-- 6️⃣ Enable RLS
alter table profiles enable row level security;
alter table listings enable row level security;
alter table reviews enable row level security;
alter table comments enable row level security;

-- 7️⃣ Policies
-- Profiles
create policy "select_profiles" on profiles for select using (true);
create policy "update_own_profile" on profiles for update using (auth.uid() = id);
create policy "no_delete_profiles" on profiles for delete using (false);

-- Listings
create policy "select_listings" on listings for select using (true);
create policy "insert_own_listing" on listings for insert with check (auth.uid() = user_id);
create policy "update_own_listing" on listings for update using (auth.uid() = user_id);
create policy "delete_own_listing" on listings for delete using (auth.uid() = user_id);

-- Reviews
create policy "select_reviews" on reviews for select using (true);
create policy "insert_own_review" on reviews for insert with check (auth.uid() = user_id);
create policy "update_own_review" on reviews for update using (auth.uid() = user_id);
create policy "delete_own_review" on reviews for delete using (auth.uid() = user_id);

-- Comments
create policy "select_comments" on comments for select using (true);
create policy "insert_own_comment" on comments for insert with check (auth.uid() = user_id);
create policy "update_own_comment" on comments for update using (auth.uid() = user_id);
create policy "delete_own_comment" on comments for delete using (auth.uid() = user_id);
