import { Link, useLocation } from "wouter";
import { Gamepad2, Search, Trophy, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export function Navigation({ onSearch }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (onSearch) onSearch(query);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/?category=Action", label: "Action" },
    { href: "/?category=Racing", label: "Racing" },
    { href: "/?category=Strategy", label: "Strategy" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25 neon-border">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 font-display uppercase tracking-wider text-glow">
            Game<span className="text-primary"> Haven</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              name="search"
              placeholder="Search games..." 
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-full transition-all duration-300 hover:bg-white/10"
            />
          </form>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" className="hidden lg:flex gap-2 border-primary/50 text-primary hover:bg-primary hover:text-white">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-card p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              name="search"
              placeholder="Search games..." 
              className="pl-10 bg-white/5"
            />
          </form>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className={`p-2 rounded-lg transition-colors ${
                  location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
