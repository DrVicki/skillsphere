CREATE TABLE `python_forge_lab_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int NOT NULL,
	`labCodeId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `python_forge_lab_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `python_forge_lab_code` ADD `reviewStatus` enum('needs_review','reviewed','resubmit') DEFAULT 'needs_review' NOT NULL;--> statement-breakpoint
CREATE INDEX `python_forge_notifications_user_course_idx` ON `python_forge_lab_notifications` (`userId`,`courseId`,`isRead`);