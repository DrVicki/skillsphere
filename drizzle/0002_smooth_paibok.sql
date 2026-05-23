ALTER TABLE `courses` MODIFY COLUMN `tags` json;--> statement-breakpoint
ALTER TABLE `courses` ADD `isFeatured` boolean DEFAULT false;