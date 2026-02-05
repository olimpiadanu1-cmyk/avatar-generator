import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const avatars = pgTable("avatars", {
  id: serial("id").primaryKey(),
  style: text("style").notNull(),
  nickname: text("nickname"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAvatarSchema = createInsertSchema(avatars).omit({ 
  id: true, 
  createdAt: true 
});

export type Avatar = typeof avatars.$inferSelect;
export type InsertAvatar = z.infer<typeof insertAvatarSchema>;
