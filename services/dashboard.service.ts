import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
    const { data, error } = await supabase
        .from("bookings")
        .select("grand_total, created_at, status");

    if (error) throw error;

    return data;
}