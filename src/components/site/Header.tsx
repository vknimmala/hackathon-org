import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.png";
import type { Session } from "@supabase/supabase-js";
import { REGISTRATIONS_OPEN } from "@/config/registrations-open";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

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
          {session ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  My Registration
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant={REGISTRATIONS_OPEN ? "default" : "outline"}
                  className={
                    REGISTRATIONS_OPEN
                      ? "bg-primary-gradient px-3 text-primary-foreground shadow-glow hover:opacity-90 sm:px-4"
                      : "px-3 sm:px-4"
                  }
                >
                  {REGISTRATIONS_OPEN ? "Register Now" : "Registration closed"}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
