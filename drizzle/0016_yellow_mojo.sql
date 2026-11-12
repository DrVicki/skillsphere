CREATE TABLE `caio_evidence_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`evidenceId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`reviewStatus` enum('approved','needs_revision') NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `caio_evidence_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `caio_evidence_notifications_user_course_idx` ON `caio_evidence_notifications` (`userId`,`courseId`,`createdAt`);