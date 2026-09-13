import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe } from "lucide-react";
import { categoryLabels, formatFcfa } from "@/lib/site";
import type { CatalogItem } from "@/lib/catalog";

export function CatalogCard({ item }: { item: CatalogItem }) {
  const outOfStock = item.stock !== null && item.stock <= 0;
  const available = item.is_available && !outOfStock;

  return (
    <div className="card-surface flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {categoryLabels[item.category]}
          </p>
          <h3 className="mt-1 font-display text-lg leading-tight">{item.service}</h3>
        </div>
        {available ? (
          <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary">
            Disponible
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
            {outOfStock ? "Épuisé" : "Rupture"}
          </span>
        )}
      </div>
      {item.description && (
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {item.category === "numero" && (
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            <Globe className="h-3 w-3" />
            Tous les pays
          </span>
        )}
        {lowStock && (
          <span className="rounded-full bg-accent/40 px-2.5 py-1 text-xs font-bold text-foreground">
            Plus que {item.stock} pièce{item.stock === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-xl text-primary">{formatFcfa(item.price_fcfa)}</p>
        <Link
          to="/commander"
          search={{ id: item.id }}
          className={
            "btn text-sm " + (available ? "btn-primary" : "btn-outline pointer-events-none opacity-50")
          }
        >
          Acheter
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
