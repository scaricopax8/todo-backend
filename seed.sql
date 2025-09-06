-- seed.sql
DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

INSERT INTO todos (task, completed) VALUES
  ('Learn Express', false),
  ('Build a To-Do API', false),
  ('Test endpoints', true),
  ('Connect to PostgreSQL', true),
  ('Deploy the app', false);
