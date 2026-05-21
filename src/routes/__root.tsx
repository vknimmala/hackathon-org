import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { HackBotWidget } from "@/components/site/HackBotWidget";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <a href="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SurgeVector.ai Hackathon 2026" },
      { name: "description", content: "Join the SurgeVector.ai AI-Driven Engineering Hackathon. Build, ship, and showcase the next wave of agentic apps." },
      { property: "og:title", content: "SurgeVector.ai Hackathon 2026" },
      { property: "og:description", content: "Join the SurgeVector.ai AI-Driven Engineering Hackathon. Build, ship, and showcase the next wave of agentic apps." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "SurgeVector.ai Hackathon 2026" },
      { name: "twitter:description", content: "Join the SurgeVector.ai AI-Driven Engineering Hackathon. Build, ship, and showcase the next wave of agentic apps." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/10ecb2fc-857d-4f9e-a883-76694905f35b/id-preview-7872bf94--8d5fcbd0-5ccc-45ed-9bee-70b0bdc8ff68.lovable.app-1778738072730.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/10ecb2fc-857d-4f9e-a883-76694905f35b/id-preview-7872bf94--8d5fcbd0-5ccc-45ed-9bee-70b0bdc8ff68.lovable.app-1778738072730.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <HackBotWidget />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
