-- Add credits column to public.users if not exists
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 50;

-- Update handle_new_user trigger to include default credits
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
