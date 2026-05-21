import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { REGISTRATIONS_OPEN, REGISTRATION_CLOSED_MESSAGE } from "@/config/registrations-open";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign In — SurgeVector Hackathon 2026" }] }),
});

// Links the signed-in auth user to any registration that matches their email
// but doesn't have a user_id yet (legacy registrations submitted pre-auth).
async function claimRegistration() {
  const { error } = await (supabase.rpc as Function)("claim_registration");
  if (error) console.error("claim_registration:", error.message);
}

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { toast.error(error.message); return; }
        await claimRegistration();
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) { toast.error(error.message); return; }
        if (data.session) {
          // Email confirmation disabled — signed in immediately
          await claimRegistration();
          navigate({ to: "/dashboard", replace: true });
        } else {
          toast.success("Check your email to confirm your account, then sign in.");
          setMode("login");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 grid place-items-center px-4 py-10 sm:py-16 bg-hero">
        <Card className="w-full max-w-md p-8">
          <h1 className="font-display text-2xl font-bold">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Access and manage your hackathon registration."
              : "Use the same email you registered with to link your submission."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={6}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="mt-1.5"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-gradient text-primary-foreground shadow-glow h-11"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            {mode === "login" ? "No account? Sign up" : "Already have an account? Sign in"}
          </button>
          <p className="mt-6 text-xs text-muted-foreground border-t border-border pt-4">
            {REGISTRATIONS_OPEN ? (
              <>
                Not registered yet?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Register for the hackathon
                </Link>
              </>
            ) : (
              REGISTRATION_CLOSED_MESSAGE
            )}
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
