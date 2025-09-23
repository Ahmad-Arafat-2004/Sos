-- Seed an admin user (email unique)
insert into users (email, name, role, password_hash)
values (
  'admin@irthbiladi.com',
  'Administrator',
  'admin',
  '$2b$10$OmTic5NRCL5PWJ96yYa5fegaOgoWFDj/GTPTMhqJiOVtUcT0DqBam' -- bcrypt for 'admin123'
)
on conflict (email) do update set role = excluded.role, name = excluded.name, password_hash = excluded.password_hash, updated_at = now();
