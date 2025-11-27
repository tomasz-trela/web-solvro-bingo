ALTER TABLE "bingo_submissions" ALTER COLUMN "image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bingo_submissions" ALTER COLUMN "message" SET NOT NULL;