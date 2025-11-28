import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient);

async function truncateAll() {
    console.log("🗑️  Truncating all tables...");

    try {
        await db.execute(sql`
            TRUNCATE TABLE bingo_submissions CASCADE;
            TRUNCATE TABLE bingo_items CASCADE;
            TRUNCATE TABLE bingo_set_tiles CASCADE;
            TRUNCATE TABLE users CASCADE;
        `);

        console.log("✅ All tables truncated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to truncate tables:", error);
        process.exit(1);
    }
}

truncateAll();
