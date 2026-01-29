import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.results.list.path, async (req, res) => {
    const results = await storage.getResults();
    res.json(results);
  });

  app.get('/api/results/:subject', async (req, res) => {
    const results = await storage.getResultsBySubject(req.params.subject);
    res.json(results);
  });

  app.post(api.results.create.path, async (req, res) => {
    try {
      const input = api.results.create.input.parse(req.body);
      const result = await storage.createResult(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.results.clear.path, async (req, res) => {
    await storage.clearResults();
    res.status(204).end();
  });

  app.delete('/api/results/:subject', async (req, res) => {
    await storage.clearResultsBySubject(req.params.subject);
    res.status(204).end();
  });

  return httpServer;
}
