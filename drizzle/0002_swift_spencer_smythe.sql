CREATE TABLE `portal_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`subject` text NOT NULL,
	`details` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sales_imports` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`metadata` text NOT NULL,
	`row_count` integer NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_invites` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`purpose` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sales_records` (
	`id` text PRIMARY KEY NOT NULL,
	`import_id` text NOT NULL,
	`position` integer NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reward_inputs` (
	`key` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_users` (
	`email` text PRIMARY KEY NOT NULL,
	`full_name` text,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`rca` text,
	`seller_key` text,
	`updated_at` integer NOT NULL
);
