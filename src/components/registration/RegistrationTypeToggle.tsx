import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Track = "participant" | "volunteer";

export function RegistrationTypeToggle({ active }: { active: Track }) {
  return (
    <div className="inline-flex rounded-full border border-border/60 bg-card p-1 shadow-soft">
      <Link
        to="/register"
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition",
          active === "participant"
            ? "bg-primary-gradient text-primary-foreground shadow-glow"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Participant
      </Link>
      <Link
        to="/volunteer"
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition",
          active === "volunteer"
            ? "bg-primary-gradient text-primary-foreground shadow-glow"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Volunteer
      </Link>
    </div>
  );
}
