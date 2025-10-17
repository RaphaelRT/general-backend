CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fake_answers (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE INDEX IF NOT EXISTS idx_questions_title ON questions (title);
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions (category_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories (name);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers (question_id);
CREATE INDEX IF NOT EXISTS idx_answers_content ON answers (content);

CREATE INDEX IF NOT EXISTS idx_fake_answers_question_id ON fake_answers (question_id);
CREATE INDEX IF NOT EXISTS idx_fake_answers_content ON fake_answers (content);


