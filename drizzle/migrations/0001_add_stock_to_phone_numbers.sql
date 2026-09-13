ALTER TABLE public.phone_numbers ADD COLUMN stock integer;

CREATE OR REPLACE FUNCTION public.decrement_phone_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.phone_numbers
  SET stock = stock - 1
  WHERE id = NEW.phone_number_id
    AND stock IS NOT NULL
    AND stock > 0;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_decrement_stock
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.decrement_phone_stock();