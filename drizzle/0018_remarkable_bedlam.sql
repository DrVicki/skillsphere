CREATE TABLE `antigravity_terminal_practice_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int NOT NULL,
	`operatingSystem` enum('macOS','Linux','Windows') NOT NULL,
	`stepIndex` int NOT NULL,
	`command` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `antigravity_terminal_practice_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `antigravity_practice_user_module_idx` ON `antigravity_terminal_practice_attempts` (`userId`,`moduleId`);--> statement-breakpoint
CREATE INDEX `antigravity_practice_course_idx` ON `antigravity_terminal_practice_attempts` (`courseId`);