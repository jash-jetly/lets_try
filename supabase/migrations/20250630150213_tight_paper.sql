/*
  # Fix vaults table foreign key relationship

  1. Changes
    - Update vaults table to reference auth.users(id) directly instead of profiles(id)
    - This simplifies the relationship and avoids potential circular dependencies
    - Update RLS policies to use auth.uid() consistently

  2. Security
    - Maintain existing RLS policies with corrected user reference
*/

-- Drop existing foreign key constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'vaults_user_id_fkey' 
    AND table_name = 'vaults'
  ) THEN
    ALTER TABLE vaults DROP CONSTRAINT vaults_user_id_fkey;
  END IF;
END $$;

-- Add new foreign key constraint to auth.users
ALTER TABLE vaults 
ADD CONSTRAINT vaults_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to ensure they use auth.uid() correctly
DROP POLICY IF EXISTS "Users can read own vaults" ON vaults;
DROP POLICY IF EXISTS "Users can insert own vaults" ON vaults;
DROP POLICY IF EXISTS "Users can update own vaults" ON vaults;
DROP POLICY IF EXISTS "Users can delete own vaults" ON vaults;

CREATE POLICY "Users can read own vaults"
  ON vaults
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own vaults"
  ON vaults
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vaults"
  ON vaults
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own vaults"
  ON vaults
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());