import { db } from "./db";
import { results, type InsertResult, type Result } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getResults(): Promise<Result[]>;
  getResultsBySubject(subject: string): Promise<Result[]>;
  createResult(result: InsertResult): Promise<Result>;
  clearResults(): Promise<void>;
  clearResultsBySubject(subject: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getResults(): Promise<Result[]> {
    return await db.select().from(results).orderBy(desc(results.createdAt)).limit(50);
  }

  async getResultsBySubject(subject: string): Promise<Result[]> {
    return await db.select().from(results).where(eq(results.subject, subject)).orderBy(desc(results.createdAt)).limit(10);
  }

  async createResult(insertResult: InsertResult): Promise<Result> {
    const [result] = await db.insert(results).values(insertResult).returning();
    return result;
  }

  async clearResults(): Promise<void> {
    await db.delete(results);
  }

  async clearResultsBySubject(subject: string): Promise<void> {
    await db.delete(results).where(eq(results.subject, subject));
  }
}

export const storage = new DatabaseStorage();
