CREATE TABLE `frequency_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`month` text NOT NULL,
	`dates` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `frequency_owner_month` ON `frequency_reports` (`owner`,`month`);