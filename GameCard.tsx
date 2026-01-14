import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import { type Game } from "@shared/schema";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  className?: string;
  featured?: boolean;
}

export function GameCard({ game, className, featured = false }: GameCardProps) {
  return (
    <Link href={`/game/${game.id}`}>
      <div 
        className={cn(
          "group relative overflow-hidden rounded-xl bg-card border border-white/5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 cursor-pointer",
          featured ? "h-full min-h-[400px]" : "h-full",
          className
        )}
      >
        {/* Image Background */}
        <div className="absolute inset-0">
          <img 
            src={game.thumbnail} 
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            {featured && (
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-white bg-primary rounded-full shadow-lg shadow-primary/25">
                Featured Game
              </span>
            )}
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-secondary uppercase tracking-wider mb-1 block">
                  {game.category}
                </span>
                <h3 className={cn("font-display font-bold text-white group-hover:text-primary transition-colors", featured ? "text-3xl" : "text-xl")}>
                  {game.title}
                </h3>
              </div>
              
              {game.isFeatured && !featured && (
                <div className="bg-yellow-500/20 p-1.5 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>

            {featured && (
              <p className="mt-2 text-muted-foreground line-clamp-2 max-w-lg">
                {game.description}
              </p>
            )}

            <div className={cn(
              "flex items-center gap-2 mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
              featured && "opacity-100"
            )}>
              <span className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 group-hover:bg-primary group-hover:border-primary transition-colors">
                <Play className="w-4 h-4 fill-current" />
                Play Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
