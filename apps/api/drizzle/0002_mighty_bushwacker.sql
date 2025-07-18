ALTER TABLE "devices" ALTER COLUMN "id" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "user_id" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;