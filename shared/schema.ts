import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  operation: text("operation").notNull(), // 'addition', 'subtraction', 'multiplication', 'division'
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertResultSchema = createInsertSchema(results).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;

export type CreateResultRequest = InsertResult;
export type ResultResponse = Result;
export type ResultsListResponse = Result[];
