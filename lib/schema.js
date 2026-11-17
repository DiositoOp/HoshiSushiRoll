// Esquema de la base de datos. Se aplica solo al arrancar (todas las sentencias son idempotentes).
export const SCHEMA = `
create table if not exists restaurants (
  id serial primary key,
  name text not null,
  stamps_goal int not null default 8,
  reward_label text not null default 'Un rollo gratis',
  google_review_url text not null default '',
  review_from_visit int not null default 2,
  max_stamps_per_day int not null default 1,
  tz text not null default 'America/Mexico_City'
);

create table if not exists points (
  id serial primary key,
  restaurant_id int not null references restaurants(id),
  slug text not null unique,
  label text not null,
  active boolean not null default true,
  opens int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  restaurant_id int not null references restaurants(id),
  name text not null,
  phone text not null,
  birth_day int,
  birth_month int,
  address text,
  stamps int not null default 0,
  total_visits int not null default 0,
  last_visit_at timestamptz,
  point_id int references points(id),
  created_at timestamptz not null default now(),
  unique (restaurant_id, phone)
);

create table if not exists devices (
  id serial primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists staff (
  id serial primary key,
  restaurant_id int not null references restaurants(id),
  username text not null unique,
  name text not null,
  role text not null check (role in ('dev', 'owner', 'cashier')),
  pass_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists visits (
  id serial primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  point_id int references points(id),
  code int,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  manual boolean not null default false,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by int references staff(id)
);
create index if not exists visits_status_idx on visits (status, created_at);
create index if not exists visits_customer_idx on visits (customer_id, created_at);

create table if not exists rewards (
  id serial primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  delivered_by int references staff(id)
);

create table if not exists link_codes (
  code text primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  created_by int references staff(id),
  expires_at timestamptz not null
);

create table if not exists events (
  id bigserial primary key,
  restaurant_id int not null references restaurants(id),
  at timestamptz not null default now(),
  type text not null,
  detail text not null default '',
  customer_id uuid,
  staff_id int
);
create index if not exists events_at_idx on events (at desc);

-- Hoshito: mascota virtual para la comunidad cercana (clientes frecuentes, equipo y amigos).
alter table customers add column if not exists hoshito_access boolean not null default false;

create table if not exists hoshito_pets (
  customer_id uuid primary key references customers(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Un giro de la ruleta por cada sello confirmado (y uno de bienvenida al dar acceso).
create table if not exists hoshito_spins (
  id serial primary key,
  customer_id uuid not null references customers(id) on delete cascade,
  reason text not null default 'sello',
  created_at timestamptz not null default now(),
  opened_at timestamptz,
  prize text,
  rarity text
);
create index if not exists hoshito_spins_customer_idx on hoshito_spins (customer_id, opened_at);

-- Objetos exclusivos ganados (ruleta, camino de visitas) y premios del camino ya cobrados.
create table if not exists hoshito_unlocks (
  customer_id uuid not null references customers(id) on delete cascade,
  item_id text not null,
  source text not null,
  created_at timestamptz not null default now(),
  primary key (customer_id, item_id)
);

-- Ranking semanal de la comunidad: mejor marca de cada persona por juego y semana.
create table if not exists hoshito_scores (
  customer_id uuid not null references customers(id) on delete cascade,
  game text not null,
  week text not null,
  score int not null,
  updated_at timestamptz not null default now(),
  primary key (customer_id, game, week)
);
create index if not exists hoshito_scores_week_idx on hoshito_scores (week, game);

-- Premios del podio ya cobrados.
create table if not exists hoshito_trophies (
  customer_id uuid not null references customers(id) on delete cascade,
  week text not null,
  game text not null,
  place int not null,
  created_at timestamptz not null default now(),
  primary key (customer_id, week, game)
);
-- Amigos de Hoshito: a quién agregó cada quien (por teléfono o desde la comunidad).
create table if not exists hoshito_friends (
  customer_id uuid not null references customers(id) on delete cascade,
  friend_id uuid not null references customers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, friend_id)
);

-- Saludos y regalos entre Hoshitos. Se quedan en el buzón hasta que el otro abre el juego.
create table if not exists hoshito_gifts (
  id serial primary key,
  from_id uuid not null references customers(id) on delete cascade,
  to_id uuid not null references customers(id) on delete cascade,
  kind text not null,
  food text,
  day text not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);
create index if not exists hoshito_gifts_to_idx on hoshito_gifts (to_id, claimed_at);
create index if not exists hoshito_gifts_from_idx on hoshito_gifts (from_id, day);
create unique index if not exists hoshito_gifts_saludo_idx on hoshito_gifts (from_id, to_id, day) where kind = 'saludo';
`;
