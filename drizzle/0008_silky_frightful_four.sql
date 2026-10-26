ALTER TABLE `game_design_diary_entries` ADD `reviewStatus` enum('draft','submitted','needs_revision','approved') DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE `game_design_diary_entries` ADD `instructorFeedback` text;--> statement-breakpoint
ALTER TABLE `game_design_diary_entries` ADD `reviewedBy` int;--> statement-breakpoint
ALTER TABLE `game_design_diary_entries` ADD `reviewedAt` timestamp;--> statement-breakpoint
ALTER TABLE `game_design_diary_entries` ADD `submittedAt` timestamp;