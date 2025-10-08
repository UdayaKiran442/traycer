import { pgTable, varchar } from "drizzle-orm/pg-core";

export const plan = pgTable("plan", {
    planId: varchar("plan_id").primaryKey(),
    query: varchar("query").notNull(),
    response: varchar("response"),
    createdAt: varchar("created_at").notNull(),
    updatedAt: varchar("updated_at").notNull(),
})