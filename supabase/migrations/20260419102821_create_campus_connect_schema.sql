
/*
  # CampusConnect Events - Full Schema Setup

  ## Overview
  Creates the complete schema for the CampusConnect Events college event management system.

  ## New Tables
  1. `profiles` - Extends auth.users with role information
     - `id` (uuid, PK, references auth.users)
     - `email` (text)
     - `role` (text: 'student' | 'admin')
     - `full_name` (text, optional)
     - `created_at` (timestamptz)

  2. `events` - Core event records
     - `id` (uuid, PK)
     - `title` (text)
     - `date` (date)
     - `time` (text)
     - `venue` (text)
     - `category` (text: Technical | Cultural | Robotics | Workshop | Seminar | Other)
     - `description` (text)
     - `poster_url` (text)
     - `status` (text: Upcoming | Completed)
     - `created_at` (timestamptz)

  3. `registrations` - Student event registrations
     - `id` (uuid, PK)
     - `event_id` (uuid, FK → events)
     - `user_id` (uuid, FK → auth.users)
     - `registered_at` (timestamptz)
     - Unique constraint on (event_id, user_id)

  ## Security
  - RLS enabled on all tables
  - Admins have full CRUD on events
  - Students can register/unregister for events
  - Auto-profile creation on user signup via trigger

  ## Seed Data
  - 8 sample events including 3 Robotics/IoT events
*/

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  time text NOT NULL DEFAULT '09:00 AM',
  venue text NOT NULL,
  category text NOT NULL CHECK (category IN ('Technical', 'Cultural', 'Robotics', 'Workshop', 'Seminar', 'Other')),
  description text DEFAULT '',
  poster_url text DEFAULT '',
  status text DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- =============================================
-- REGISTRATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can register for events"
  ON registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from events"
  ON registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- AUTO-PROFILE CREATION TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'student')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- SEED DATA - 8 SAMPLE EVENTS
-- =============================================
INSERT INTO events (title, date, time, venue, category, description, poster_url, status) VALUES
(
  'IoT Innovation Hackathon 2025',
  '2025-06-15',
  '09:00 AM',
  'Tech Lab, Block A',
  'Robotics',
  'A 24-hour hackathon focusing on Internet of Things solutions. Build smart devices, automated systems, and connected applications that can transform daily campus life. Participate individually or in teams of up to 4. Prizes worth ₹50,000 for top 3 teams! Mentors from industry leaders will be present throughout the event.',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  'Upcoming'
),
(
  'RoboWars Championship 2025',
  '2025-06-22',
  '10:00 AM',
  'Main Ground & Sports Complex',
  'Robotics',
  'Annual robot combat championship where teams design, build, and battle custom robots. Three exciting categories: Autonomous Navigation, Remote-Controlled Combat, and Line-Following Speed Race. Registration is open to all engineering branches. Limited to 30 teams. Build your bot and prove your engineering skills!',
  'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
  'Upcoming'
),
(
  'Smart Campus IoT Expo',
  '2025-07-01',
  '11:00 AM',
  'Exhibition Hall, Central Block',
  'Robotics',
  'Showcase your robotics and IoT innovations to industry professionals and investors. Projects are evaluated by faculty from IITs and industry experts. Winners receive internship offers and cash prizes. Network with recruiters from top tech companies. A live demo zone with hands-on exhibits open to all students.',
  'https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg',
  'Upcoming'
),
(
  'TechFusion Annual Cultural Fest',
  '2025-06-28',
  '06:00 PM',
  'Open Air Theatre & Main Auditorium',
  'Cultural',
  'Three spectacular days of music, dance, drama, and visual arts. Featuring performances by nationally acclaimed artists, inter-college competitions with ₹1,00,000 prize pool, themed food stalls, and a celebrity night. Events include Battle of Bands, Classical Dance, Street Play, and Nukkad Natak. Don''t miss the grand finale night!',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
  'Upcoming'
),
(
  'Python for Data Science Workshop',
  '2025-05-30',
  '02:00 PM',
  'Seminar Hall 1, Academic Block',
  'Workshop',
  'Hands-on intensive workshop covering Python fundamentals, NumPy, Pandas, Matplotlib, and introduction to Scikit-learn for machine learning. Participants will work on a real dataset from start to finish. Bring your laptops with Anaconda installed. Certificate of completion provided. Limited to 50 participants — register early!',
  'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
  'Upcoming'
),
(
  'Startup Pitch & Funding Summit',
  '2025-06-10',
  '10:00 AM',
  'Main Auditorium',
  'Seminar',
  'Present your startup ideas to a distinguished panel of angel investors, VCs, and serial entrepreneurs. Top 3 pitches receive seed funding and 6-month mentorship from industry veterans. Pre-registration required with submission of a one-page executive summary. Workshop on pitch deck creation held the day before.',
  'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
  'Upcoming'
),
(
  'Full-Stack Web Dev Bootcamp',
  '2025-04-20',
  '09:00 AM',
  'Computer Lab 3, IT Block',
  'Technical',
  'Intensive two-day bootcamp on modern web development using React 18, Node.js, Express, and PostgreSQL. Build and deploy a complete full-stack project by the end. Industry mentors from top MNCs provide code reviews. Participants get access to cloud credits and premium learning resources worth ₹5,000.',
  'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg',
  'Completed'
),
(
  'Lens & Frame Photography Festival',
  '2025-05-05',
  '04:00 PM',
  'Media Center & Art Gallery',
  'Cultural',
  'Annual photography exhibition and short film showcase celebrating visual storytelling. Submit your best photographs and short films (under 5 minutes) for expert judging. Theme: "Urban Emotions." Workshops by award-winning photographers. Top 20 works featured in the annual college magazine and digital display gallery.',
  'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg',
  'Completed'
);
