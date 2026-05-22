import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://enbqhelnfpsjtzpvdodm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuYnFoZWxuZnBzanR6cHZkb2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDAyODcsImV4cCI6MjA5NDU3NjI4N30.orPx5PlrQ4klhDACnNLWUtgGyDnZhbLShBf3HEGE1kM';
const BUCKET = 'school-assests';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const uploadImage = async (file, schoolSubdomain, folder = 'general') => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${schoolSubdomain}/${folder}/${fileName}`;
  
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  
  if (error) throw new Error(error.message);
  
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
