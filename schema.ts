import { pgTable, text, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(), // URL to the game (iframe source or emulator path)
  thumbnail: text("thumbnail").notNull(), // URL to image
  type: text("type").notNull(), // 'html5', 'emulator', 'flash'
  category: text("category").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).omit({ 
  id: true, 
  createdAt: true 
});

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type CreateGameRequest = InsertGame;
export type UpdateGameRequest = Partial<InsertGame>;

export interface GamesQueryParams {
  search?: string;
  category?: string;
}
