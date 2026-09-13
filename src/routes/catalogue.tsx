import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { CatalogCard } from "@/components/catalog-card";
import { catalogQueryOptions } from "@/lib/catalog";

export const Route = createFileRoute("/catalogue")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  component: CataloguePage,
  head: () => ({
    meta: [
      { title: "Catalogue — Numéros virtuels & abonnements | NumExpress" },
      {
        name: "description",
        content:
          "Tous nos numéros virtuels (WhatsApp, Telegram, TikTok…) et abonnements (Netflix, Spotify, ChatGPT Plus…) avec leurs prix en FCFA.",
      },
      { property: "og:title", content: "Catalogue — Numéros virtuels & abonnements | NumExpress" },
      {
        property: "og:description",
        content: "Numéros virtuels et abonnements numériques au meilleur prix, en FCFA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/catalogue" }],
  }),
});

const tabs = [
  { key: "numero", label: "Numéros virtuels (OTP)" },
  { key: "abonnement", label: "Abonnements" },
] as const;

function CataloguePage() {
  const { data: catalog } = useSuspenseQuery(catalogQueryOptions());
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("numero");

  const items = catalog.filter((i) => i.category === tab);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">Catalogue</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Choisis ton service, paie par MyNita, MyAmana ou mobile money, et reçois-le rapidement.
        </p>

        <div className="mt-8 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "btn text-sm " +
                (tab === t.key ? "btn-primary" : "btn-outline")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CatalogCard key={item.id} item={item} />
          ))}
        </div>
        {items.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">Aucun service dans cette catégorie pour le moment.</p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
