-- Bootstrap a profile from the authenticated user. Campus assignment is deliberately nullable until verified.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Bucket is private. UI receives signed URLs rather than public object URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('item-images', 'item-images', false, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Required object path: <auth.uid()>/<item-id>/<filename>
create policy item_images_storage_read on storage.objects for select
to authenticated
using (bucket_id = 'item-images');

create policy item_images_storage_insert on storage.objects for insert
to authenticated
with check (
  bucket_id = 'item-images' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy item_images_storage_update on storage.objects for update
to authenticated
using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy item_images_storage_delete on storage.objects for delete
to authenticated
using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
