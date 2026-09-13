import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { catalogQueryOptions, type CatalogItem } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabels, formatFcfa, site } from "@/lib/site";
import { countries } from "@/lib/countries";
import { z } from "zod";

export const Route = createFileRoute("/commander")({
  validateSearch: z.object({ id: z.string().optional() }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  component: CommanderPage,
  head: () => ({
    meta: [
      { title: "Commander — NumExpress" },
      {
        name: "description",
        content: "Commande ton numéro virtuel ou ton abonnement en quelques secondes.",
      },
      { property: "og:title", content: "Commander — NumExpress" },
      { property: "og:description", content: "Commande ton numéro virtuel ou ton abonnement en quelques secondes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/commander" }],
  }),
});

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  let ref = "NX-";
  for (const b of buf) ref += chars[b % chars.length];
  return ref;
}

function CommanderPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { data: catalog } = useSuspenseQuery(catalogQueryOptions());
  const item = id ? catalog.find((i) => i.id === id) : undefined;

  const [selected, setSelected] = useState<CatalogItem | undefined>(item);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [payment, setPayment] = useState(site.paymentChannels[0]!.key);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sélecteur quand aucun service n'est passé dans l'URL
  if (!selected) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-display text-3xl tracking-tight">Que veux-tu commander ?</h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {catalog
              .filter((i) => i.is_available)
              .map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelected(i)}
                  className="card-surface flex items-center justify-between p-4 text-left hover:shadow-md"
                >
                  <span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {categoryLabels[i.category]}
                    </span>
                    <span className="block font-semibold">{i.service}</span>
                  </span>
                  <span className="font-display text-primary">{formatFcfa(i.price_fcfa)}</span>
                </button>
              ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const reference = makeReference();
      const { error: insertError } = await supabase.from("orders").insert({
        reference,
        phone_number_id: selected!.id,
        service: selected!.service,
        category: selected!.category,
        amount_fcfa: selected!.price_fcfa,
        buyer_name: name.trim(),
        buyer_phone: phone.trim(),
        payment_method: payment,
        country,
      });
      if (insertError) throw insertError;
      await navigate({ to: "/commande/$ref", params: { ref: reference } });
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Réessaie ou contacte-nous sur WhatsApp.");
      setSubmitting(false);
    }
  }

  const current = selected;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/catalogue" className="text-sm font-bold text-primary hover:underline">
          ← Retour au catalogue
        </Link>
        <h1 className="mt-3 font-display text-3xl tracking-tight">Finaliser la commande</h1>

        <div className="card-surface mt-6 flex items-center justify-between p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {categoryLabels[current.category]}
            </p>
            <p className="mt-1 font-display text-lg">{current.service}</p>
          </div>
          <p className="font-display text-2xl text-primary">{formatFcfa(current.price_fcfa)}</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="buyer-name" className="field-label">
              Ton nom complet
            </label>
            <input
              id="buyer-name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Ibrahim Souley"
              required
            />
          </div>
          <div>
            <label htmlFor="buyer-phone" className="field-label">
              Ton numéro de téléphone (ou WhatsApp)
            </label>
            <input
              id="buyer-phone"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+227 …"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="field-label">
              Pays du numéro souhaité
            </label>
            <select
              id="country"
              className="input-field"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>
                Choisis ton pays
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-muted-foreground">
              Disponible pour tous les pays. Si ton pays n'est pas dans la liste, écris-nous sur WhatsApp.
            </p>
          </div>
          <div>
            <span className="field-label">Moyen de paiement</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {site.paymentChannels.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setPayment(c.key)}
                  className={
                    "rounded-2xl border-2 p-4 text-left font-semibold transition " +
                    (payment === c.key
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-muted-foreground/40")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-primary w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirmer la commande — {formatFcfa(current.price_fcfa)}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Tu recevras les instructions de paiement à l'étape suivante.
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
