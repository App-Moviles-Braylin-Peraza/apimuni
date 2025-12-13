CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(200) NOT NULL,
full_name VARCHAR(200),
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE TABLE IF NOT EXISTS tramites (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
direccion TEXT,
status VARCHAR(50) NOT NULL DEFAULT 'INICIADO',
creation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
last_update_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
is_deleted BOOLEAN DEFAULT FALSE
);


CREATE INDEX IF NOT EXISTS idx_tramites_user_id ON tramites(user_id);
CREATE INDEX IF NOT EXISTS idx_tramites_status ON tramites(status);
CREATE INDEX IF NOT EXISTS idx_tramites_last_update ON tramites(last_update_date DESC);