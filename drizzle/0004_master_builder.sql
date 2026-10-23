CREATE TABLE IF NOT EXISTS builder_versions (id text PRIMARY KEY NOT NULL, payload text NOT NULL, actor text NOT NULL, created_at integer NOT NULL, label text NOT NULL);
CREATE TABLE IF NOT EXISTS builder_datasets (id text PRIMARY KEY NOT NULL, source_id text NOT NULL, columns_json text NOT NULL, row_count integer NOT NULL, filename text, created_at integer NOT NULL, actor text NOT NULL, status text NOT NULL);
CREATE TABLE IF NOT EXISTS builder_records (id text PRIMARY KEY NOT NULL, dataset_id text NOT NULL, position integer NOT NULL, payload text NOT NULL);
CREATE INDEX IF NOT EXISTS builder_records_dataset ON builder_records(dataset_id, position);
