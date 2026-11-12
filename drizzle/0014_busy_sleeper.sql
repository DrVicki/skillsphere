CREATE TABLE `game_design_knowledge_check_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int NOT NULL,
	`answers` json NOT NULL,
	`score` int NOT NULL,
	`total` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_design_knowledge_check_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `game_design_checks_user_course_idx` ON `game_design_knowledge_check_results` (`userId`,`courseId`);--> statement-breakpoint
CREATE INDEX `game_design_checks_course_module_idx` ON `game_design_knowledge_check_results` (`courseId`,`moduleId`);