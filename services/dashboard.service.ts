import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {

    if (!supabase) {
        throw new Error("Supabase is not configured");
    }

    const { data, error } = await supabase
        .from("bookings")
        .select("grand_total, created_at, status");

    if (error) {
        throw error;
    }

    if (!supabase) {
        throw new Error("Supabase is not configured");
    }

    return data;
}