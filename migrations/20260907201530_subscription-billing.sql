-- ============================================================
-- Subscription Billing Migration
-- Adds plan tracking to public.users and creates
-- subscription_history audit table + webhook fulfillment trigger
-- ============================================================

-- 1. Add subscription columns to public.users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'basic', 'pro')),
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS plan_credits_per_month INTEGER NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS subscription_razorpay_order_id TEXT DEFAULT NULL;

-- 2. Create subscription_history table (audit trail of every payment)
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan          TEXT NOT NULL,
  amount_paise  INTEGER NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at       TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.subscription_history TO authenticated;

-- Policies: users can only see their own history
CREATE POLICY "Users can read own subscription history"
  ON public.subscription_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscription history"
  ON public.subscription_history
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. RLS on payments.razorpay_orders for user-scoped access
ALTER TABLE payments.razorpay_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own razorpay orders"
  ON payments.razorpay_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (subject_type = 'user' AND subject_id = auth.uid()::text);

CREATE POLICY "Users can read own razorpay orders"
  ON payments.razorpay_orders
  FOR SELECT
  TO authenticated
  USING (subject_type = 'user' AND subject_id = auth.uid()::text);

-- 4. Webhook fulfillment trigger
-- When a Razorpay order.paid event is processed, upgrade the user's plan
CREATE OR REPLACE FUNCTION public.fulfill_subscription_from_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id     UUID;
  v_plan        TEXT;
  v_credits     INTEGER;
  v_order_id    TEXT;
BEGIN
  -- Only act on processed razorpay order.paid or payment.captured events
  IF NEW.provider <> 'razorpay'
     OR NEW.processing_status <> 'processed'
     OR NEW.event_type NOT IN ('order.paid', 'payment.captured', 'invoice.paid')
  THEN
    RETURN NEW;
  END IF;

  -- Extract user_id and plan from notes stamped at order creation
  v_user_id := (
    COALESCE(
      NEW.payload -> 'payload' -> 'payment' -> 'entity' -> 'notes' ->> 'user_id',
      NEW.payload -> 'payload' -> 'order'   -> 'entity' -> 'notes' ->> 'user_id',
      NEW.payload -> 'payload' -> 'invoice' -> 'entity' -> 'notes' ->> 'user_id'
    )
  )::UUID;

  v_plan := COALESCE(
    NEW.payload -> 'payload' -> 'payment' -> 'entity' -> 'notes' ->> 'plan',
    NEW.payload -> 'payload' -> 'order'   -> 'entity' -> 'notes' ->> 'plan',
    NEW.payload -> 'payload' -> 'invoice' -> 'entity' -> 'notes' ->> 'plan'
  );

  v_order_id := COALESCE(
    NEW.payload -> 'payload' -> 'payment' -> 'entity' -> 'notes' ->> 'razorpay_order_id',
    NEW.payload -> 'payload' -> 'order'   -> 'entity' ->> 'id'
  );

  IF v_user_id IS NULL OR v_plan IS NULL THEN
    RAISE WARNING 'fulfill_subscription_from_webhook: missing user_id or plan in event %', NEW.provider_event_id;
    RETURN NEW;
  END IF;

  -- Determine credits per plan
  v_credits := CASE v_plan
    WHEN 'basic' THEN 350
    WHEN 'pro'   THEN 1000
    ELSE 25
  END;

  -- Update user's plan atomically (idempotent via ON CONFLICT / WHERE guard)
  UPDATE public.users
  SET
    plan = v_plan,
    plan_expires_at = NOW() + INTERVAL '1 month',
    plan_credits_per_month = v_credits,
    credits = credits + v_credits,
    subscription_razorpay_order_id = v_order_id,
    updated_at = NOW()
  WHERE id = v_user_id
    AND (plan_expires_at IS NULL OR plan_expires_at < NOW() + INTERVAL '1 month' + INTERVAL '1 day');

  -- Mark payment as paid in our subscription_history
  UPDATE public.subscription_history
  SET status = 'paid', paid_at = NOW()
  WHERE razorpay_order_id = v_order_id
    AND status = 'pending';

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS fulfill_subscription_from_webhook_trigger ON payments.webhook_events;
CREATE TRIGGER fulfill_subscription_from_webhook_trigger
  AFTER INSERT OR UPDATE ON payments.webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION public.fulfill_subscription_from_webhook();

-- 5. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id
  ON public.subscription_history(user_id, created_at DESC);
