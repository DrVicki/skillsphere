CREATE TABLE `caio_assessment_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`courseId` int NOT NULL,
	`answers` json NOT NULL,
	`anchorScore` int NOT NULL,
	`freedomScore` int NOT NULL,
	`industryDepth` int NOT NULL,
	`vetoFreedomScore` int NOT NULL,
	`householdVeto` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `caio_assessment_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `caio_assessment_user_course_idx` ON `caio_assessment_results` (`userId`,`courseId`);--> statement-breakpoint
CREATE INDEX `caio_assessment_course_created_idx` ON `caio_assessment_results` (`courseId`,`createdAt`);