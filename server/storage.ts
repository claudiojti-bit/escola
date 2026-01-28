import { db } from "./db";
import { results, type InsertResult, type Result } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getResults(): Promise<Result[]>;
  createResult(result: InsertResult): Promise<Result>;
  clearResults(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getResults(): Promise<Result[]> {
    return await db.select().from(results).orderBy(desc(results.createdAt)).limit(10);
  }

  async createResult(insertResult: InsertResult): Promise<Result> {
    const [result] = await db.insert(results).values(insertResult).returning();
    return result;
  }

  async clearResults(): Promise<void> {
    await db.delete(results);
  }
}

export const storage = new DatabaseStorage();
