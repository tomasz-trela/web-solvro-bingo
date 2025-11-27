
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, bingoItems, bingoSubmissions, bingoSetTiles } from "./schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);

export const db = drizzle(queryClient, {
    schema: { users, bingoItems, bingoSubmissions, bingoSetTiles }
});

async function seed() {
    console.log("🌱 Seeding database...");

    const hashedPassword = await hash("password123", 10);


    const existingUser = await db.select().from(users).where(eq(users.email, "user@example.com")).limit(1);
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@example.com")).limit(1);

    let userId: string;

    if (existingUser.length === 0) {
        const [newUser] = await db.insert(users).values({
            email: "user@example.com",
            name: "Jan Kowalski",
            password: hashedPassword,
            role: "user",
        }).returning();
        userId = newUser.id;
        console.log("✅ Created user: user@example.com");
    } else {
        userId = existingUser[0].id;
        console.log("ℹ️  User already exists: user@example.com");
    }

    if (existingAdmin.length === 0) {
        await db.insert(users).values({
            email: "admin@example.com",
            name: "Administrator",
            password: hashedPassword,
            role: "admin",
        });
        console.log("✅ Created admin: admin@example.com");
    } else {
        console.log("ℹ️  Admin already exists: admin@example.com");
    }

    const existingTiles = await db.select().from(bingoItems).where(eq(bingoItems.userId, userId));

    if (existingTiles.length === 0) {
        const bingoSets = [
            {
                set: 0,
                titles: [
                    "Ktoś spóźnił się",
                    "Problem z mikrofonem",
                    "Czy wszyscy mnie słyszą?",
                    "Udostępniono ekran",
                    "Dziecko w tle",
                    "Pies szczeka",
                    "Ktoś je podczas calla",
                    "Słychać budowę",
                    "Echo w rozmowie",
                    "Mikrofon włączony",
                    "Przypadkowe emoji",
                    "Spadło połączenie",
                    "Pisze w chacie",
                    "Niezręczne milczenie",
                    "Kawa w kadrze",
                    "Kot w kadrze"
                ]
            },
            {
                set: 1,
                titles: [
                    "Przestań dzielić ekran",
                    "Jestem w trasie",
                    "Przepraszam, byłem na mute",
                    "Czy możesz powtórzyć?",
                    "Muszę skoczyć na 5 minut",
                    "Zaraz wracam",
                    "Słyszę echo",
                    "Chwila, muszę coś zapisać",
                    "To było w mailu",
                    "Sprawdzę i wrócę",
                    "Nie widzę Twojego ekranu",
                    "Zamarza mi obraz",
                    "Przepraszam, miałem awarię internetu",
                    "Następny temat?",
                    "To wszystko z mojej strony",
                    "Ktoś może to zrobić"
                ]
            },
            {
                set: 2,
                titles: [
                    "Musisz się wyciszyć",
                    "Widzę tylko czarny ekran",
                    "Słyszysz mnie?",
                    "Zaraz, coś mi tu nie działa",
                    "Przepraszam, źle kliknąłem",
                    "Internet mi szwankuje",
                    "Zapomnij, że to powiedziałem",
                    "Nie przygotowałem się",
                    "Co było zadaniem?",
                    "Wyślij to na czat",
                    "Nie mogę teraz znaleźć",
                    "Ktoś widzi mój ekran?",
                    "Muszę odebrać telefon",
                    "Zaraz włączę kamerę",
                    "Przepraszam za spóźnienie",
                    "Połączenie się zerwało"
                ]
            }
        ];

        for (const bingoSet of bingoSets) {
            const existingSetTiles = await db.select().from(bingoSetTiles).where(eq(bingoSetTiles.set, bingoSet.set));

            if (existingSetTiles.length === 0) {
                const setTilesToInsert = bingoSet.titles.map((title, index) => ({
                    set: bingoSet.set,
                    index,
                    title,
                }));
                await db.insert(bingoSetTiles).values(setTilesToInsert);
                console.log(`✅ Created 16 bingo set tiles (set ${bingoSet.set})`);
            }
        }

        const setTiles = await db.select().from(bingoSetTiles).where(eq(bingoSetTiles.set, 0));

        const userItemsToInsert = setTiles.map((setTile) => ({
            userId,
            setTileId: setTile.id,
            status: "unverified" as const,
        }));

        await db.insert(bingoItems).values(userItemsToInsert);
        console.log("✅ Created 16 bingo items for user");
    } else {
        console.log(`ℹ️  User already has ${existingTiles.length} bingo items`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("📧 Regular user: user@example.com / password123");
    console.log("👨‍💼 Admin user: admin@example.com / password123");
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
