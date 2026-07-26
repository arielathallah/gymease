import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const SUPABASE_TABLES = [
    'activity_logs',
    'admins',
    'audit_logs',
    'banners',
    'booking_items',
    'bookings',
    'branches',
    'categories',
    'faq',
    'favorites',
    'gym_images',
    'gym_packages',
    'gyms',
    'notifications',
    'order_items',
    'orders',
    'payments',
    'product_images',
    'products',
    'promo_codes',
    'rental_sizes',
    'rentals',
    'reports',
    'reviews',
    'roles',
    'users'
] as const;

export interface SupabaseFilter {
    column: string;
    value: unknown;
    operator?: 'eq' | 'in' | 'like' | 'ilike' | 'gte' | 'lte';
}

export interface SupabaseQueryOptions {
    select?: string;
    filters?: SupabaseFilter[];
    orderBy?: {
        column: string;
        ascending?: boolean;
    };
    limit?: number;
}

function applyQueryFilters(query: any, filters: SupabaseFilter[] = []) {
    let nextQuery = query;
    filters.forEach((filter) => {
        const operator = filter.operator || 'eq';
        switch (operator) {
            case 'in':
                nextQuery = nextQuery.in(filter.column, filter.value);
                break;
            case 'like':
                nextQuery = nextQuery.like(filter.column, filter.value);
                break;
            case 'ilike':
                nextQuery = nextQuery.ilike(filter.column, filter.value);
                break;
            case 'gte':
                nextQuery = nextQuery.gte(filter.column, filter.value);
                break;
            case 'lte':
                nextQuery = nextQuery.lte(filter.column, filter.value);
                break;
            case 'eq':
            default:
                nextQuery = nextQuery.eq(filter.column, filter.value);
                break;
        }
    });
    return nextQuery;
}

export async function listSupabaseRows<T = Record<string, unknown>>(
    tableName: string,
    options: SupabaseQueryOptions = {},
    fallbackData: T[] = [] as T[]
): Promise<T[]> {
    if (!isSupabaseConfigured || !supabase) {
        return fallbackData;
    }

    try {
        let query: any = supabase.from(tableName).select(options.select || '*');
        query = applyQueryFilters(query, options.filters);

        if (options.orderBy) {
            query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []) as T[];
    } catch (error) {
        console.error(`Error listing rows from ${tableName}:`, error);
        return fallbackData;
    }
}

export async function getSupabaseRowById<T = Record<string, unknown>>(
    tableName: string,
    id: string,
    fallbackData: T | null = null
): Promise<T | null> {
    if (!isSupabaseConfigured || !supabase) {
        return fallbackData;
    }

    try {
        const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
        if (error) throw error;
        return (data as T) || null;
    } catch (error) {
        console.error(`Error fetching ${tableName} row ${id}:`, error);
        return fallbackData;
    }
}

export async function createSupabaseRow<T = Record<string, unknown>>(
    tableName: string,
    payload: Record<string, unknown>,
    fallbackData: T | null = null
): Promise<T | null> {
    if (!isSupabaseConfigured || !supabase) {
        return fallbackData;
    }

    try {
        const { data, error } = await supabase.from(tableName).insert(payload).select().single();
        if (error) throw error;
        return (data as T) || null;
    } catch (error) {
        console.error(`Error creating row in ${tableName}:`, error);
        return fallbackData;
    }
}

export async function updateSupabaseRow<T = Record<string, unknown>>(
    tableName: string,
    id: string,
    payload: Record<string, unknown>,
    fallbackData: T | null = null
): Promise<T | null> {
    if (!isSupabaseConfigured || !supabase) {
        return fallbackData;
    }

    try {
        const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single();
        if (error) throw error;
        return (data as T) || null;
    } catch (error) {
        console.error(`Error updating row ${id} in ${tableName}:`, error);
        return fallbackData;
    }
}

export async function deleteSupabaseRow(
    tableName: string,
    id: string,
    fallbackData = false
): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
        return fallbackData;
    }

    try {
        const { error } = await supabase.from(tableName).delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error(`Error deleting row ${id} from ${tableName}:`, error);
        return fallbackData;
    }
}

export async function upsertSupabaseRow<T = Record<string, unknown>>(
    tableName: string,
    payload: Record<string, unknown>,
    fallbackData: T | null = null
): Promise<T | null> {
    if (!isSupabaseConfigured || !supabase) {
        return fallbackData;
    }

    try {
        const { data, error } = await supabase.from(tableName).upsert(payload).select().single();
        if (error) throw error;
        return (data as T) || null;
    } catch (error) {
        console.error(`Error upserting row in ${tableName}:`, error);
        return fallbackData;
    }
}
