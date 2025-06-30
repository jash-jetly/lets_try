/*
  # Add database indexes for better performance

  1. Indexes
    - Add index on profiles.email for faster lookups
    - Add index on vaults.user_id for faster user vault queries
    - Add index on vaults.created_at for chronological sorting
    - Add composite index on vaults (user_id, created_at) for dashboard queries

  2. Performance
    - Improve query performance for common operations
    - Optimize dashboard loading and vault management
*/

-- Index on profiles email (if not already exists from UNIQUE constraint)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Index on vaults user_id for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_vaults_user_id ON vaults(user_id);

-- Index on vaults created_at for chronological sorting
CREATE INDEX IF NOT EXISTS idx_vaults_created_at ON vaults(created_at DESC);

-- Composite index for user vaults ordered by creation date
CREATE INDEX IF NOT EXISTS idx_vaults_user_created ON vaults(user_id, created_at DESC);

-- Index on vaults auto_debit for filtering auto-debit vaults
CREATE INDEX IF NOT EXISTS idx_vaults_auto_debit ON vaults(auto_debit) WHERE auto_debit = true;