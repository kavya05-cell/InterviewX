import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/index";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/record", label: "Record" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [loc] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-lg bg-primary grid place-items-center group-hover:scale-105 transition-transform glow-primary">
            <Terminal className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Interview<span className="text-primary">X</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active = loc === l.href || (l.href !== "/" && loc.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3.5 py-1.5 text-sm rounded-lg transition-all font-medium",
                  active
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button size="sm" className="hidden md:inline-flex font-medium">
              Get early access
            </Button>
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 pb-4 pt-2">
          {links.map((l) => {
            const active = loc === l.href || (l.href !== "/" && loc.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm rounded-lg transition-all font-medium mb-0.5",
                  active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/login" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full mt-2">Get early access</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
