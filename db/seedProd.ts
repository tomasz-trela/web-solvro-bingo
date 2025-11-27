import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { bingoSetTiles } from "./schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);

export const db = drizzle(queryClient, {
    schema: { bingoSetTiles }
});

async function seedProd() {
    console.log("🌱 Seeding production database (sets only)...");

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
        } else {
            console.log(`ℹ️  Set ${bingoSet.set} already exists with ${existingSetTiles.length} tiles`);
        }
    }

    console.log("✅ Production seeding completed!");
    process.exit(0);
}

seedProd().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
