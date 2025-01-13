/*
  # Fix user sessions policies and constraints

  1. Changes
    - Safely handle existing policies
    - Add default values and constraints
    - Create optimized indexes
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON user_sessions;

-- Add default values and NOT NULL constraints
ALTER TABLE user_sessions
  ALTER COLUMN device_info SET NOT NULL,
  ALTER COLUMN location SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT true,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN last_active_at SET DEFAULT now();

-- Create index for active sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_active_user ON user_sessions (user_id) WHERE is_active = true;