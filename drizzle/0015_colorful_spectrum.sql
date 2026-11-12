CREATE TABLE `caio_evidence_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int NOT NULL,
	`submissionType` enum('action','reflection') NOT NULL,
	`content` text NOT NULL,
	`reviewStatus` enum('draft','submitted','needs_revision','approved') NOT NULL DEFAULT 'draft',
	`instructorFeedback` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `caio_evidence_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `caio_evidence_user_module_type_unique` UNIQUE(`userId`,`moduleId`,`submissionType`)
);
--> statement-breakpoint
CREATE INDEX `caio_evidence_course_status_idx` ON `caio_evidence_submissions` (`courseId`,`reviewStatus`);