CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` integer NOT NULL,
	`status` text DEFAULT 'upcoming',
	`projectId` text NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projectContent` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'README' NOT NULL,
	`title` text,
	`content` text DEFAULT '' NOT NULL,
	`path` text,
	`projectId` text NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reminder` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`dueDate` integer NOT NULL,
	`status` text DEFAULT 'active',
	`projectId` text NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`deadline` integer,
	`status` text DEFAULT 'pending',
	`assignedTo` text,
	`projectId` text NOT NULL,
	FOREIGN KEY (`assignedTo`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
