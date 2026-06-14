export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between">
        <p>© 2026 MANTIS. AI-powered diagnostics for modern products.</p>
        <div className="flex gap-4">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="mailto:hello@mantis.ai" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
