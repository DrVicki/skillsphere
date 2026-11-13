CREATE TABLE `ai_data_analytics_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int NOT NULL,
	`evidenceType` enum('practice_code','knowledge_check','capstone','reflection') NOT NULL,
	`content` text NOT NULL,
	`score` int,
	`total` int,
	`passed` boolean,
	`executed` boolean NOT NULL DEFAULT false,
	`reviewStatus` enum('draft','submitted','needs_revision','approved') NOT NULL DEFAULT 'draft',
	`instructorFeedback` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_data_analytics_evidence_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_data_evidence_user_module_type_unique` UNIQUE(`userId`,`moduleId`,`evidenceType`)
);
--> statement-breakpoint
CREATE INDEX `ai_data_evidence_course_status_idx` ON `ai_data_analytics_evidence` (`courseId`,`reviewStatus`);