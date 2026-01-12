-- Add author_email column to memories table (for existing databases)
-- This migration is safe to run even if the column already exists

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'memories' 
    AND column_name = 'author_email'
  ) THEN
    ALTER TABLE public.memories ADD COLUMN author_email TEXT;
  END IF;
END $$;
