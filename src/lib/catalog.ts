import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CatalogItem = Database["public"]["Tables"]["phone_numbers"]["Row"];

export const catalogQueryOptions = () =>
  queryOptions({
    queryKey: ["catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("phone_numbers")
        .select("*")
        .order("category")
        .order("price_fcfa");
      if (error) throw error;
      return data as CatalogItem[];
    },
  });
