CREATE TABLE `shifts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`date` text NOT NULL,
	`company` text NOT NULL,
	`cents` integer NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`note` text DEFAULT '' NOT NULL
);
