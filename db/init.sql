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

-- Create sample service2app table
CREATE TABLE IF NOT EXISTS service2app
(
    id SERIAL PRIMARY KEY,
    jsondata jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data into service2app table
INSERT INTO service2app VALUES (1, '{"Email": "ims-msg-impl@collins.com", "AppName": "AIRINCCOLLINS", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["AMX1QM1.SP.XMITQ"], "RecordType": "Consumer", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "N/A"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (2, '{"Email": "DL_TechOps_IT_SCEPTRE_Incident_OnCall", "AppName": "SCEPTRE", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["AMX1QM1.SP.XMITQ"], "RecordType": "Publisher", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "SCEPTRE"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (3, '{"Email": "dl_cargo_it_cms_product@aa.com", "AppName": "Inotoc", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["CARGOIBS.DANGERGDS.NTC.01"], "RecordType": "Consumer", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "DANGERGDS"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (4, '{"Email": "N/A", "AppName": "CARGOIBS", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["CARGOIBS.DANGERGDS.NTC.01"], "RecordType": "Publisher", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "CARGOIBS"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (5, '{"Email": "dl_techops_champions@aa.com", "AppName": "JMOCA", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["SCEPTRE.JMOCA.CHECKS.01", "SCEPTRE.JMOCA.MELS.01", "SCEPTRE.JMOCA.MACH.01", "SCEPTRE.JMOCA.MISC.01"], "RecordType": "Consumer", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "JMOCA"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (6, '{"Email": "N/A", "AppName": "SCEPTER", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["SCEPTRE.JMOCA.CHECKS.01", "SCEPTRE.JMOCA.MELS.01", "SCEPTRE.JMOCA.MACH.01", "SCEPTRE.JMOCA.MISC.01"], "RecordType": "Publisher", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "SCEPTER"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (7, '{"Email": "dl_cargo_data_team@aa.com", "AppName": "CRO", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["CARGOIBS.CARGOREVOP.BKG.01"], "RecordType": "Consumer", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "CARGOREVOP"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (8, '{"Email": "N/A", "AppName": "CARGOIBS", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["CARGOIBS.CARGOREVOP.BKG.01"], "RecordType": "Publisher", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "CARGOIBS"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (9, '{"Email": "dl_cargo_data_team@aa.com", "AppName": "CGOREALDTA", "XMatters": "Cargo_DT_DataHub", "DataCenter": "CDC", "QueueNames": ["CARGOIBS.CGOREALDTA.BKG.01"], "RecordType": "Consumer", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "CGOREALDTA"}', '2025-06-13 09:53:57.80939');
INSERT INTO service2app VALUES (10, '{"Email": "N/A", "AppName": "IBS", "XMatters": "N/A", "DataCenter": "CDC", "QueueNames": ["CARGOIBS.CGOREALDTA.BKG.01"], "RecordType": "Publisher", "Environment": "emq-stage", "QueueManager": "EMQSCXG1", "ArcherShortName": "CARGOIBS"}', '2025-06-13 09:53:57.80939');