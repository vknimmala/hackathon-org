import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";

/** Floating HackBot panel (iframe → /hackbot.html?embed=1). Hidden on admin routes. */
export function HackBotWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full border border-[#E0D8D0] bg-[#C94E00] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#a83d00] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5820B] focus-visible:ring-offset-2"
          aria-label="Open HackBot assistant"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          HackBot
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-5 right-5 z-[60] flex w-[min(calc(100vw-1.5rem),400px)] flex-col overflow-hidden rounded-2xl border border-[#E0D8D0] bg-[#F2ECE5] shadow-2xl"
          style={{ height: "min(560px, calc(100dvh - 6rem))" }}
          role="dialog"
          aria-label="HackBot chat"
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#E0D8D0] bg-[#1A1A1A] px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-white">
                HackBot <span className="text-[#F5820B]">2026</span>
              </p>
              <p className="truncate text-[11px] text-white/50">SurgeVector Hackathon assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close HackBot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <iframe
            src="/hackbot.html?embed=1"
            title="HackBot chat"
            className="min-h-0 flex-1 w-full border-0 bg-[#F2ECE5]"
          />
        </div>
      )}
    </>
  );
}
