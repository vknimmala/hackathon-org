import { Link } from "@tanstack/react-router";
import { ArrowLeft, Ban } from "lucide-react";
import { REGISTRATION_CLOSED_MESSAGE } from "@/config/registrations-open";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

type RegistrationClosedProps = {
  pageTitle?: string;
};

export function RegistrationClosed({ pageTitle = "Registration closed" }: RegistrationClosedProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-hero">
        <div className="mx-auto max-w-2xl px-6 py-24">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to hackathon
          </Link>
          <div className="mt-12 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-border/60 bg-card shadow-soft">
              <Ban className="h-8 w-8 text-muted-foreground" aria-hidden />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">{pageTitle}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{REGISTRATION_CLOSED_MESSAGE}</p>
            <div className="mt-8">
              <Link to="/">
                <Button className="bg-primary-gradient text-primary-foreground shadow-glow">Back home</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
