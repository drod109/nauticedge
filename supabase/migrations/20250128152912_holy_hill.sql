/*
  # Add unique constraint to subscriptions table
  
  1. Changes
    - Add unique constraint on user_id column to ensure one subscription per user
    - Add insert policy for subscriptions table
  
  2. Security
    - Add missing RLS policy for insert operations
*/

-- Add unique constraint to user_id
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- Add missing insert policy
CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure any existing duplicate records are handled
DO $$
DECLARE
  r RECORD;
BEGIN
  -- For each user_id with multiple subscriptions, keep only the most recent one
  FOR r IN (
    SELECT DISTINCT user_id
    FROM subscriptions s1
    WHERE EXISTS (
      SELECT 1 
      FROM subscriptions s2 
      WHERE s2.user_id = s1.user_id 
      AND s2.id != s1.id
    )
  ) LOOP
    -- Delete all but the most recent subscription
    DELETE FROM subscriptions
    WHERE user_id = r.user_id
    AND id NOT IN (
      SELECT id
      FROM subscriptions
      WHERE user_id = r.user_id
      ORDER BY updated_at DESC
      LIMIT 1
    );
  END LOOP;
END $$;