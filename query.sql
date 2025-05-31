CREATE TABLE songs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  artist VARCHAR(100) NOT NULL,
  category VARCHAR(10) CHECK (category IN ('song', 'album')) NOT NULL,
  release_date DATE,
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  cover_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);