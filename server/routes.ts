import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertAvatarSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post('/api/avatars', async (req, res) => {
    try {
      const data = insertAvatarSchema.parse(req.body);
      const avatar = await storage.createAvatar(data);
      res.status(201).json(avatar);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get('/api/styles', async (req, res) => {
    const stylesDir = path.join(process.cwd(), "client", "public", "images", "styles");
    try {
      // Ensure directory exists
      if (!fs.existsSync(stylesDir)) {
        return res.json([]);
      }
      
      const files = await fs.promises.readdir(stylesDir);
      const styleImages = files
        .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
        .map(file => `/images/styles/${file}`);
      
      res.json(styleImages);
    } catch (error) {
      console.error("Error reading styles:", error);
      res.status(500).json({ message: "Failed to load styles" });
    }
  });

  return httpServer;
}
