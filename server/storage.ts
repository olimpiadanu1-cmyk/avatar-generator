import { avatars, type InsertAvatar, type Avatar } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAvatar(avatar: InsertAvatar): Promise<Avatar>;
}

export class DatabaseStorage implements IStorage {
  async createAvatar(insertAvatar: InsertAvatar): Promise<Avatar> {
    const [avatar] = await db
      .insert(avatars)
      .values(insertAvatar)
      .returning();
    return avatar;
  }
}

export const storage = new DatabaseStorage();
