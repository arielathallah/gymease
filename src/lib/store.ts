import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoleName, Branch, PartnerGym, Package, Product, Booking, Review, BookingRentalSelection } from '@/types';
import { INITIAL_BRANCHES, INITIAL_GYMS, INITIAL_PACKAGES, INITIAL_PRODUCTS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from './mock-data';

interface AppState {
  // Auth & Role
  currentRole: RoleName;
  currentUser: { id: string; name: string; email: string } | null;
  adminBranchId: string; // Branch ID scoped for branch_admin (e.g. 'b001' for Kemanggisan)
  setRole: (role: RoleName, branchId?: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Data Collections
  branches: Branch[];
  gyms: PartnerGym[];
  packages: Package[];
  products: Product[];
  bookings: Booking[];
  reviews: Review[];
  wishlistGymIds: string[];
  wishlistProductIds: string[];

  // Actions
  toggleWishlistGym: (gymId: string) => void;
  toggleWishlistProduct: (productId: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => Booking;
  addPartnerGym: (gymData: Omit<PartnerGym, 'id' | 'rating' | 'total_reviews'>) => void;
  addProduct: (productData: Omit<Product, 'id'>) => void;
  addPackage: (packageData: Omit<Package, 'id'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: 'guest',
      currentUser: { id: 'u1', name: 'Budi Santoso', email: 'budi.santoso@gmail.com' },
      adminBranchId: 'b001', // Default to Kemanggisan for Branch Admin
      setRole: (role, branchId) =>
        set((state) => ({
          currentRole: role,
          adminBranchId: branchId || state.adminBranchId,
        })),

      isDarkMode: true,
      toggleDarkMode: () =>
        set((state) => {
          const nextMode = !state.isDarkMode;
          if (typeof document !== 'undefined') {
            if (nextMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { isDarkMode: nextMode };
        }),

      branches: INITIAL_BRANCHES,
      gyms: INITIAL_GYMS,
      packages: INITIAL_PACKAGES,
      products: INITIAL_PRODUCTS,
      bookings: INITIAL_BOOKINGS,
      reviews: INITIAL_REVIEWS,
      wishlistGymIds: ['g001', 'g003'],
      wishlistProductIds: ['prod1'],

      toggleWishlistGym: (gymId) =>
        set((state) => ({
          wishlistGymIds: state.wishlistGymIds.includes(gymId)
            ? state.wishlistGymIds.filter((id) => id !== gymId)
            : [...state.wishlistGymIds, gymId],
        })),

      toggleWishlistProduct: (productId) =>
        set((state) => ({
          wishlistProductIds: state.wishlistProductIds.includes(productId)
            ? state.wishlistProductIds.filter((id) => id !== productId)
            : [...state.wishlistProductIds, productId],
        })),

      addBooking: (bookingData) => {
        const newId = `book_${Date.now()}`;
        const newBooking: Booking = {
          ...bookingData,
          id: newId,
          created_at: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));
        return newBooking;
      },

      addPartnerGym: (gymData) => {
        const newGym: PartnerGym = {
          ...gymData,
          id: `g_${Date.now()}`,
          rating: 5.0,
          total_reviews: 1,
        };
        set((state) => ({
          gyms: [newGym, ...state.gyms],
        }));
      },

      addProduct: (productData) => {
        const newProd: Product = {
          ...productData,
          id: `prod_${Date.now()}`,
        };
        set((state) => ({
          products: [newProd, ...state.products],
        }));
      },

      addPackage: (packageData) => {
        const newPkg: Package = {
          ...packageData,
          id: `pkg_${Date.now()}`,
        };
        set((state) => ({
          packages: [newPkg, ...state.packages],
        }));
      },

      updateBookingStatus: (bookingId, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        })),
    }),
    {
      name: 'gymease-storage-v1',
      partialize: (state) => ({
        currentRole: state.currentRole,
        adminBranchId: state.adminBranchId,
        isDarkMode: state.isDarkMode,
        wishlistGymIds: state.wishlistGymIds,
        wishlistProductIds: state.wishlistProductIds,
        bookings: state.bookings,
        gyms: state.gyms,
        products: state.products,
      }),
    }
  )
);
