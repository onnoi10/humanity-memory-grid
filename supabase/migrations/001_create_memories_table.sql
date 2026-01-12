-- Create the memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Knowledge', 'Experience', 'Lesson', 'Mistake')),
  content TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'public')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_email TEXT,
  timestamp BIGINT NOT NULL,
  date_added TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON public.memories(user_id);

-- Create an index on visibility for faster filtering
CREATE INDEX IF NOT EXISTS idx_memories_visibility ON public.memories(visibility);

-- Create an index on timestamp for sorting
CREATE INDEX IF NOT EXISTS idx_memories_timestamp ON public.memories(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can read public memories
CREATE POLICY "Anyone can read public memories"
  ON public.memories
  FOR SELECT
  TO public
  USING (visibility = 'public');

-- Policy 2: Users can read their own private memories
CREATE POLICY "Users can read their own private memories"
  ON public.memories
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'private' 
    AND user_id = auth.uid()
  );

-- Policy 3: Only authenticated users can insert memories
CREATE POLICY "Authenticated users can insert memories"
  ON public.memories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
  );

-- Policy 4: Only the owner can update their memories
CREATE POLICY "Users can update their own memories"
  ON public.memories
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy 5: Only the owner can delete their memories
CREATE POLICY "Users can delete their own memories"
  ON public.memories
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on row updates
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
