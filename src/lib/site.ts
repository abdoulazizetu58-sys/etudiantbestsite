export const site = {
  brand: "NumExpress",
  tagline: "Numéros virtuels & abonnements au Niger",
  whatsapp: "22700000000", // TODO: remplacer par le vrai numéro WhatsApp de la boutique
  paymentChannels: [
    {
      key: "mynita",
      label: "MyNita",
      number: "+227 XX XX XX XX", // TODO: à confirmer
    },
    {
      key: "myamana",
      label: "MyAmana",
      number: "+227 XX XX XX XX", // TODO: à confirmer
    },
    {
      key: "airtel",
      label: "Airtel Money",
      number: "+227 XX XX XX XX", // TODO: à confirmer
    },
    {
      key: "moov",
      label: "Moov Money",
      number: "+227 XX XX XX XX", // TODO: à confirmer
    },
  ],
};

export function getPaymentChannel(key: string) {
  return site.paymentChannels.find((c) => c.key === key);
}

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export const statusLabels: Record<string, { label: string; tone: string }> = {
  en_attente: { label: "En attente de paiement", tone: "bg-accent text-accent-foreground" },
  payee: { label: "Payée", tone: "bg-secondary text-secondary-foreground" },
  livree: { label: "Livrée", tone: "bg-secondary text-secondary-foreground" },
  annulee: { label: "Annulée", tone: "bg-destructive text-destructive-foreground" },
};

export const categoryLabels: Record<string, string> = {
  numero: "Numéro virtuel",
  abonnement: "Abonnement",
};
