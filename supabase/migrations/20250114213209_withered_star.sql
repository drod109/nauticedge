-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own webhooks" ON webhooks;

-- Create separate policies for each operation
CREATE POLICY "Users can view their own webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks"
  ON webhooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks"
  ON webhooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks"
  ON webhooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add default value for secret
ALTER TABLE webhooks 
  ALTER COLUMN secret SET DEFAULT generate_webhook_secret();