CREATE TABLE `classroom_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classroomId` int NOT NULL,
	`courseId` int NOT NULL,
	`assignedBy` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `classroom_courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `classroom_courses_classroom_course_unique` UNIQUE(`classroomId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `classroom_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classroomId` int NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`status` enum('pending','active','removed') NOT NULL DEFAULT 'pending',
	`invitedBy` int NOT NULL,
	`invitedAt` timestamp NOT NULL DEFAULT (now()),
	`joinedAt` timestamp,
	`removedAt` timestamp,
	CONSTRAINT `classroom_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `classroom_members_classroom_email_unique` UNIQUE(`classroomId`,`email`)
);
--> statement-breakpoint
CREATE TABLE `classrooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`ownerId` int NOT NULL,
	`status` enum('active','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classrooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `enrollments` ADD `source` enum('purchase','free','classroom') DEFAULT 'purchase' NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` ADD `classroomId` int;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_user_course_unique` UNIQUE(`userId`,`courseId`);--> statement-breakpoint
CREATE INDEX `classroom_courses_course_idx` ON `classroom_courses` (`courseId`);--> statement-breakpoint
CREATE INDEX `classroom_members_user_idx` ON `classroom_members` (`userId`);--> statement-breakpoint
CREATE INDEX `classroom_members_classroom_status_idx` ON `classroom_members` (`classroomId`,`status`);--> statement-breakpoint
CREATE INDEX `classrooms_owner_idx` ON `classrooms` (`ownerId`);--> statement-breakpoint
CREATE INDEX `classrooms_status_idx` ON `classrooms` (`status`);--> statement-breakpoint
CREATE INDEX `enrollments_classroom_idx` ON `enrollments` (`classroomId`);