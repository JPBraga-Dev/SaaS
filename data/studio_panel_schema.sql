-- Studio Panel database schema
-- Target: PostgreSQL 14+
--
-- This schema covers:
-- - users and roles
-- - authentication credentials
-- - persistent sessions
-- - user preferences
-- - system-wide settings
-- - activity and authentication logs
--
-- Seeded admin user:
--   username: jp
--   password: 1234
--
-- Important:
-- - Change the seeded admin password immediately in production.
-- - The password hash is generated in-database using pgcrypto.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_provider') THEN
    CREATE TYPE auth_provider AS ENUM ('local', 'google', 'github', 'sso');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
    CREATE TYPE session_status AS ENUM ('active', 'revoked', 'expired');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_event_type') THEN
    CREATE TYPE auth_event_type AS ENUM (
      'login_success',
      'login_failed',
      'logout',
      'password_changed',
      'session_revoked',
      'token_refresh'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username CITEXT NOT NULL UNIQUE,
  email CITEXT NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_url TEXT,
  timezone VARCHAR(64) NOT NULL DEFAULT 'America/Fortaleza',
  locale VARCHAR(16) NOT NULL DEFAULT 'pt-BR',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_username_length CHECK (char_length(username) >= 2),
  CONSTRAINT users_email_length CHECK (char_length(email) >= 5)
);

CREATE TABLE IF NOT EXISTS user_credentials (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  provider auth_provider NOT NULL DEFAULT 'local',
  password_hash TEXT NOT NULL,
  password_algo VARCHAR(32) NOT NULL DEFAULT 'bcrypt',
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_credentials_failed_attempts_nonnegative CHECK (failed_login_attempts >= 0)
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(16) NOT NULL DEFAULT 'dark',
  sidebar_collapsed BOOLEAN NOT NULL DEFAULT FALSE,
  language VARCHAR(16) NOT NULL DEFAULT 'pt-BR',
  date_format VARCHAR(32) NOT NULL DEFAULT 'DD/MM/YYYY',
  number_format VARCHAR(32) NOT NULL DEFAULT '1.000,00',
  timezone VARCHAR(64) NOT NULL DEFAULT 'America/Fortaleza',
  dashboard_layout JSONB NOT NULL DEFAULT '{}'::jsonb,
  ui_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  notification_preferences JSONB NOT NULL DEFAULT
    '{"system": true, "projects": true, "security": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_preferences_theme_check CHECK (theme IN ('light', 'dark'))
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL UNIQUE,
  refresh_token_hash TEXT UNIQUE,
  status session_status NOT NULL DEFAULT 'active',
  ip_address INET,
  user_agent TEXT,
  device_name VARCHAR(120),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoke_reason VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_sessions_expiry_check CHECK (expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS auth_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  username_attempted CITEXT,
  event_type auth_event_type NOT NULL,
  provider auth_provider NOT NULL DEFAULT 'local',
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id UUID,
  action VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_policies (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role_active
  ON users (role, is_active);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_status
  ON user_sessions (user_id, status, expires_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_active_only
  ON user_sessions (user_id, last_activity_at DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_auth_events_user_time
  ON auth_events (user_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_auth_events_type_time
  ON auth_events (event_type, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_time
  ON activity_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_entity
  ON activity_logs (entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_system_settings_public
  ON system_settings (is_public);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_credentials_updated_at
BEFORE UPDATE ON user_credentials
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_sessions_updated_at
BEFORE UPDATE ON user_sessions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_security_policies_updated_at
BEFORE UPDATE ON security_policies
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

WITH admin_user AS (
  INSERT INTO users (
    username,
    email,
    display_name,
    role,
    is_active,
    timezone,
    locale
  )
  VALUES (
    'jp',
    'jp@studio-panel.local',
    'JP Admin',
    'admin',
    TRUE,
    'America/Fortaleza',
    'pt-BR'
  )
  ON CONFLICT (username) DO UPDATE
    SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      role = EXCLUDED.role,
      is_active = EXCLUDED.is_active,
      timezone = EXCLUDED.timezone,
      locale = EXCLUDED.locale
  RETURNING id
)
INSERT INTO user_credentials (
  user_id,
  provider,
  password_hash,
  password_algo,
  must_change_password
)
SELECT
  id,
  'local',
  crypt('1234', gen_salt('bf', 12)),
  'bcrypt',
  TRUE
FROM admin_user
ON CONFLICT (user_id) DO UPDATE
  SET
    provider = EXCLUDED.provider,
    password_hash = EXCLUDED.password_hash,
    password_algo = EXCLUDED.password_algo,
    must_change_password = EXCLUDED.must_change_password,
    password_changed_at = NOW();

INSERT INTO user_preferences (
  user_id,
  theme,
  sidebar_collapsed,
  language,
  date_format,
  number_format,
  timezone,
  dashboard_layout,
  ui_state,
  notification_preferences
)
SELECT
  id,
  'dark',
  FALSE,
  'pt-BR',
  'DD/MM/YYYY',
  '1.000,00',
  'America/Fortaleza',
  '{"layout": "default"}'::jsonb,
  '{"focusMode": false}'::jsonb,
  '{"system": true, "projects": true, "security": true}'::jsonb
FROM users
WHERE username = 'jp'
ON CONFLICT (user_id) DO UPDATE
  SET
    theme = EXCLUDED.theme,
    sidebar_collapsed = EXCLUDED.sidebar_collapsed,
    language = EXCLUDED.language,
    date_format = EXCLUDED.date_format,
    number_format = EXCLUDED.number_format,
    timezone = EXCLUDED.timezone,
    dashboard_layout = EXCLUDED.dashboard_layout,
    ui_state = EXCLUDED.ui_state,
    notification_preferences = EXCLUDED.notification_preferences;

INSERT INTO system_settings (key, value, description, is_public)
VALUES
  (
    'app.identity',
    '{"name": "Studio Panel", "tagline": "Workspace minimalista para operações"}'::jsonb,
    'Identity and branding metadata used by the dashboard.',
    TRUE
  ),
  (
    'app.defaults',
    '{"theme": "dark", "language": "pt-BR", "timezone": "America/Fortaleza", "dateFormat": "DD/MM/YYYY", "numberFormat": "1.000,00"}'::jsonb,
    'Default interface settings for new users.',
    TRUE
  ),
  (
    'auth.session',
    '{"sessionTtlHours": 24, "refreshTtlDays": 30, "maxConcurrentSessions": 10}'::jsonb,
    'Authentication session defaults.',
    FALSE
  ),
  (
    'dashboard.features',
    '{"darkMode": true, "notifications": true, "focusMode": true, "auditLogs": true}'::jsonb,
    'Feature flags for the initial Studio Panel experience.',
    TRUE
  )
ON CONFLICT (key) DO UPDATE
  SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public;

INSERT INTO security_policies (key, value, description)
VALUES
  (
    'password.policy',
    '{"minLength": 8, "requireUpper": false, "requireNumber": true, "requireSymbol": false, "maxAgeDays": 90}'::jsonb,
    'Password policy configuration.'
  ),
  (
    'auth.lockout',
    '{"maxFailedAttempts": 5, "lockoutMinutes": 15}'::jsonb,
    'Account lockout thresholds after consecutive failed logins.'
  ),
  (
    'audit.retention',
    '{"authEventsDays": 180, "activityLogsDays": 365}'::jsonb,
    'Data retention periods for security and activity records.'
  )
ON CONFLICT (key) DO UPDATE
  SET
    value = EXCLUDED.value,
    description = EXCLUDED.description;

INSERT INTO auth_events (
  user_id,
  username_attempted,
  event_type,
  provider,
  success,
  detail
)
SELECT
  id,
  'jp',
  'login_success',
  'local',
  TRUE,
  '{"seeded": true, "note": "Initial admin account provisioned"}'::jsonb
FROM users
WHERE username = 'jp';

INSERT INTO activity_logs (
  user_id,
  entity_type,
  entity_id,
  action,
  message,
  metadata
)
SELECT
  id,
  'system',
  NULL,
  'bootstrap',
  'Initial Studio Panel admin account and defaults created.',
  '{"seeded": true}'::jsonb
FROM users
WHERE username = 'jp';

COMMIT;
