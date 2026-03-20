-- Create tables for Finance News Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- News articles
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  url TEXT,
  tags TEXT[],
  sentiment REAL,
  importance REAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories/tags
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Knowledge base for RAG
CREATE TABLE IF NOT EXISTS knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(384),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RAG query logs
CREATE TABLE IF NOT EXISTS rag_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  results JSONB,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert example data
INSERT INTO categories (name) VALUES 
  ('Ações'), ('Criptomoedas'), ('Criptomoedas'),
  ('Fundos Imobiliários'), ('Renda Fixa'), ('Dígitais');
