/*
  # Create Webhooks and API Usage Tables

  1. New Tables
    - `webhooks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `url` (text)
      - `description` (text)
      - `events` (text[])
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `last_triggered_at` (timestamptz)
      
    - `webhook_deliveries`
      - `id` (uuid, primary key)
      - `webhook_id` (uuid, references webhooks)
      - `event` (text)
      - `payload` (jsonb)
      - `response_status` (integer)
      - `response_body` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  description text,
  events text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_triggered_at timestamptz,
  secret text -- For webhook signature verification
);

-- Create webhook_deliveries table
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES webhooks(id) ON DELETE CASCADE NOT NULL,
  event text NOT NULL,
  payload jsonb NOT NULL,
  response_status integer,
  response_body text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at ON webhook_deliveries(created_at DESC);

-- Enable RLS
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for webhooks
CREATE POLICY "Users can view own webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create webhooks"
  ON webhooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own webhooks"
  ON webhooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own webhooks"
  ON webhooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for webhook_deliveries
CREATE POLICY "Users can view own webhook deliveries"
  ON webhook_deliveries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM webhooks w
      WHERE w.id = webhook_id
      AND w.user_id = auth.uid()
    )
  );

-- Function to trigger webhook
CREATE OR REPLACE FUNCTION trigger_webhook(
  p_webhook_id uuid,
  p_event text,
  p_payload jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_delivery_id uuid;
BEGIN
  -- Create delivery record
  INSERT INTO webhook_deliveries (
    webhook_id,
    event,
    payload
  )
  VALUES (
    p_webhook_id,
    p_event,
    p_payload
  )
  RETURNING id INTO v_delivery_id;

  -- Update last triggered timestamp
  UPDATE webhooks
  SET last_triggered_at = now()
  WHERE id = p_webhook_id;

  RETURN v_delivery_id;
END;
$$;