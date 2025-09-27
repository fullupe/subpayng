/*
  # ShopMe Subscription Management Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `name` (text, user's display name)
      - `role` (text, either 'user' or 'admin')
      - `created_at` (timestamp)
    
    - `decoders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `name` (text, custom decoder name)
      - `number` (text, decoder number)
      - `type` (text, either 'DSTV' or 'GoTv')
      - `created_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `decoder_id` (uuid, references decoders.id)
      - `name` (text, client name)
      - `card_number` (text, decoder card number)
      - `subscription_type` (text, DSTV or GoTv)
      - `package` (text, selected package name)
      - `duration` (text, subscription duration)
      - `amount_paid` (numeric, amount in cedis)
      - `momo_ref` (text, mobile money reference)
      - `status` (text, 'pending' or 'paid')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
    - Add policies for admins to view all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Create decoders table
CREATE TABLE IF NOT EXISTS decoders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  number text NOT NULL,
  type text NOT NULL CHECK (type IN ('DSTV', 'GoTv')),
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  decoder_id uuid REFERENCES decoders(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  card_number text NOT NULL,
  subscription_type text NOT NULL CHECK (subscription_type IN ('DSTV', 'GoTv')),
  package text NOT NULL,
  duration text NOT NULL,
  amount_paid numeric NOT NULL,
  momo_ref text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Decoders policies
CREATE POLICY "Users can manage own decoders"
  ON decoders
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all decoders"
  ON decoders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can manage own subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );