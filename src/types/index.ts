export type RoleName = 'guest' | 'user' | 'branch_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role_name: RoleName;
  is_verified?: boolean;
  branch_id?: string; // For Branch Admins
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string; // e.g. KMG, GGL, BSD, BKS, TNG, DPK
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  google_maps_url: string;
  opening_hours: string; // "06:00"
  closing_hours: string; // "22:00"
  phone: string;
  email: string;
  image_url: string;
  gallery?: string[];
  description: string;
  status: 'active' | 'inactive';
}

export interface PartnerGym {
  id: string;
  branch_id: string;
  branch_name?: string;
  name: string;
  slug: string;
  description: string;
  main_image: string;
  gallery: string[];
  facilities: string[]; // ['Locker Room', 'Shower', 'Sauna', 'WiFi', 'Ice Bath', 'Personal Trainer']
  rating: number;
  total_reviews: number;
  google_maps_url: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  closing_hours: string;
  status: 'active' | 'inactive';
}

export interface Package {
  id: string;
  branch_id?: string;
  gym_id?: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  benefits: string[];
  image_url: string;
  is_popular?: boolean;
}

export type ClothesSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface RentalItem {
  id: string;
  branch_id: string;
  type: 'clothes' | 'towel';
  name: string;
  description: string;
  rental_price: number;
  sizes?: { size: ClothesSize; stock: number }[];
  total_stock: number;
  image_url: string;
}

export interface Product {
  id: string;
  branch_id: string;
  branch_name?: string;
  category_id?: string;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  main_image: string;
  gallery?: string[];
  rating: number;
}

export interface BookingRentalSelection {
  clothesSelected: boolean;
  clothesSize?: ClothesSize;
  clothesQty: number;
  clothesPrice: number;
  towelSelected: boolean;
  towelQty: number;
  towelPrice: number;
}

export interface Booking {
  id: string;
  booking_code: string;
  user_id: string;
  user_name: string;
  user_email: string;
  branch_id: string;
  branch_name: string;
  gym_id: string;
  gym_name: string;
  package_id: string;
  package_name: string;
  package_price: number;
  branch_id: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:mm
  rentals: BookingRentalSelection;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  grand_total: number;
  promo_code?: string;
  status: 'confirmed' | 'checked_in' | 'pending' | 'cancelled';
  qr_code_url?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  branch_id: string;
  branch_name: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
  total_amount: number;
  status: 'paid' | 'pending' | 'delivered';
  created_at: string;
}

export interface Review {
  id: string;
  user_name: string;
  user_avatar?: string;
  gym_id?: string;
  gym_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface PromoCode {
  code: string;
  discount_percentage: number;
  discount_amount: number;
  min_spend: number;
  max_discount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeCustomers: number;
  totalRentals: number;
  revenueChart: { month: string; revenue: number; bookings: number }[];
  branchStats: { branch_name: string; revenue: number; bookings: number }[];
  topGyms: { name: string; bookings: number; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
}
