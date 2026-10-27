-- Who has signed in, and the logins they currently hold.
-- Who is *allowed* to sign in lives in src/config.ts, not here.

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  picture_url TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  last_login_at INTEGER
);

-- The id is the SHA-256 of the cookie's token, so a leaked copy of this table
-- can't be replayed as a login.
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX sessions_user_id ON sessions (user_id);
