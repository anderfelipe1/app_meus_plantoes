ALTER TABLE `shifts` ADD `base_cents` integer;--> statement-breakpoint
ALTER TABLE `shifts` ADD `period` text;--> statement-breakpoint
ALTER TABLE `shifts` ADD `pediatric_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `shifts` ADD `pediatric_cents` integer DEFAULT 24000 NOT NULL;