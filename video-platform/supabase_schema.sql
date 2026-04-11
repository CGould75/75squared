-- Create Meetings Table
create table public.meetings (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references auth.users(id) not null,
  is_active boolean default true,
  waiting_room_enabled boolean default false,
  passcode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.meetings enable row level security;

-- Policies
create policy "Hosts can manage their own meetings"
  on public.meetings
  for all using (
    auth.uid() = host_id
  );

create policy "Anyone with the ID can view active meetings"
  on public.meetings
  for select using (
    is_active = true
  );

-- Function to handle new user onboarding implicitly via Auth Hooks (Optional)
