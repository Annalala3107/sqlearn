-- ========================================================
-- SQL THÁM TỬ - SCRIPT KHỞI TẠO CƠ SỞ DỮ LIỆU SUPABASE
-- Dự án: dwjreceajfrtuycsalzw
-- Thực hiện tại: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. BẢNG HỒ SƠ & PHÂN QUYỀN THÁM TỬ (PROFILES)
create table if not exists public.profiles (
  id text primary key,
  email text,
  name text,
  avatar_url text,
  role text default 'learner', -- 'learner' (Học Viên) hoặc 'admin' (Quản Trị Viên)
  xp integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Kích hoạt Row Level Security (RLS) bảo mật dữ liệu
alter table public.profiles enable row level security;

-- Thiết lập quyền truy cập cho bảng profiles
drop policy if exists "Public profiles viewable by all" on public.profiles;
create policy "Public profiles viewable by all"
  on public.profiles for select
  using (true);

drop policy if exists "Allow insert profiles" on public.profiles;
create policy "Allow insert profiles"
  on public.profiles for insert
  with check (true);

drop policy if exists "Allow update profiles" on public.profiles;
create policy "Allow update profiles"
  on public.profiles for update
  using (true);

-- 2. BẢNG TIẾN TRÌNH HỌC TẬP & ĐIỂM SỐ (USER_STATS)
create table if not exists public.user_stats (
  user_id text primary key,
  xp integer default 0,
  rank text default 'Thám Tử Tập Sự',
  solved_case_ids jsonb default '[]'::jsonb,
  completed_lesson_ids jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Kích hoạt RLS cho user_stats
alter table public.user_stats enable row level security;

drop policy if exists "Allow select user_stats" on public.user_stats;
create policy "Allow select user_stats"
  on public.user_stats for select
  using (true);

drop policy if exists "Allow insert user_stats" on public.user_stats;
create policy "Allow insert user_stats"
  on public.user_stats for insert
  with check (true);

drop policy if exists "Allow update user_stats" on public.user_stats;
create policy "Allow update user_stats"
  on public.user_stats for update
  using (true);

-- 3. TỰ ĐỘNG ĐỒNG BỘ KHI CÓ USER ĐĂNG KÝ MỚI TỪ SUPABASE AUTH
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, avatar_url)
  values (
    new.id::text,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'learner',
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger kích hoạt tự động
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================================
-- 4. CÂU LỆNH CẤP QUYỀN ADMIN (QUẢN TRỊ VIÊN) CHO TÀI KHOẢN CỦA BẠN:
-- (Thay thế bằng email Gmail chính chủ của bạn)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your_email@gmail.com';
-- ========================================================
