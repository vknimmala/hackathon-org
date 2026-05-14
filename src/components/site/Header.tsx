import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.png";

export function Header() {
  const { pathname } = useLocation();
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (pathname !== "/") {
      setActive("");
      return;
    }
    const ids = ["journey", "faq"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  const navItem = (id: string, label: string) => {
    const isActive = active === id;
    return (
      <a
        href={`/#${id}`}
        className={`relative transition hover:text-foreground ${isActive ? "text-primary font-semibold" : ""}`}
      >
        {label}
        <span
          className={`absolute -bottom-1 left-0 right-0 mx-auto h-[2px] bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0"}`}
        />
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={logoIcon} alt="SurgeVector logo" className="h-9 w-9 shrink-0 object-contain" />
          <span className="truncate font-display text-base font-bold tracking-tight sm:text-lg">
            SurgeVector<span className="text-primary">.ai</span>
          </span>
          <span className="ml-2 hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
            Hackathon &#39;26
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {navItem("journey", "Journey")}
          {navItem("faq", "FAQs")}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link to="/register">
            <Button className="bg-primary-gradient px-3 text-primary-foreground shadow-glow hover:opacity-90 sm:px-4">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
