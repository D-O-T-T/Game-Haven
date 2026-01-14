import { db } from "./db";
import {
  games,
  type Game,
  type InsertGame,
  type GamesQueryParams
} from "@shared/schema";
import { eq, ilike, and, desc } from "drizzle-orm";

export interface IStorage {
  getGames(params?: GamesQueryParams): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
}

export class DatabaseStorage implements IStorage {
  async getGames(params?: GamesQueryParams): Promise<Game[]> {
    const conditions = [];
    
    if (params?.search) {
      conditions.push(ilike(games.title, `%${params.search}%`));
    }
    
    if (params?.category) {
      conditions.push(eq(games.category, params.category));
    }

    return await db.select()
      .from(games)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(games.isFeatured), desc(games.createdAt));
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(insertGame).returning();
    return game;
  }
}

export const storage = new DatabaseStorage();
