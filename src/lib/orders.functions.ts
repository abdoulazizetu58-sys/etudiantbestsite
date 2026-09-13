import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getOrderByReference = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ reference: z.string().min(3) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("reference", data.reference.trim().toUpperCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order;
  });
