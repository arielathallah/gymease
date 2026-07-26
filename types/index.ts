export interface Profile {
  id: string;
  role: 'customer' | 'admin';
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface Gym {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  operating_hours: string;
  facilities: string[];
  status: 'active' | 'inactive';
  created_at: string;
  gallery?: string[];
}

export interface GymPackage {
  id: string;
  gym_id: string;
  name: string;
  price: number;
  duration: 'daily' | 'weekly' | 'monthly' | 'corporate';
  benefits: string[];
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'shirt' | 'shorts' | 'towel' | 'locker';
  price: number;
  stock: number;
  photo_url: string;
  status: 'active' | 'inactive';
  created_at: string;
  sizes?: ProductSize[];
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
}

export interface Booking {
  id: string;
  user_id: string;
  gym_id: string;
  package_id: string;
  booking_date: string;
  booking_time: string;
  laundry_option: boolean;
  subtotal: number;
  tax: number;
  grand_total: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'workout' | 'laundry' | 'completed' | 'cancelled';
  created_at: string;
  // Joins
  gym_name?: string;
  package_name?: string;
  user_name?: string;
  items?: BookingItem[];
  payment?: Payment;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  product_id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | null;
  quantity: number;
  price: number;
  product_name?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  payment_method: 'qris' | 'bank_transfer' | 'e_wallet';
  status: 'pending' | 'paid' | 'rejected' | 'refunded';
  payment_proof_url: string | null;
  amount: number;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  gym_id: string;
  rating: number;
  comment: string;
  created_at: string;
  // Joins
  user_name?: string;
  user_avatar?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_num: number;
  created_at: string;
}
