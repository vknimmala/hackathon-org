export function Footer() {
  return (
    <footer className="border-t border-border/60 py-6">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SurgeVector.ai &mdash; Hackathon 2026. Built with intent.</p>
        <p>hackathon@surgevector.ai</p>
      </div>
    </footer>
  );
}
