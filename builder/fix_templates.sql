-- Este script ARREGLA tu tabla de plantillas.
-- Simplemente cópialo y ejecútalo en Supabase SQL Editor.

-- 1. Agregar la columna que falta (author_pfp)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_templates' AND column_name = 'author_pfp') THEN 
        ALTER TABLE public.community_templates ADD COLUMN author_pfp TEXT; 
    END IF; 
END $$;

-- 2. Asegurar que RLS esta activo
ALTER TABLE public.community_templates ENABLE ROW LEVEL SECURITY;

-- 3. Resetear Políticas (Policies) para que TODOS puedan ver

-- Borrar viejas políticas para evitar conflictos
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON public.community_templates;
DROP POLICY IF EXISTS "Authenticated users can upload templates" ON public.community_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.community_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.community_templates;

-- Crear nuevas políticas CORRECTAS
-- 3.1 CUALQUIERA puede VER (Select)
CREATE POLICY "Public templates are viewable by everyone" 
ON public.community_templates FOR SELECT 
USING (true);

-- 3.2 Usuarios Logueados pueden SUBIR (Insert)
CREATE POLICY "Authenticated users can upload templates" 
ON public.community_templates FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

-- 3.3 Autores pueden EDITAR (Update)
CREATE POLICY "Users can update their own templates" 
ON public.community_templates FOR UPDATE 
TO authenticated 
USING (auth.uid() = author_id);

-- 3.4 Autores pueden BORRAR (Delete)
CREATE POLICY "Users can delete their own templates" 
ON public.community_templates FOR DELETE 
TO authenticated 
USING (auth.uid() = author_id);

-- 4. Almacenamiento (Storage) de imágenes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('template-previews', 'template-previews', true)
ON CONFLICT (id) DO NOTHING;

-- Policies de Storage
DROP POLICY IF EXISTS "Public Access to Template Previews" ON storage.objects;
CREATE POLICY "Public Access to Template Previews"
ON storage.objects FOR SELECT
USING ( bucket_id = 'template-previews' );

DROP POLICY IF EXISTS "Authenticated Users can Upload Previews" ON storage.objects;
CREATE POLICY "Authenticated Users can Upload Previews"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'template-previews' );
