CREATE TABLE `discussion_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`threadId` int NOT NULL,
	`replyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discussion_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `discussion_replies` ADD `parentReplyId` int;