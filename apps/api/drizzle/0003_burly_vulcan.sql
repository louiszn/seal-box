CREATE TABLE "categories" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"user_id" varchar(25) NOT NULL,
	"name" varchar(50) NOT NULL,
	"type" integer NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;