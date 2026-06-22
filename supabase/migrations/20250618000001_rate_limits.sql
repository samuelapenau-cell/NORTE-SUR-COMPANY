-- Rate limiting table for API endpoints
create table if not exists rate_limits (
  key text primary key,
  count integer default 1,
  reset_at timestamptz not null
);

create index if not exists idx_rate_limits_reset_at on rate_limits(reset_at);

-- Cleanup old entries periodically
create or replace function public.cleanup_rate_limits()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.rate_limits where reset_at < now();
end;
$$;
