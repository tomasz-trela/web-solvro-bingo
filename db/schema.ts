import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, integer, pgEnum, unique, check, index } from "drizzle-orm/pg-core";


export const userRole = pgEnum("user_role", ["user", "admin"]);
export const bingoTileStatus = pgEnum("bingo_tile_status", [
    "unverified",
    "pending",
    "verified",
    "rejected"
]);

export const users = pgTable("users", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    role: userRole("role").notNull().default("user"),
});

export const bingoSetTiles = pgTable("bingo_set_tiles", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    set: integer("set").notNull(),
    index: integer("index").notNull(),
    title: text("title").notNull(),
}, (table) => [
    check("index_range_check", sql`${table.index} >= 0 AND ${table.index} <= 15`),
    unique("unique_set_index").on(table.set, table.index),
]);

export const bingoItems = pgTable("bingo_items", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    setTileId: text("setTileId")
        .notNull()
        .references(() => bingoSetTiles.id, { onDelete: "cascade" }),
    status: bingoTileStatus("status").notNull().default("unverified"),
    rejectionReason: text("rejectionReason")
}, (table) => [
    unique("unique_user_set_tile").on(table.userId, table.setTileId),
    index("bingo_items_user_idx").on(table.userId),
    index("bingo_items_set_tile_idx").on(table.setTileId)
]);

export const bingoSubmissions = pgTable("bingo_submissions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    bingoItemId: text("bingoItemId")
        .notNull()
        .references(() => bingoItems.id, { onDelete: "cascade" }),
    image: text("image"),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt").defaultNow()
});
