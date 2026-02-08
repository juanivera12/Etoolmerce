-- 1. Enable UUID extension just in case (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the Community Templates Table
CREATE TABLE IF NOT EXISTS public.community_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    structure_json JSONB NOT NULL, -- Stores the array of editor components
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT, -- Display name of the user
    downloads INTEGER DEFAULT 0
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.community_templates ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Policy: SELECT - Anyone (even anonymous) can VIEW templates.
CREATE POLICY "Public templates are viewable by everyone" 
ON public.community_templates FOR SELECT 
USING (true);

-- Policy: INSERT - Only authenticated users can UPLOAD (create) templates.
CREATE POLICY "Authenticated users can upload templates" 
ON public.community_templates FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

-- Policy: UPDATE - Only the author can EDIT their own templates.
CREATE POLICY "Users can update their own templates" 
ON public.community_templates FOR UPDATE 
TO authenticated 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy: DELETE - Only the author can DELETE their own templates.
CREATE POLICY "Users can delete their own templates" 
ON public.community_templates FOR DELETE 
TO authenticated 
USING (auth.uid() = author_id);


-- 5. Storage Bucket Configuration (SQL Approach)
-- Note: It is easier to create buckets via the Supabase Dashboard, but here is the SQL for reference.

-- Create the bucket 'template-previews'
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-previews', 'template-previews', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage Bucket 'template-previews'

-- Allow Public Access to View (Select) images in the bucket
CREATE POLICY "Public Access to Template Previews"
ON storage.objects FOR SELECT
USING ( bucket_id = 'template-previews' );

-- Allow Authenticated Users to Upload (Insert) images to the bucket
CREATE POLICY "Authenticated Users can Upload Previews"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'template-previews' );

-- Update Policy (Optional but good practice)
CREATE POLICY "Users can update own images" 
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'template-previews' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'template-previews' AND auth.uid() = owner );

-- Delete Policy
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'template-previews' AND auth.uid() = owner );
