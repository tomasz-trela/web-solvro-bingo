import { db } from "@/db";
import { users, bingoItems, bingoSubmissions, bingoSetTiles } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export async function getUserByEmail(email: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return user;
}

export async function createUser(data: {
    email: string;
    password: string;
    name?: string | null;
}) {
    const [newUser] = await db
        .insert(users)
        .values({
            email: data.email,
            password: data.password,
            name: data.name || null,
        })
        .returning({
            id: users.id,
            email: users.email,
            name: users.name,
        });

    return newUser;
}

export async function createUserBingoItems(userId: string) {
    const sets = await db
        .selectDistinct({ set: bingoSetTiles.set })
        .from(bingoSetTiles);

    if (sets.length === 0) {
        throw new Error("No bingo sets found in database");
    }

    const availableSets = sets.map(s => s.set);
    const randomSet = availableSets[Math.floor(Math.random() * availableSets.length)];

    const setTiles = await db
        .select()
        .from(bingoSetTiles)
        .where(eq(bingoSetTiles.set, randomSet));

    if (setTiles.length === 0) {
        throw new Error(`No tiles found for set ${randomSet}`);
    }

    const userItemsToInsert = setTiles.map((setTile) => ({
        userId,
        setTileId: setTile.id,
        status: "unverified" as const,
    }));

    await db.insert(bingoItems).values(userItemsToInsert);

    return randomSet;
}

export async function getBingoItemsByUserId(userId: string) {
    const tiles = await db
        .select({
            id: bingoItems.id,
            userId: bingoItems.userId,
            setTileId: bingoItems.setTileId,
            status: bingoItems.status,
            rejectionReason: bingoItems.rejectionReason,
            index: bingoSetTiles.index,
            title: bingoSetTiles.title,
        })
        .from(bingoItems)
        .innerJoin(bingoSetTiles, eq(bingoItems.setTileId, bingoSetTiles.id))
        .where(eq(bingoItems.userId, userId))
        .orderBy(bingoSetTiles.index);

    return tiles;
}

export async function getBingoItemById(itemId: string, userId: string) {
    const [item] = await db
        .select()
        .from(bingoItems)
        .where(
            and(
                eq(bingoItems.id, itemId),
                eq(bingoItems.userId, userId)
            )
        )
        .limit(1);

    return item;
}

export async function updateBingoItemStatus(
    itemId: string,
    userId: string,
    status: "unverified" | "pending" | "verified" | "rejected"
) {
    const [updatedTile] = await db
        .update(bingoItems)
        .set({ status })
        .where(
            and(
                eq(bingoItems.id, itemId),
                eq(bingoItems.userId, userId)
            )
        )
        .returning();

    return updatedTile;
}

export async function adminUpdateBingoItem(
    itemId: string,
    data: {
        status?: "unverified" | "pending" | "verified" | "rejected";
        rejectionReason?: string | null;
    }
) {
    const updateData: Record<string, any> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.rejectionReason !== undefined) updateData.rejectionReason = data.rejectionReason;

    const [updatedTile] = await db
        .update(bingoItems)
        .set(updateData)
        .where(eq(bingoItems.id, itemId))
        .returning();

    return updatedTile;
}

export async function createBingoSubmission(data: {
    bingoItemId: string;
    image?: string | null;
    message: string;
}) {
    const [submission] = await db
        .insert(bingoSubmissions)
        .values({
            bingoItemId: data.bingoItemId,
            image: data.image || null,
            message: data.message,
        })
        .returning();

    return submission;
}

export async function getBingoSubmissionsByUserId(userId: string) {
    const submissions = await db
        .select({
            id: bingoSubmissions.id,
            bingoItemId: bingoSubmissions.bingoItemId,
            image: bingoSubmissions.image,
            message: bingoSubmissions.message,
            createdAt: bingoSubmissions.createdAt,
            bingoItem: {
                id: bingoItems.id,
                title: bingoSetTiles.title,
                status: bingoItems.status,
                index: bingoSetTiles.index,
            }
        })
        .from(bingoSubmissions)
        .innerJoin(bingoItems, eq(bingoSubmissions.bingoItemId, bingoItems.id))
        .innerJoin(bingoSetTiles, eq(bingoItems.setTileId, bingoSetTiles.id))
        .where(eq(bingoItems.userId, userId))
        .orderBy(bingoSubmissions.createdAt);

    return submissions;
}

export async function getBingoSubmissions() {
    const submissions = await db
        .select({
            id: bingoSubmissions.id,
            bingoItemId: bingoSubmissions.bingoItemId,
            image: bingoSubmissions.image,
            message: bingoSubmissions.message,
            createdAt: bingoSubmissions.createdAt,
            bingoItem: {
                id: bingoItems.id,
                title: bingoSetTiles.title,
                status: bingoItems.status,
                index: bingoSetTiles.index,
                userId: bingoItems.userId,
            },
            user: {
                id: users.id,
                email: users.email,
                name: users.name,
            }
        })
        .from(bingoSubmissions)
        .innerJoin(bingoItems, eq(bingoSubmissions.bingoItemId, bingoItems.id))
        .innerJoin(bingoSetTiles, eq(bingoItems.setTileId, bingoSetTiles.id))
        .innerJoin(users, eq(bingoItems.userId, users.id))
        .where(eq(bingoItems.status, "pending"))
        .orderBy(bingoSubmissions.createdAt);

    return submissions;
}

export async function getLeaderboard() {
    const leaderboard = await db
        .select({
            userId: users.id,
            email: users.email,
            name: users.name,
            verifiedCount: sql<number>`cast(count(case when ${bingoItems.status} = 'verified' then 1 end) as int)`,
        })
        .from(users)
        .where(eq(users.role, "user"))
        .leftJoin(bingoItems, eq(bingoItems.userId, users.id))
        .groupBy(users.id, users.email, users.name)
        .orderBy(desc(sql`count(case when ${bingoItems.status} = 'verified' then 1 end)`))
        .limit(10);

    return leaderboard;
}
