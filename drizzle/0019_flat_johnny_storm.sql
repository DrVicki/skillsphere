CREATE TABLE `python_notebook_download_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`activityId` varchar(64),
	`downloadType` enum('single','bundle') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `python_notebook_download_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `python_notebook_download_user_course_idx` ON `python_notebook_download_events` (`userId`,`courseId`);--> statement-breakpoint
CREATE INDEX `python_notebook_download_course_created_idx` ON `python_notebook_download_events` (`courseId`,`createdAt`);