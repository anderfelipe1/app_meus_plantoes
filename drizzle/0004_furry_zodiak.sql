ALTER TABLE `shifts` ADD `service` text DEFAULT 'Plantão 12h' NOT NULL;--> statement-breakpoint
ALTER TABLE `shifts` ADD `overtime_hours` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `shifts` ADD `private_count` integer DEFAULT 0 NOT NULL;