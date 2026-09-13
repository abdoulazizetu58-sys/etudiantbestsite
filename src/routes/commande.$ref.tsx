import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getOrderByReference } from "@/lib/orders.functions";
import { categoryLabels, formatFcfa, getPaymentChannel, statusLabels, site } from "@/lib/site";

export const Route = createFileRoute("/commande/$ref")({
  loader: async ({ params }) => {
    const order = await getOrderByReference({ data: { reference: params.ref } });
    if (!order) throw notFound();
    return { order };
  },
  component: OrderPage,
  head: ({ params }) => ({
    meta: [
      { title: `Commande ${params.ref} — NumExpress` },
      { name: "description", content: "Détails et instructions de paiement de ta commande." },
      { property: "og:title", content: `Commande ${params.ref} — NumExpress` },
      { property: "og:description", content: "Détails et instructions de paiement de ta commande." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function OrderPage() {
  const { order } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const channel = getPaymentChannel(order.payment_method);
  const status = statusLabels[order.status] ?? statusLabels.en_attente;

  const waMessage = `Bonjour, j'ai payé ma commande ${order.reference} (${order.service} — ${formatFcfa(order.amount_fcfa)}). Voici la capture du paiement :`;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="card-surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Commande confirmée</p>
              <div className="mt-1 flex items-center gap-2">
                <h1 className="font-display text-3xl tracking-tight">{order.reference}</h1>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(order.reference);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="btn btn-outline !p-2"
                  aria-label="Copier la référence"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <span className={"rounded-full px-4 py-1.5 text-sm font-bold " + status.tone}>{status.label}</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</p>
              <p className="mt-1 font-semibold">{order.service}</p>
              <p className="text-sm text-muted-foreground">{categoryLabels[order.category]}</p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Montant</p>
              <p className="mt-1 font-display text-lg text-primary">{formatFcfa(order.amount_fcfa)}</p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paiement</p>
              <p className="mt-1 font-semibold">{channel?.label ?? order.payment_method}</p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="font-display text-xl">Instructions de paiement</h2>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed">
              <li>
                <strong>1.</strong> Envoie exactement{" "}
                <strong className="text-primary">{formatFcfa(order.amount_fcfa)}</strong> au{" "}
                <strong>{channel?.number ?? "numéro de la boutique"}</strong> via {channel?.label}.
              </li>
              <li>
                <strong>2.</strong> Garde la capture ou le reçu du paiement.
              </li>
              <li>
                <strong>3.</strong> Clique sur le bouton WhatsApp ci-dessous et envoie-nous la capture avec ta
                référence <strong>{order.reference}</strong>.
              </li>
              <li>
                <strong>4.</strong> Dès la confirmation, ton service est livré ici et sur WhatsApp.
              </li>
            </ol>

            <a
              href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-6 w-full"
            >
              <MessageCircle className="h-4 w-4" />
              Envoyer la preuve de paiement sur WhatsApp
            </a>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Garde cette page en favori : tu pourras suivre le statut de ta commande ici.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/catalogue" className="text-sm font-bold text-primary hover:underline">
            ← Commander autre chose
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
