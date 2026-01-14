import { Link, useSearch } from "wouter";
import { cn } from "@/lib/utils";
import { Sword, Puzzle, Car, Globe, Cpu, LayoutGrid, Gamepad } from "lucide-react";

export function CategorySidebar() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const currentCategory = searchParams.get("category");

  const categories = [
    { id: "all", label: "All Games", icon: LayoutGrid, href: "/" },
    { id: "Action", label: "Action", icon: Sword, href: "/?category=Action" },
    { id: "Puzzle", label: "Puzzle", icon: Puzzle, href: "/?category=Puzzle" },
    { id: "Racing", label: "Racing", icon: Car, href: "/?category=Racing" },
    { id: "Strategy", label: "Strategy", icon: Globe, href: "/?category=Strategy" },
    { id: "Emulators", label: "Emulators", icon: Cpu, href: "/?category=Emulators" },
    { id: "Arcade", label: "Arcade", icon: Gamepad, href: "/?category=Arcade" },
  ];

  return (
    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
      <div className="bg-card rounded-xl p-4 border border-white/5">
        <h3 className="text-lg font-bold font-display text-white mb-4 px-2">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => {
            const isActive = category.id === "all" 
              ? !currentCategory 
              : currentCategory === category.id;
            
            return (
              <Link 
                key={category.id} 
                href={category.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <category.icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                )} />
                {category.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-accent/20 to-purple-900/20 rounded-xl p-6 border border-accent/20 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Pro Member?</h3>
        <p className="text-sm text-muted-foreground mb-4">Unlock ad-free gaming and exclusive titles.</p>
        <button className="w-full py-2 rounded-lg bg-accent hover:bg-accent/90 text-white font-bold text-sm transition-colors shadow-lg shadow-accent/25">
          Go Premium
        </button>
      </div>
    </div>
  );
}
