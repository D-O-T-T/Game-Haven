import { useState } from "react";
import { useGames } from "@/hooks/use-games";
import { Navigation } from "@/components/Navigation";
import { GameCard } from "@/components/GameCard";
import { CategorySidebar } from "@/components/CategorySidebar";
import { useLocation, useSearch } from "wouter";
import { Loader2, AlertCircle, Zap, Flame, Trophy, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [_, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data: games, isLoading, error } = useGames({ category, search });

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) newParams.set("search", query);
    else newParams.delete("search");
    setLocation(`/?${newParams.toString()}`);
  };

  const featuredGame = games?.find(g => g.isFeatured) || games?.[0];
  const otherGames = games?.filter(g => g.id !== featuredGame?.id) || [];

  return (
    <div className="min-h-screen bg-background/50">
      <Navigation onSearch={handleSearch} />
      
      {/* Hero Section */}
      {!search && !category && (
        <section className="relative overflow-hidden pt-20 pb-32 border-b border-primary/20">
          <div className="absolute inset-0 arcade-grid opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter mb-4 text-glow">
                Game<span className="text-primary"> Haven</span>
              </h1>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[2px] w-12 bg-primary/50" />
                <p className="text-xl md:text-2xl font-display text-white uppercase tracking-widest text-glow">
                  Ultimate Unblocked Arcade
                </p>
                <div className="h-[2px] w-12 bg-primary/50" />
              </div>
              
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
                Experience the next generation of web gaming. Zero blocks, zero lag, just pure arcade energy.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full text-primary font-bold">
                  <Zap className="w-5 h-5" />
                  <span>50+ Games</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-4 py-2 rounded-full text-secondary font-bold">
                  <Flame className="w-5 h-5" />
                  <span>Daily Updates</span>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 rounded-full text-accent font-bold">
                  <Trophy className="w-5 h-5" />
                  <span>Leaderboards</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <CategorySidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-display">BOOTING UP SYSTEM...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4 text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 p-8 glass-panel">
                <AlertCircle className="w-12 h-12" />
                <h3 className="text-xl font-bold font-display">SYSTEM ERROR</h3>
                <p className="text-white/60">Failed to establish link with game database.</p>
              </div>
            ) : !games?.length ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center neon-border">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">NO DATA FOUND</h3>
                <p className="text-muted-foreground">The game you seek is not in our archives.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Hero / Featured Section (Only on main view) */}
                {!search && !category && featuredGame && (
                  <section className="animate-in fade-in zoom-in duration-700">
                    <div className="flex items-center gap-3 mb-8">
                      <Flame className="w-6 h-6 text-primary" />
                      <h2 className="text-3xl font-bold font-display text-white uppercase tracking-tight text-glow">
                        Featured Operation
                      </h2>
                    </div>
                    <GameCard game={featuredGame} featured className="aspect-video md:aspect-[21/9] neon-border" />
                  </section>
                )}

                {/* Grid */}
                <section className="animate-in slide-in-from-bottom-8 duration-700 delay-150">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-6 h-6 text-secondary" />
                      <h2 className="text-3xl font-bold font-display text-white uppercase tracking-tight text-glow-blue">
                        {category ? `${category} Sector` : search ? `Search: ${search}` : "Global Library"}
                      </h2>
                    </div>
                    <span className="text-xs font-bold font-display text-secondary border border-secondary/30 px-3 py-1 rounded-sm uppercase tracking-widest bg-secondary/5">
                      {games.length} Active Modules
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {/* Include featured game in grid if we are filtering, otherwise just show others */}
                    {(search || category ? games : otherGames).map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <GameCard game={game} className="aspect-[4/3] hover:neon-border transition-all duration-300" />
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-primary/20 mt-32 bg-card/80 backdrop-blur-xl py-16 relative overflow-hidden">
        <div className="absolute inset-0 arcade-grid opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h3 className="text-3xl font-bold font-display text-white uppercase tracking-widest text-glow">Game Haven</h3>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg leading-relaxed">
            The ultimate unblocked gaming terminal. Built for speed, styled for victory.
          </p>
          <div className="text-xs font-display text-white/20 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} NEXUS_OS_CORE. ALL SYSTEMS OPERATIONAL.
          </div>
        </div>
      </footer>
    </div>
  );
}
