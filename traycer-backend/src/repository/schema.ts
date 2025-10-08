import { json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const plan = pgTable("plan", {
    planId: varchar("plan_id").primaryKey(),
    query: varchar("query").notNull(),
    response: json("response").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
})