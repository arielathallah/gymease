import { Gym, Product, GymPackage, Review, FAQItem, Booking, Payment, Notification } from '../types';
import { INITIAL_GYMS, INITIAL_PRODUCTS, INITIAL_PACKAGES, INITIAL_REVIEWS, INITIAL_FAQS } from './mockData';

const isBrowser = typeof window !== 'undefined';

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Initial seeding
export function initLocalStorageDb() {
  if (!isBrowser) return;
  getStorageItem('gymease_gyms', INITIAL_GYMS);
  getStorageItem('gymease_products', INITIAL_PRODUCTS);
  getStorageItem('gymease_packages', INITIAL_PACKAGES);
  getStorageItem('gymease_reviews', INITIAL_REVIEWS);
  getStorageItem('gymease_faqs', INITIAL_FAQS);
  getStorageItem('gymease_bookings', [] as Booking[]);
  getStorageItem('gymease_payments', [] as Payment[]);
  getStorageItem('gymease_notifications', [
    {
      id: 'notif-welcome',
      user_id: 'user-current-id',
      title: 'Selamat datang di GymEase!',
      message: 'Sekarang Anda bisa memesan gym, menyewa baju olahraga, handuk, loker, dan laundry dalam satu transaksi mudah.',
      is_read: false,
      created_at: new Date().toISOString()
    }
  ] as Notification[]);
}

export const db = {
  gyms: {
    get: () => getStorageItem<Gym[]>('gymease_gyms', INITIAL_GYMS),
    set: (v: Gym[]) => setStorageItem('gymease_gyms', v)
  },
  products: {
    get: () => getStorageItem<Product[]>('gymease_products', INITIAL_PRODUCTS),
    set: (v: Product[]) => setStorageItem('gymease_products', v)
  },
  packages: {
    get: () => getStorageItem<GymPackage[]>('gymease_packages', INITIAL_PACKAGES),
    set: (v: GymPackage[]) => setStorageItem('gymease_packages', v)
  },
  reviews: {
    get: () => getStorageItem<Review[]>('gymease_reviews', INITIAL_REVIEWS),
    set: (v: Review[]) => setStorageItem('gymease_reviews', v)
  },
  faqs: {
    get: () => getStorageItem<FAQItem[]>('gymease_faqs', INITIAL_FAQS),
    set: (v: FAQItem[]) => setStorageItem('gymease_faqs', v)
  },
  bookings: {
    get: () => getStorageItem<Booking[]>('gymease_bookings', []),
    set: (v: Booking[]) => setStorageItem('gymease_bookings', v)
  },
  payments: {
    get: () => getStorageItem<Payment[]>('gymease_payments', []),
    set: (v: Payment[]) => setStorageItem('gymease_payments', v)
  },
  notifications: {
    get: () => getStorageItem<Notification[]>('gymease_notifications', []),
    set: (v: Notification[]) => setStorageItem('gymease_notifications', v)
  }
};
