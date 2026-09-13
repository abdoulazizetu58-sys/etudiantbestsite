import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/suivi")({
  component: SuiviPage,
  head: () => ({
    meta: [
      { title: "Suivre ma commande — NumExpress" },
      { name: "description", content: "Suis le statut de ta commande avec ta référence." },
      { property: "og:title", content: "Suivre ma commande — NumExpress" },
      { property: "og:description", content: "Suis le statut de ta commande avec ta référence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/suivi" }],
  }),
});

function SuiviPage() {
  const navigate = useNavigate();
  const [ref, setRef] = useState("");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl tracking-tight">Suivre ma commande</h1>
        <p className="mt-2 text-muted-foreground">
          Entre la référence reçue lors de ta commande (par exemple NX-A1B2C3).
        </p>
        <form
          className="mt-8 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const clean = ref.trim().toUpperCase();
            if (clean) navigate({ to: "/commande/$ref", params: { ref: clean } });
          }}
        >
          <input
            className="input-field flex-1 uppercase"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="NX-XXXXXX"
            required
          />
          <button type="submit" className="btn btn-primary">
            <Search className="h-4 w-4" />
            Voir
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
