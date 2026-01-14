import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingGames = await storage.getGames();
  if (existingGames.length === 0) {
    const initialGames = [
      {
        title: "2048",
        description: "Join the numbers and get to the 2048 tile! A classic puzzle game.",
        url: "https://play2048.co/",
        thumbnail: "https://play-lh.googleusercontent.com/bZregCeEpzMwRoocLnsYb4Te-vPPHkW1k5H1xsQ3qK9yE00fixpWu5fNsUz3ut2IiDHn=w240-h480-rw",
        type: "html5",
        category: "Puzzle",
        isFeatured: true
      },
      {
        title: "Hextris",
        description: "An addictive puzzle game inspired by Tetris. Rotate the hexagon to match colors.",
        url: "https://hextris.io/",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
        type: "html5",
        category: "Puzzle",
        isFeatured: false
      },
      {
        title: "Cookie Clicker",
        description: "Bake millions of cookies in this addictive idle game.",
        url: "https://orteil.dashnet.org/cookieclicker/",
        thumbnail: "https://images.unsplash.com/photo-1499636138143-bd649043ea52?auto=format&fit=crop&q=80&w=600",
        type: "html5",
        category: "Strategy",
        isFeatured: true
      },
      {
        title: "Retro Space Shooter",
        description: "Classic arcade space shooter action.",
        url: "https://canvas-space-shooter.pages.dev/", 
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600",
        type: "html5",
        category: "Action",
        isFeatured: false
      },
      {
        title: "Minecraft Classic",
        description: "Play the classic version of Minecraft directly in your browser.",
        url: "https://classic.minecraft.net/",
        thumbnail: "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?auto=format&fit=crop&q=80&w=600",
        type: "html5",
        category: "Adventure",
        isFeatured: true
      },
      {
        title: "Pacman",
        description: "The retro classic Pacman. Eat dots and avoid ghosts!",
        url: "https://freepacman.org/",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
        type: "emulator",
        category: "Arcade",
        isFeatured: false
      },
       {
        title: "Tetris",
        description: "The world's most famous puzzle game.",
        url: "https://tetris.com/play-tetris",
        thumbnail: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=600",
        type: "html5",
        category: "Puzzle",
        isFeatured: false
      }
    ];

    for (const game of initialGames) {
      await storage.createGame(game);
    }
    console.log("Database seeded with initial games");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup
  seedDatabase();

  app.get(api.games.list.path, async (req, res) => {
    try {
      const params = api.games.list.input?.parse(req.query);
      const games = await storage.getGames(params);
      res.json(games);
    } catch (err) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  app.get(api.games.get.path, async (req, res) => {
    const game = await storage.getGame(Number(req.params.id));
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  });

  app.post(api.games.create.path, async (req, res) => {
    try {
      const input = api.games.create.input.parse(req.body);
      const game = await storage.createGame(input);
      res.status(201).json(game);
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

  return httpServer;
}
