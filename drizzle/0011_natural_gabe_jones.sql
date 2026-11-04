CREATE TABLE `python_forge_lab_code` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int NOT NULL,
	`activityId` varchar(64) NOT NULL,
	`code` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `python_forge_lab_code_id` PRIMARY KEY(`id`),
	CONSTRAINT `python_forge_lab_code_user_module_unique` UNIQUE(`userId`,`moduleId`)
);
--> statement-breakpoint
CREATE INDEX `python_forge_lab_code_course_idx` ON `python_forge_lab_code` (`courseId`);