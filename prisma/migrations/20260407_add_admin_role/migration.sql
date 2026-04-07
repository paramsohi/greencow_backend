-- Add ADMIN role to UserRole enum
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'OWNER', 'STAFF') NOT NULL DEFAULT 'OWNER';
