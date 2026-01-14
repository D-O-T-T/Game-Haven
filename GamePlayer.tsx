import { useParams, Link } from "wouter";
import { useGame } from "@/hooks/use-games";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { 
  Maximize2, 
  ThumbsUp, 
  Share2, 
  Info, 
  ArrowLeft,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function GamePlayer() {
  const { id } = useParams();
  const gameId = id ? parseInt(id) : 0;
  const { data: game, isLoading, error } = useGame(gameId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <AlertTriangle className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold text-white">Game not found</h1>
        <p className="text-muted-foreground">The game you are looking for might have been removed or is temporarily unavailable.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Games
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white">{game.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary border border-primary/20 uppercase tracking-wide">
              {game.category}
            </span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{game.type.toUpperCase()}</span>
          </div>
        </div>

        {/* Game Container */}
        <div 
          ref={containerRef}
          className={cn(
            "relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-video group",
            isFullscreen && "fixed inset-0 z-50 rounded-none border-none aspect-auto"
          )}
        >
          {/* Loading Overlay (hidden when loaded usually, but good for perceived perf) */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 pointer-events-none -z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>

          <iframe
            ref={iframeRef}
            src={game.url}
            title={game.title}
            className="w-full h-full border-0 block"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />

          {/* Controls Overlay - Shows on hover or if not fullscreen */}
          {!isFullscreen && (
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                size="icon" 
                variant="secondary" 
                className="bg-background/80 backdrop-blur hover:bg-white text-foreground hover:text-black shadow-lg"
                onClick={toggleFullscreen}
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                <ThumbsUp className="w-4 h-4" />
                Like Game
              </Button>
              <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5 hover:text-white">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-secondary" />
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {game.description}
              </p>
            </div>
          </div>

          {/* Side Panel (Could be related games or ads) */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-card rounded-xl p-6 border border-white/5">
              <h3 className="font-bold text-white mb-4">Controls</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Move</span>
                  <span className="text-white font-mono">WASD / Arrows</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Action</span>
                  <span className="text-white font-mono">Space / Click</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Pause</span>
                  <span className="text-white font-mono">P / Esc</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-transparent rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-white mb-2">Report Issue?</h3>
              <p className="text-xs text-muted-foreground mb-4">
                If the game is not working or blocked, let us know.
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Report Broken Game
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
