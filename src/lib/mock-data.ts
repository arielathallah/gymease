import { Branch, PartnerGym, Package, RentalItem, Product, PromoCode, Review, Booking, DashboardStats } from '@/types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b001',
    name: 'GymEase Kemanggisan',
    code: 'KMG',
    address: 'Jl. Kemanggisan Utama No. 12, Palmerah',
    city: 'Jakarta Barat',
    province: 'DKI Jakarta',
    latitude: -6.1954,
    longitude: 106.7865,
    google_maps_url: 'https://maps.google.com/?q=-6.1954,106.7865',
    opening_hours: '06:00',
    closing_hours: '22:00',
    phone: '+62 812-3456-7890',
    email: 'kemanggisan@gymease.co.id',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Flagship powerlifting & functional fitness studio near BINUS University. Features luxury lockers, high-pressure hot showers, and full workout gear rental.',
    status: 'active',
  },
  {
    id: 'b002',
    name: 'GymEase Grogol',
    code: 'GGL',
    address: 'Jl. Dr. Susilo No. 45, Grogol Petamburan',
    city: 'Jakarta Barat',
    province: 'DKI Jakarta',
    latitude: -6.1624,
    longitude: 106.7884,
    google_maps_url: 'https://maps.google.com/?q=-6.1624,106.7884',
    opening_hours: '06:00',
    closing_hours: '23:00',
    phone: '+62 812-3456-7891',
    email: 'grogol@gymease.co.id',
    image_url: 'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Spacious multi-floor gym hub equipped with Olympic barbells, spin studio, and sauna facilities.',
    status: 'active',
  },
  {
    id: 'b003',
    name: 'GymEase BSD',
    code: 'BSD',
    address: 'BSD Green Office Park 6, BSD City',
    city: 'Tangerang Selatan',
    province: 'Banten',
    latitude: -6.3016,
    longitude: 106.6534,
    google_maps_url: 'https://maps.google.com/?q=-6.3016,106.6534',
    opening_hours: '05:30',
    closing_hours: '22:30',
    phone: '+62 812-3456-7892',
    email: 'bsd@gymease.co.id',
    image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Premium fitness studio featuring ice bath recovery, Technogym cardio suite, and complimentary micro-fiber towel service.',
    status: 'active',
  },
  {
    id: 'b004',
    name: 'GymEase Bekasi',
    code: 'BKS',
    address: 'Bekasi Cyber Park Fl. 2, Jl. KH. Noer Ali',
    city: 'Bekasi',
    province: 'Jawa Barat',
    latitude: -6.2415,
    longitude: 106.9924,
    google_maps_url: 'https://maps.google.com/?q=-6.2415,106.9924',
    opening_hours: '06:00',
    closing_hours: '22:00',
    phone: '+62 812-3456-7893',
    email: 'bekasi@gymease.co.id',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'High-energy gym space inside Bekasi Cyber Park with dedicated HIIT zones and heavy dumbbell racks up to 50kg.',
    status: 'active',
  },
  {
    id: 'b005',
    name: 'GymEase Tangerang',
    code: 'TNG',
    address: 'Tangcity Mall Podium 3, Cikokol',
    city: 'Tangerang',
    province: 'Banten',
    latitude: -6.1783,
    longitude: 106.6319,
    google_maps_url: 'https://maps.google.com/?q=-6.1783,106.6319',
    opening_hours: '06:00',
    closing_hours: '22:00',
    phone: '+62 812-3456-7894',
    email: 'tangerang@gymease.co.id',
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Convenient shopping mall gym location with instant rental clothes pickup and express laundry service.',
    status: 'active',
  },
  {
    id: 'b006',
    name: 'GymEase Depok',
    code: 'DPK',
    address: 'Jl. Margonda Raya No. 88, Beji',
    city: 'Depok',
    province: 'Jawa Barat',
    latitude: -6.3732,
    longitude: 106.8315,
    google_maps_url: 'https://maps.google.com/?q=-6.3732,106.8315',
    opening_hours: '06:00',
    closing_hours: '23:00',
    phone: '+62 812-3456-7895',
    email: 'depok@gymease.co.id',
    image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Vibrant student-friendly center near Universitas Indonesia featuring calisthenics rigs and fresh protein bar.',
    status: 'active',
  }
];

export const INITIAL_GYMS: PartnerGym[] = [
  {
    id: 'g001',
    branch_id: 'b001',
    branch_name: 'GymEase Kemanggisan',
    name: 'Titan Iron Gym Kemanggisan',
    slug: 'titan-iron-kemanggisan',
    description: 'Hardcore bodybuilders and powerlifters sanctuary equipped with certified Eleiko platforms, Hammer Strength ISO equipment, and luxury sauna.',
    main_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80'
    ],
    facilities: ['Locker Room', 'Shower', 'Sauna', 'Personal Trainer', 'WiFi', 'Parking', 'Steam Room'],
    rating: 4.9,
    total_reviews: 142,
    google_maps_url: 'https://maps.google.com/?q=-6.1954,106.7865',
    latitude: -6.1954,
    longitude: 106.7865,
    opening_hours: '06:00',
    closing_hours: '22:00',
    status: 'active',
  },
  {
    id: 'g002',
    branch_id: 'b002',
    branch_name: 'GymEase Grogol',
    name: 'Apex Fitness Hub Grogol',
    slug: 'apex-fitness-grogol',
    description: 'Modern 3-floor facility with dedicated spin cycle arena, pilates studio, and automated workout apparel rental lockers.',
    main_image: 'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80'
    ],
    facilities: ['Locker Room', 'Shower', 'WiFi', 'Spin Studio', 'Sauna', 'Protein Bar'],
    rating: 4.8,
    total_reviews: 98,
    google_maps_url: 'https://maps.google.com/?q=-6.1624,106.7884',
    latitude: -6.1624,
    longitude: 106.7884,
    opening_hours: '06:00',
    closing_hours: '23:00',
    status: 'active',
  },
  {
    id: 'g003',
    branch_id: 'b003',
    branch_name: 'GymEase BSD',
    name: 'Zenith Luxury Club BSD',
    slug: 'zenith-luxury-bsd',
    description: 'Ultra-modern boutique fitness retreat inside BSD GOP with ice bath plunges, bio-hacking tech, and valet parking.',
    main_image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
    ],
    facilities: ['Locker Room', 'Shower', 'Ice Bath', 'Personal Trainer', 'Valet Parking', 'WiFi', 'Laundry Service'],
    rating: 4.95,
    total_reviews: 215,
    google_maps_url: 'https://maps.google.com/?q=-6.3016,106.6534',
    latitude: -6.3016,
    longitude: 106.6534,
    opening_hours: '05:30',
    closing_hours: '22:30',
    status: 'active',
  },
  {
    id: 'g004',
    branch_id: 'b004',
    branch_name: 'GymEase Bekasi',
    name: 'Metro Strength Arena Bekasi',
    slug: 'metro-strength-bekasi',
    description: 'High performance training floor featuring functional turf track, rogue rigs, and cardio deck.',
    main_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80'
    ],
    facilities: ['Locker Room', 'Shower', 'Sprint Track', 'Parking', 'WiFi'],
    rating: 4.7,
    total_reviews: 86,
    google_maps_url: 'https://maps.google.com/?q=-6.2415,106.9924',
    latitude: -6.2415,
    longitude: 106.9924,
    opening_hours: '06:00',
    closing_hours: '22:00',
    status: 'active',
  },
  {
    id: 'g005',
    branch_id: 'b005',
    branch_name: 'GymEase Tangerang',
    name: 'Urban Athletic Club Tangerang',
    slug: 'urban-athletic-tangerang',
    description: 'Convenient mall location with luxury changing rooms, sanitized workout clothing rentals, and express locker checkin.',
    main_image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
    ],
    facilities: ['Locker Room', 'Shower', 'Mall Parking', 'WiFi', 'Sauna'],
    rating: 4.75,
    total_reviews: 110,
    google_maps_url: 'https://maps.google.com/?q=-6.1783,106.6319',
    latitude: -6.1783,
    longitude: 106.6319,
    opening_hours: '06:00',
    closing_hours: '22:00',
    status: 'active',
  },
  {
    id: 'g006',
    branch_id: 'b006',
    branch_name: 'GymEase Depok',
    name: 'Pulse Fitness Campus Depok',
    slug: 'pulse-fitness-depok',
    description: 'Energetic campus fitness center with indoor climbing wall, calisthenics rigs, and student discounts.',
    main_image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80'
    ],
    facilities: ['Locker Room', 'Shower', 'Climbing Wall', 'WiFi', 'Protein Bar'],
    rating: 4.85,
    total_reviews: 164,
    google_maps_url: 'https://maps.google.com/?q=-6.3732,106.8315',
    latitude: -6.3732,
    longitude: 106.8315,
    opening_hours: '06:00',
    closing_hours: '23:00',
    status: 'active',
  }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg1',
    name: 'Single Day Pass',
    description: 'Full day access to gym facilities, lockers, hot showers, and high-speed WiFi.',
    price: 50000,
    duration_days: 1,
    benefits: ['Full Equipment Access', 'Electronic Locker', 'Hot Shower Room', 'Free High-speed WiFi'],
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    is_popular: false,
  },
  {
    id: 'pkg2',
    name: 'All-Inclusive Day Pass + Rental Kit',
    description: 'The ultimate hands-free workout! Includes full day gym pass + fresh dry-fit clothes & towel rental.',
    price: 75000,
    duration_days: 1,
    benefits: ['Full Equipment Access', 'Fresh Dry-Fit Clothes (XS - XXL)', 'Microfiber Towel Rental', 'Sauna & Hot Shower', 'Electronic Locker'],
    image_url: 'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=600&q=80',
    is_popular: true,
  },
  {
    id: 'pkg3',
    name: 'VIP All-Branch Monthly Pass',
    description: '30 Days unlimited access to all 6 GymEase partner branches with complimentary towel service.',
    price: 450000,
    duration_days: 30,
    benefits: ['Access All 6 Branches Nationwide', 'Unlimited Towel Rental', '1 Personal Trainer Session', 'Ice Bath Plunge Access', 'Sauna Access'],
    image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    is_popular: false,
  }
];

export const RENTAL_CLOTHES_ITEM: RentalItem = {
  id: 'r_clothes',
  branch_id: 'all',
  type: 'clothes',
  name: 'GymEase Premium Dry-Fit Workout Apparel Set',
  description: 'Breathable, antibacterial quick-dry t-shirt and athletic shorts set. Sanitized and sealed in eco-pouch.',
  rental_price: 20000,
  total_stock: 120,
  sizes: [
    { size: 'XS', stock: 15 },
    { size: 'S', stock: 25 },
    { size: 'M', stock: 35 },
    { size: 'L', stock: 25 },
    { size: 'XL', stock: 15 },
    { size: 'XXL', stock: 5 },
  ],
  image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
};

export const RENTAL_TOWEL_ITEM: RentalItem = {
  id: 'r_towel',
  branch_id: 'all',
  type: 'towel',
  name: 'GymEase Ultra-Absorbent Microfiber Towel',
  description: 'Clean, soft, quick-drying microfiber towel sanitized at 90°C.',
  rental_price: 10000,
  total_stock: 150,
  image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    branch_id: 'b001',
    branch_name: 'GymEase Kemanggisan',
    category_name: 'Supplements',
    name: 'Optimum Nutrition Gold Standard Whey 2lbs',
    slug: 'on-gold-standard-whey-2lbs',
    description: '24g of high quality whey protein isolate per serving for rapid muscle recovery.',
    price: 580000,
    stock: 25,
    main_image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
  },
  {
    id: 'prod2',
    branch_id: 'b003',
    branch_name: 'GymEase BSD',
    category_name: 'Accessories',
    name: 'GymEase Ergonomic Shaker Bottle 700ml',
    slug: 'gymease-shaker-bottle',
    description: 'BPA-free leakproof protein shaker with stainless steel blending ball.',
    price: 85000,
    stock: 45,
    main_image: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
  {
    id: 'prod3',
    branch_id: 'b002',
    branch_name: 'GymEase Grogol',
    category_name: 'Gear',
    name: 'GymEase Heavy Duty Lifting Straps Pair',
    slug: 'gymease-lifting-straps',
    description: 'Padded cotton wrist straps for heavy deadlifts and row variations.',
    price: 65000,
    stock: 30,
    main_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev1',
    user_name: 'Budi Santoso',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    gym_name: 'Titan Iron Gym Kemanggisan',
    rating: 5,
    comment: 'Game changer! Modern gym, equipment super komplit, dan pilihan sewa baju gym langsung di tempat bikin ga perlu ribet bawa tas gede dari kantor.',
    created_at: '2026-07-20',
  },
  {
    id: 'rev2',
    user_name: 'Siti Rahmawati',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    gym_name: 'Zenith Luxury Club BSD',
    rating: 5,
    comment: 'Fasilitas ice bath dan handuknya bersih banget dan wangi. Booking lewat website langsung dapat QR Ticket, tinggal scan di kasir.',
    created_at: '2026-07-21',
  },
  {
    id: 'rev3',
    user_name: 'Reza Pratama',
    user_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    gym_name: 'Apex Fitness Hub Grogol',
    rating: 4,
    comment: 'Lokasi strategis dekat kampus, staf ramah, tempat bersih. Baju sewa ukuran L pas banget di badan.',
    created_at: '2026-07-22',
  }
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'GYMEASE20',
    discount_percentage: 20,
    discount_amount: 0,
    min_spend: 50000,
    max_discount: 25000,
  },
  {
    code: 'FITSTART',
    discount_percentage: 0,
    discount_amount: 15000,
    min_spend: 45000,
    max_discount: 15000,
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book1',
    booking_code: 'GE-KMG-982134',
    user_id: 'u1',
    user_name: 'Budi Santoso',
    user_email: 'budi@gmail.com',
    branch_id: 'b001',
    branch_name: 'GymEase Kemanggisan',
    gym_id: 'g001',
    gym_name: 'Titan Iron Gym Kemanggisan',
    package_id: 'pkg2',
    package_name: 'All-Inclusive Day Pass + Rental Kit',
    package_price: 75000,
    booking_date: '2026-07-25',
    booking_time: '17:00',
    rentals: {
      clothesSelected: true,
      clothesSize: 'L',
      clothesQty: 1,
      clothesPrice: 20000,
      towelSelected: true,
      towelQty: 1,
      towelPrice: 10000,
    },
    subtotal: 105000,
    tax_amount: 10500,
    discount_amount: 20000,
    grand_total: 95500,
    promo_code: 'GYMEASE20',
    status: 'confirmed',
    qr_code_url: 'GE-KMG-982134',
    created_at: '2026-07-22',
  },
  {
    id: 'book2',
    booking_code: 'GE-BSD-441290',
    user_id: 'u2',
    user_name: 'Siti Rahmawati',
    user_email: 'siti@gmail.com',
    branch_id: 'b003',
    branch_name: 'GymEase BSD',
    gym_id: 'g003',
    gym_name: 'Zenith Luxury Club BSD',
    package_id: 'pkg3',
    package_name: 'VIP All-Branch Monthly Pass',
    package_price: 450000,
    booking_date: '2026-07-26',
    booking_time: '08:00',
    rentals: {
      clothesSelected: false,
      clothesQty: 0,
      clothesPrice: 0,
      towelSelected: true,
      towelQty: 1,
      towelPrice: 10000,
    },
    subtotal: 460000,
    tax_amount: 46000,
    discount_amount: 25000,
    grand_total: 481000,
    promo_code: 'GYMEASE20',
    status: 'confirmed',
    qr_code_url: 'GE-BSD-441290',
    created_at: '2026-07-21',
  }
];

export const INITIAL_DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 48950000,
  totalBookings: 642,
  activeCustomers: 418,
  totalRentals: 915,
  revenueChart: [
    { month: 'Jan', revenue: 4200000, bookings: 54 },
    { month: 'Feb', revenue: 5800000, bookings: 76 },
    { month: 'Mar', revenue: 6900000, bookings: 92 },
    { month: 'Apr', revenue: 7400000, bookings: 98 },
    { month: 'May', revenue: 8600000, bookings: 114 },
    { month: 'Jun', revenue: 9900000, bookings: 130 },
    { month: 'Jul', revenue: 11200000, bookings: 148 },
  ],
  branchStats: [
    { branch_name: 'GymEase BSD', revenue: 14200000, bookings: 185 },
    { branch_name: 'GymEase Kemanggisan', revenue: 11800000, bookings: 152 },
    { branch_name: 'GymEase Grogol', revenue: 8900000, bookings: 118 },
    { branch_name: 'GymEase Bekasi', revenue: 5400000, bookings: 74 },
    { branch_name: 'GymEase Depok', revenue: 5100000, bookings: 68 },
    { branch_name: 'GymEase Tangerang', revenue: 3550000, bookings: 45 },
  ],
  topGyms: [
    { name: 'Zenith Luxury Club BSD', bookings: 185, revenue: 14200000 },
    { name: 'Titan Iron Gym Kemanggisan', bookings: 152, revenue: 11800000 },
    { name: 'Apex Fitness Hub Grogol', bookings: 118, revenue: 8900000 },
  ],
  topProducts: [
    { name: 'Optimum Nutrition Gold Standard Whey 2lbs', sales: 42, revenue: 24360000 },
    { name: 'GymEase Ergonomic Shaker Bottle', sales: 88, revenue: 7480000 },
    { name: 'GymEase Heavy Duty Lifting Straps', sales: 65, revenue: 4225000 },
  ],
};

export const FAQS = [
  {
    q: 'Apakah saya perlu membawa handuk atau baju olahraga sendiri?',
    a: 'Tidak perlu! GymEase menyediakan layanan sewa baju olahraga bermerek (ukuran XS hingga XXL) dan handuk higienis yang disterilisasi suhu 90°C. Anda bisa langsung olahraga sepulang kerja atau saat traveling.'
  },
  {
    q: 'Apakah bisa mengunjungi lokasi gym tanpa login?',
    a: 'Tentu saja! Pengunjung bebas menjelajahi daftar gym partner, mengecek fasilitas, lokasi di Google Maps, harga paket, produk, dan review tanpa perlu login.'
  },
  {
    q: 'Bagaimana cara check-in saat tiba di lokasi Gym Partner?',
    a: 'Setelah melakukan booking dan pembayaran, Anda akan menerima QR Booking Code di User Dashboard. Cukup tunjukkan QR Code tersebut di meja resepsionis gym partner untuk di-scan.'
  },
  {
    q: 'Bagaimana cara menentukan ukuran baju sewa?',
    a: 'Saat alur checkout booking, terdapat pilihan checkbox "Sewa Baju Gym". Jika dicentang, Anda dapat memilih ukuran XS, S, M, L, XL, atau XXL lengkap dengan stok realtime dan harga sewa.'
  },
  {
    q: 'Apakah Admin Cabang bisa melihat data dari cabang lain?',
    a: 'Tidak. GymEase menerapkan Row Level Security (RLS). Admin Cabang Kemanggisan hanya dapat melihat dan mengelola booking, order, serta rental untuk cabang Kemanggisan saja.'
  }
];
