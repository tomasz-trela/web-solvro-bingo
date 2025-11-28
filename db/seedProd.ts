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
                "Zaśpiewaj temperatura",
                "Zagrać we flanki",
                "Zrobić pranka (śmieszy)",
                "Uścisk z dłoni z headem mobilka",
                "Zatańcz Belgijkę",
                "Zbierz 15 podpisów na sobie",
                "Zrob komuś warkocza",
                "Idź na sesje zdjęciową do Domy",
                "Zdjęcie z najmłodszą osobą",
                "Zdjęcie z zielonymi oczami",
                "Zrób pozycje yogi w conajmniej 2 osoby",
                "Zrób zdjęcie z 10 osobami na raz",
                "Zdjęcie z osoba, której imię zaczyna się na tą same literę imienia",
                "Znajdź osobę z tatuażem",
                "Zdjęcie z zółtym pojazdem",
                "Zdjęcie z Violettą Villas"
            ]
        },
        {
            set: 1,
            titles: [
                "Zaśpiewaj erotyczne pif paf",
                "Zagrać we flip cupy",
                "Zrobić pranka (śmieszy)",
                "Uścisk z dłoni z headem mobilka",
                "Zatańcz Belgijkę",
                "Zbierz 15 podpisów na sobie",
                "Zrob komuś warkocza",
                "Idź na sesje zdjęciową do Domy",
                "Zdjęcie z najmłodszą osobą",
                "Zdjęcie z zielonymi oczami",
                "Zrób pozycje yogi w conajmniej 2 osoby",
                "Zrób zdjęcie z 10 osobami na raz",
                "Zdjęcie z osoba, której imię zaczyna się na tą same literę imienia",
                "Znajdź osobę z tatuażem",
                "Zdjęcie z zółtym pojazdem",
                "Zdjęcie z Violettą Villas"
            ]
        },
        {
            set: 2,
            titles: [
                "Zaśpiewaj sexoholik",
                "Zagrać w beer ponga",
                "Zrobić pranka (śmieszy)",
                "Uścisk z dłoni z headem devops",
                "Zatańcz Makarenę",
                "Zbierz 15 podpisów na sobie",
                "Zrob komuś warkocza",
                "Idź na sesje zdjęciową do Domy",
                "Zdjęcie z najstarszą osobą",
                "Zdjęcie z rudą osobą",
                "Zrób pozycje yogi w conajmniej 2 osoby",
                "Zrób zdjęcie z 10 osobami na raz",
                "Zdjęcie z osoba, której imię zaczyna się na tą same literę nazwiska",
                "Znajdź osobę z tatuażem",
                "Zdjęcie z zółtym pojazdem",
                "Zdjęcie z Czesławą Gospodarek"
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
