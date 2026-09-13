import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-sm text-primary-foreground">
            NX
          </span>
          <span className="font-display text-lg tracking-tight">{site.brand}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>
          <Link to="/catalogue" className="hover:text-primary">
            Catalogue
          </Link>
          <Link to="/suivi" className="hover:text-primary">
            Suivre ma commande
          </Link>
        </nav>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn btn-dark !px-4 !py-2 text-sm">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">{site.brand}</p>
          <p className="mt-2 text-sm opacity-80">{site.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="font-bold uppercase tracking-wider opacity-70">Navigation</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/catalogue" className="hover:underline">
                Catalogue
              </Link>
            </li>
            <li>
              <Link to="/suivi" className="hover:underline">
                Suivre ma commande
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold uppercase tracking-wider opacity-70">Contact</p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 hover:underline"
          >
            <MessageCircle className="h-4 w-4" />
            Écris-nous sur WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {site.brand} — Niamey, Niger
      </div>
    </footer>
  );
}
