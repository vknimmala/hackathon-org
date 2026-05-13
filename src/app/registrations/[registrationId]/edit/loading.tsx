import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditRegistrationLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,106,0,0.28),transparent_28rem),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.12),transparent_22rem)]"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Registration Editing
            </p>
            <CardTitle>Loading registration...</CardTitle>
            <CardDescription className="text-base leading-7">
              Fetching the current team and member details.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
