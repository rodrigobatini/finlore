-- Finlore MVP schema
-- Focus: auth/onboarding, personalized feed, tutor history

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------
-- Core profile and onboarding
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  user_level TEXT NOT NULL DEFAULT 'intro' CHECK (user_level IN ('intro', 'intermediario', 'avancado')),
  tone_style TEXT NOT NULL DEFAULT 'acessivel',
  language TEXT NOT NULL DEFAULT 'pt-BR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goals TEXT[] NOT NULL DEFAULT '{}',
  self_assessment TEXT NOT NULL DEFAULT 'intro' CHECK (self_assessment IN ('intro', 'intermediario', 'avancado')),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

-- ------------------------------------------------------------------
-- Content sources and personalization
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('rss', 'api', 'institutional')),
  base_url TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'pt-BR',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_sources (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, source_id)
);

CREATE TABLE IF NOT EXISTS user_topics (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  weight SMALLINT NOT NULL DEFAULT 1 CHECK (weight BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, topic_id)
);

-- ------------------------------------------------------------------
-- News and concept graph
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  external_id TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  url TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'pt-BR',
  published_at TIMESTAMPTZ NOT NULL,
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (url),
  UNIQUE (source_id, external_id)
);

CREATE TABLE IF NOT EXISTS concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS news_concepts (
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0.500 CHECK (confidence BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (news_id, concept_id)
);

-- ------------------------------------------------------------------
-- Tutor sessions and messages
-- ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Sessao de aprendizado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES tutor_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  citations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------
-- Useful indexes
-- ------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_source_id ON news (source_id);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_session ON tutor_messages (session_id, created_at);

-- ------------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_messages ENABLE ROW LEVEL SECURITY;

-- public content tables may be read by authenticated users
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_concepts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "onboarding_select_own" ON onboarding_answers;
CREATE POLICY "onboarding_select_own" ON onboarding_answers FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "onboarding_upsert_own" ON onboarding_answers;
CREATE POLICY "onboarding_upsert_own" ON onboarding_answers FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_sources_own" ON user_sources;
CREATE POLICY "user_sources_own" ON user_sources FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_topics_own" ON user_topics;
CREATE POLICY "user_topics_own" ON user_topics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tutor_sessions_own" ON tutor_sessions;
CREATE POLICY "tutor_sessions_own" ON tutor_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tutor_messages_own" ON tutor_messages;
CREATE POLICY "tutor_messages_own" ON tutor_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "sources_read_auth" ON sources;
CREATE POLICY "sources_read_auth" ON sources FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "topics_read_auth" ON topics;
CREATE POLICY "topics_read_auth" ON topics FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "news_read_auth" ON news;
CREATE POLICY "news_read_auth" ON news FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "concepts_read_auth" ON concepts;
CREATE POLICY "concepts_read_auth" ON concepts FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "news_concepts_read_auth" ON news_concepts;
CREATE POLICY "news_concepts_read_auth" ON news_concepts FOR SELECT TO authenticated USING (TRUE);

-- ------------------------------------------------------------------
-- Seed core taxonomy
-- ------------------------------------------------------------------
INSERT INTO topics (slug, label)
VALUES
  ('juros', 'Juros'),
  ('inflacao', 'Inflacao'),
  ('acoes', 'Acoes'),
  ('dolar', 'Dolar'),
  ('macro-global', 'Macro Global')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sources (slug, name, source_type, base_url, language)
VALUES
  ('google-news-br', 'Google News Brasil', 'rss', 'https://news.google.com/rss', 'pt-BR'),
  ('bcb', 'Banco Central do Brasil', 'institutional', 'https://www.bcb.gov.br', 'pt-BR'),
  ('ibge', 'IBGE', 'institutional', 'https://www.ibge.gov.br', 'pt-BR'),
  ('alpha-vantage', 'Alpha Vantage', 'api', 'https://www.alphavantage.co', 'pt-BR')
ON CONFLICT (slug) DO NOTHING;
