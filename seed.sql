-- seed.sql
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS todos;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  task TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  tags TEXT[] NOT NULL DEFAULT '{}',
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos (user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos (completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos (due_date);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos (priority);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos (created_at);

-- Seed data
INSERT INTO users (id, name, email) VALUES
  (1, 'Buzz Lightyear', 'buzz@starcommand.org'),
  (2, 'Woody Pride', 'woody@andysroom.com'),
  (3, 'Jessie', 'jessie@andysroom.com');

INSERT INTO todos (user_id, task, description, completed, completed_at, due_date, priority, tags, archived) VALUES
  (1, 'Learn Express', 'Basics of Express 5', false, NULL, NULL, 'medium', ARRAY['node','backend'], false),
  (2, 'Build a To-Do API', 'CRUD endpoints and validation', false, NULL, (CURRENT_DATE + INTERVAL '3 days')::date, 'high', ARRAY['api','todo'], false),
  (1, 'Test endpoints', 'Use Postman or supertest', true, NOW(), CURRENT_DATE, 'low', ARRAY['testing'], false),
  (3, 'Connect to PostgreSQL', 'Pool and env config', true, NOW(), NULL, 'medium', ARRAY['db','postgres'], false),
  (2, 'Deploy the app', 'Choose hosting and CI', false, NULL, NULL, 'medium', ARRAY['devops'], false);
