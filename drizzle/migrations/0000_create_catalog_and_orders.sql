CREATE TABLE public.phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'numero' CHECK (category IN ('numero', 'abonnement')),
  service TEXT NOT NULL,
  description TEXT,
  price_fcfa INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.phone_numbers TO anon, authenticated;
GRANT ALL ON public.phone_numbers TO service_role;

ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Catalogue lisible par tous"
  ON public.phone_numbers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  phone_number_id UUID REFERENCES public.phone_numbers(id),
  service TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'numero' CHECK (category IN ('numero', 'abonnement')),
  amount_fcfa INTEGER NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'payee', 'livree', 'annulee')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Commandes creatibles par tous"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);