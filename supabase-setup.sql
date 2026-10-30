-- ========================================================
-- SQL THÁM TỬ - SCRIPT THIẾT LẬP CƠ SỞ DỮ LIỆU SUPABASE
-- Dự án: dwjreceajfrtuycsalzw
-- Chạy script này tại: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Bảng lưu thông tin hồ sơ và phân quyền người dùng (profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  role text default 'learner', -- 'admin' hoặc 'learner'
  xp integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Kích hoạt Row Level Security (RLS) bảo mật dữ liệu
alter table public.profiles enable row level security;

-- Drop policy cũ nếu có để tránh trùng lặp
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;

-- Cho phép mọi người đọc hồ sơ (để xem tên, cấp bậc)
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using (true);

-- Cho phép người dùng chỉnh sửa hồ sơ của chính mình
create policy "Users can update their own profile."
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Tự động tạo bản ghi trong bảng profiles khi có người đăng ký mới (auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'learner'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger kích hoạt function trên
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================================
-- 3. HƯỚNG DẪN CẤP QUYỀN ADMIN CHO TÀI KHOẢN CỦA BẠN:
-- Sau khi bạn đăng ký tài khoản trên web xong, chạy dòng lệnh sau:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'email_cua_ban@gmail.com';
-- ========================================================
