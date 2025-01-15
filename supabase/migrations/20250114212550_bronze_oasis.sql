-- Create webhooks table
CREATE TABLE webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  url text NOT NULL,
  description text,
  events text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  secret text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_triggered_at timestamptz,
  CONSTRAINT valid_url CHECK (url ~ '^https?://'),
  CONSTRAINT valid_events CHECK (array_length(events, 1) > 0)
);

-- Create webhook_deliveries table for logging
CREATE TABLE webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid REFERENCES webhooks NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  response_status integer,
  response_body text,
  error text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies for webhooks
CREATE POLICY "Users can manage their own webhooks"
  ON webhooks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for webhook_deliveries
CREATE POLICY "Users can view their own webhook deliveries"
  ON webhook_deliveries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM webhooks
      WHERE webhooks.id = webhook_id
      AND webhooks.user_id = auth.uid()
    )
  );

-- Create function to generate webhook secret
CREATE OR REPLACE FUNCTION generate_webhook_secret()
RETURNS text AS $$
DECLARE
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F}';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set webhook secret
CREATE OR REPLACE FUNCTION set_webhook_secret()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.secret IS NULL THEN
    NEW.secret := generate_webhook_secret();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER webhook_secret_trigger
  BEFORE INSERT ON webhooks
  FOR EACH ROW
  EXECUTE FUNCTION set_webhook_secret();

-- Create indexes
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_created_at ON webhook_deliveries(created_at);