import { avatars, type InsertAvatar, type Avatar } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAvatar(avatar: InsertAvatar): Promise<Avatar>;
}

export class MemStorage implements IStorage {
  private avatars: Map<number, Avatar>;
  private currentId: number;

  constructor() {
    this.avatars = new Map();
    this.currentId = 1;
  }

  async createAvatar(insertAvatar: InsertAvatar): Promise<Avatar> {
    const id = this.currentId++;
    const avatar: Avatar = { ...insertAvatar, id, createdAt: new Date(), nickname: insertAvatar.nickname ?? null };
    this.avatars.set(id, avatar);
    return avatar;
  }
}

export class DatabaseStorage implements IStorage {
  async createAvatar(insertAvatar: InsertAvatar): Promise<Avatar> {
    if (!db) throw new Error("Database not initialized");
    const [avatar] = await db
      .insert(avatars)
      .values(insertAvatar)
      .returning();
    return avatar;
  }
}

export const storage = db ? new DatabaseStorage() : new MemStorage();
