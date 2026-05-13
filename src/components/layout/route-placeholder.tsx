import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoutePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
      <Card className="w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(120deg,rgba(255,106,0,0.18),transparent_42%,rgba(255,255,255,0.06))]" />
        <div className="relative grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              {eyebrow}
            </p>
            <CardTitle className="max-w-3xl text-4xl md:text-6xl">
              {title}
            </CardTitle>
            <CardDescription className="max-w-2xl text-base">
              {description}
            </CardDescription>
          </CardHeader>
          <div className="flex justify-start md:justify-end">
            <Button asChild variant="secondary">
              <Link href="/">
                View foundation
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
