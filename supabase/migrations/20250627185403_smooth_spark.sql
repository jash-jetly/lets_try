/*
  # Create vaults table for investment tracking

  1. New Tables
    - `vaults`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references profiles.id)
      - `name` (text, not null)
      - `monthly_amount` (decimal, not null, check constraint for positive values)
      - `start_date` (date, not null)
      - `total_invested` (decimal, default 0)
      - `auto_debit` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `vaults` table
    - Add policies for users to manage their own vaults
*/

CREATE TABLE IF NOT EXISTS vaults (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  monthly_amount decimal(10,2) NOT NULL CHECK (monthly_amount > 0),
  start_date date NOT NULL,
  total_invested decimal(10,2) DEFAULT 0 CHECK (total_invested >= 0),
  auto_debit boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;

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