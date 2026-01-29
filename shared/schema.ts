import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  topic: text("topic"),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResultSchema = createInsertSchema(results).omit({ id: true, createdAt: true });

export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;

export type CreateResultRequest = InsertResult;
export type ResultResponse = Result;
export type ResultsListResponse = Result[];

export const subjects = ['preLiteracy', 'portuguese', 'math', 'geography', 'history'] as const;
export type Subject = typeof subjects[number];

export const subjectLabels: Record<Subject, string> = {
  math: 'Matemática',
  preLiteracy: 'Pré-alfabetização',
  portuguese: 'Português',
  geography: 'Geografia',
  history: 'História',
};
