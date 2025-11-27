import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient, { schema: { users } });

async function createAdmin() {
    const args = process.argv.slice(2);

    if (args.length !== 3) {
        console.error("❌ Usage: npx tsx command/createAdmin.ts <email> <name> <password>");
        console.error("   Example: npx tsx command/createAdmin.ts admin@example.com 'Admin User' password123");
        process.exit(1);
    }

    const [email, name, password] = args;

    console.log("🔐 Creating admin account...");

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
        console.error(`❌ User with email ${email} already exists!`);
        process.exit(1);
    }

    const hashedPassword = await hash(password, 10);

    const [newAdmin] = await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
        role: "admin",
    }).returning();

    console.log("✅ Admin account created successfully!");
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Name: ${newAdmin.name}`);
    console.log(`   Role: ${newAdmin.role}`);

    process.exit(0);
}

createAdmin().catch((error) => {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
});
