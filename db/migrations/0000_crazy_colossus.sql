CREATE TYPE "public"."bingo_tile_status" AS ENUM('unverified', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "bingo_items" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"setTileId" text NOT NULL,
	"status" "bingo_tile_status" DEFAULT 'unverified' NOT NULL,
	"rejectionReason" text,
	CONSTRAINT "unique_user_set_tile" UNIQUE("userId","setTileId")
);
--> statement-breakpoint
CREATE TABLE "bingo_set_tiles" (
	"id" text PRIMARY KEY NOT NULL,
	"set" integer NOT NULL,
	"index" integer NOT NULL,
	"title" text NOT NULL,
	CONSTRAINT "unique_set_index" UNIQUE("set","index"),
	CONSTRAINT "index_range_check" CHECK ("bingo_set_tiles"."index" >= 0 AND "bingo_set_tiles"."index" <= 15)
);
--> statement-breakpoint
CREATE TABLE "bingo_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"bingoItemId" text NOT NULL,
	"image" text NOT NULL,
	"message" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bingo_items" ADD CONSTRAINT "bingo_items_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bingo_items" ADD CONSTRAINT "bingo_items_setTileId_bingo_set_tiles_id_fk" FOREIGN KEY ("setTileId") REFERENCES "public"."bingo_set_tiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bingo_submissions" ADD CONSTRAINT "bingo_submissions_bingoItemId_bingo_items_id_fk" FOREIGN KEY ("bingoItemId") REFERENCES "public"."bingo_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bingo_items_user_idx" ON "bingo_items" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "bingo_items_set_tile_idx" ON "bingo_items" USING btree ("setTileId");