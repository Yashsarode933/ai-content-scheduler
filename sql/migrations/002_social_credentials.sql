-- Social Media Credentials Table
CREATE TABLE IF NOT EXISTS social_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Twitter/X Credentials
  twitter_config JSONB,
  
  -- LinkedIn Credentials
  linkedin_config JSONB,
  
  -- Instagram Credentials
  instagram_config JSONB,
  
  -- Discord Credentials
  discord_config JSONB,
  
  -- TikTok Credentials (for future)
  tiktok_config JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_social_credentials_user_id ON social_credentials(user_id);

-- Enable Row Level Security
ALTER TABLE social_credentials ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own credentials"
  ON social_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credentials"
  ON social_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials"
  ON social_credentials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials"
  ON social_credentials FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_social_credentials_updated_at 
  BEFORE UPDATE ON social_credentials
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Update posts table to track published platforms
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS published_platforms TEXT[],
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

