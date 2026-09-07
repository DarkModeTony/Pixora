-- Add credits column to public.users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'credits'
  ) THEN
    ALTER TABLE public.users ADD COLUMN credits INTEGER NOT NULL DEFAULT 50;
  END IF;
END $$;

-- Ensure all existing users have 50 credits
UPDATE public.users SET credits = 50 WHERE credits IS NULL OR credits < 0;

-- Update public.handle_new_user() trigger function to include credits = 50
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.profile->>'name', split_part(NEW.email, '@', 1)),
    NEW.profile->>'avatar_url',
    50
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create public.generations table
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool TEXT NOT NULL,
  source_image_url TEXT NOT NULL,
  reference_image_url TEXT,
  result_image_url TEXT NOT NULL,
  storage_key TEXT,
  options JSONB DEFAULT '{}'::jsonb,
  credits_used INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on generations
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generations TO authenticated, anon;

-- Policies for public.generations
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
CREATE POLICY "Users can view own generations"
  ON public.generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own generations" ON public.generations;
CREATE POLICY "Users can insert own generations"
  ON public.generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
