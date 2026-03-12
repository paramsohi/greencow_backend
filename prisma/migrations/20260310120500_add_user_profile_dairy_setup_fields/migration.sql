ALTER TABLE `user_profiles`
  ADD COLUMN `dairy_settings` JSON NULL,
  ADD COLUMN `has_completed_dairy_setup` BOOLEAN NOT NULL DEFAULT FALSE;
