CREATE EXTENSION IF NOT EXISTS vector;

-- Create sample mcp_keys table
CREATE TABLE IF NOT EXISTS mcp_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service VARCHAR(50) NOT NULL,
    api_key TEXT NOT NULL,
    expiration_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_user_service UNIQUE (user_id, service)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mcp_keys_user_service ON mcp_keys (user_id, service);
CREATE INDEX IF NOT EXISTS idx_mcp_keys_expiration ON mcp_keys (expiration_date) WHERE expiration_date IS NOT NULL;

-- Insert sample data into mcp_keys table
INSERT INTO mcp_keys (user_id, service, api_key, expiration_date, updated_at, is_active) VALUES
(1, 'github', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R', '2025-12-31 23:59:59+00', '2025-01-15 10:30:00+00', true),
(1, 'slack', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R', '2025-09-15 12:00:00+00', '2025-02-20 14:45:30+00', true),
(2, 'github', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8RL4K3J2I', '2026-01-15 23:59:59+00', '2025-03-10 09:15:22+00', true),
(2, 'teams', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8RAiOjE2NzE1NDgwMDB9', '2025-11-30 18:30:00+00', '2025-04-05 16:20:10+00', true),
(3, 'slack', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R', NULL, '2025-05-12 11:05:45+00', true),
(3, 'github', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R', '2025-08-20 14:15:30+00', '2025-01-30 13:42:18+00', true),
(4, 'teams', 'Bearer_token_example_1234567890abcdefghijklmnopqrstuvwxyz', '2025-10-05 09:00:00+00', '2024-11-15 08:30:55+00', false),
(5, 'github', 'ghp_ExpiredTokenExample123456789012345678', '2024-12-01 00:00:00+00', '2024-10-20 17:25:33+00', false),
(1, 'jira', '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R', '2025-07-10 16:45:00+00', '2025-06-01 12:18:07+00', true),
(2, 'confluence', 'confluence_api_key_example_abcd1234efgh5678ijkl', NULL, '2025-05-28 15:33:41+00', true);