import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categoryLabels, formatFcfa } from "@/lib/site";
import type { CatalogItem } from "@/lib/catalog";

export function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <div className="card-surface flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {categoryLabels[item.category]}
          </p>
          <h3 className="mt-1 font-display text-lg leading-tight">{item.service}</h3>
        </div>
        {item.is_available ? (
          <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary">
            Disponible
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
            Rupture
          </span>
        )}
      </div>
      {item.description && (
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <p className="font-display text-xl text-primary">{formatFcfa(item.price_fcfa)}</p>
        <Link
          to="/commander"
          search={{ id: item.id }}
          className={
            "btn text-sm " + (item.is_available ? "btn-primary" : "btn-outline pointer-events-none opacity-50")
          }
        >
          Acheter
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
