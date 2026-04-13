ALTER TABLE anfragen ADD COLUMN hidden boolean NOT NULL DEFAULT false;
ALTER TABLE anfragen ADD COLUMN strasse text;
ALTER TABLE anfragen ADD COLUMN plz text;
ALTER TABLE anfragen ADD COLUMN stadt text;