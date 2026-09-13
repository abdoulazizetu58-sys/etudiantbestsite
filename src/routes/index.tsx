import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, MessageCircle, ShieldCheck, Wallet, Zap } from "lucide-react";
import heroImg from "@/assets/hero.png";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { CatalogCard } from "@/components/catalog-card";
import { catalogQueryOptions } from "@/lib/catalog";
import { site, whatsappUrl } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  component: IndexPage,
  head: () => ({
    meta: [
      {
        title: "NumExpress — Numéros virtuels & abonnements au Niger",
      },
      {
        name: "description",
        content:
          "Achète des numéros virtuels pour vérification WhatsApp, Telegram et plus, ainsi que des abonnements Netflix, Spotify… Paiement MyNita, MyAmana et mobile money au Niger.",
      },
      { property: "og:title", content: "NumExpress — Numéros virtuels & abonnements au Niger" },
      {
        property: "og:description",
        content:
          "Numéros virtuels pour vérification OTP et abonnements numériques, payables avec MyNita, MyAmana et mobile money.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  {
    icon: Zap,
    title: "1. Choisis ton service",
    text: "Parcours le catalogue et sélectionne le numéro virtuel ou l'abonnement dont tu as besoin.",
  },
  {
    icon: Wallet,
    title: "2. Paie facilement",
    text: "Règle ta commande par MyNita, MyAmana, Airtel Money ou Moov Money en quelques secondes.",
  },
  {
    icon: ShieldCheck,
    title: "3. Reçois ton service",
    text: "Confirme ton paiement sur WhatsApp et reçois ton numéro ou ton abonnement immédiatement.",
  },
];

function IndexPage() {
  const { data: catalog } = useSuspenseQuery(catalogQueryOptions());
  const preview = catalog.filter((i) => i.is_available).slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="section-eyebrow">Fait au Niger</span>
            <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Ton numéro virtuel et tes abonnements, en quelques minutes
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              Vérifie tes comptes WhatsApp, Telegram, TikTok et plus avec un numéro virtuel.
              Ou profite de tes abonnements préférés. Paie avec MyNita, MyAmana ou mobile money.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/catalogue" className="btn btn-primary">
                Voir le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappUrl("Bonjour, je veux plus d'informations sur vos services.")}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <MessageCircle className="h-4 w-4" />
                Poser une question
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-4xl bg-accent/30 blur-2xl" />
            <img
              src={heroImg}
              alt="Téléphone recevant un code de vérification SMS"
              width={1200}
              height={720}
              className="w-full rounded-3xl border shadow-lg"
            />
          </div>
        </section>

        {/* Bandeau paiement */}
        <section className="border-y bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm font-bold">
            <span className="text-muted-foreground">Paiement accepté :</span>
            {site.paymentChannels.map((c) => (
              <span key={c.key} className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                {c.label}
              </span>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-3xl tracking-tight">Comment ça marche</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="card-surface p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Catalogue preview */}
        <section className="border-t bg-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl tracking-tight">Services populaires</h2>
              <Link to="/catalogue" className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline md:flex">
                Tout voir
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((item) => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/catalogue" className="btn btn-dark">
                Tout voir
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
