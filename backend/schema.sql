-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table users (
  id uuid primary key references auth.users(id),
  email text,
  created_at timestamp with time zone default now()
);

-- Providers Table (Google, Microsoft, Apple)
create table providers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) not null,
  type varchar(20) not null, -- 'google', 'microsoft', 'apple'
  access_token text,
  refresh_token text,
  metadata jsonb, -- For sync tokens, last_sync_time
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Unified Items Table (Tasks and Events)
create table items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) not null,
  provider_id uuid references providers(id),
  external_id text, -- ID in Google/MS
  title text not null,
  description text,
  data jsonb, -- Full payload specific to provider
  is_task boolean default true, -- true = task, false = event
  due_date timestamp with time zone,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_items_user_id on items(user_id);
create index idx_items_provider_id on items(provider_id);
create index idx_providers_user_id on providers(user_id);
