import { Gym, Product, GymPackage, Review, FAQItem } from '../types';

export const INITIAL_GYMS: Gym[] = [
  {
    id: 'gym-1',
    name: 'Elite Arena Sudirman',
    description: 'Sebuah gym premium yang berlokasi di jantung SCBD Sudirman, dirancang khusus untuk para profesional muda perkantoran. Fasilitas tingkat dunia, personal trainer bersertifikat internasional, dan suasana workout yang dinamis dan berenergi.',
    address: 'Capital Place, Lantai 5, Jl. Jend. Sudirman Kav. 18, Jakarta Selatan',
    latitude: -6.2235,
    longitude: 106.8166,
    operating_hours: '06:00 - 22:00',
    facilities: ['Kolam Renang', 'Sauna', 'WiFi Gratis', 'Locker Room', 'Shower Air Hangat', 'Cafe Sehat', 'Parkir VIP'],
    status: 'active',
    created_at: new Date().toISOString(),
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800'
    ]
  },
  {
    id: 'gym-2',
    name: 'Pulse Fitness Mega Kuningan',
    description: 'Pulse Fitness menyajikan konsep boutique gym premium dengan fokus pada fungsional training, yoga room terintegrasi, dan area kardio berteknologi tinggi. Sangat cocok untuk melepas penat setelah jam kerja berlalu.',
    address: 'Menara BTPN, Lantai Ground, Lingkar Mega Kuningan, Jakarta Selatan',
    latitude: -6.2241,
    longitude: 106.8315,
    operating_hours: '06:00 - 21:30',
    facilities: ['Studio Yoga', 'Locker Room', 'Juice Bar', 'Fungsional Training', 'Shower Air Hangat', 'Penyewaan Handuk'],
    status: 'active',
    created_at: new Date().toISOString(),
    gallery: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=800'
    ]
  },
  {
    id: 'gym-3',
    name: 'Apex Athletic Club Senopati',
    description: 'Klub atletik eksklusif yang memadukan kebugaran, gaya hidup, dan komunitas di kawasan premium Senopati. Menawarkan kelas-kelas olahraga intensitas tinggi (HIIT), angkat beban komprehensif, dan sauna terapeutik.',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    latitude: -6.2238,
    longitude: 106.8087,
    operating_hours: '06:00 - 22:00',
    facilities: ['Ruang HIIT Khusus', 'Sauna Inframerah', 'Protein Shake Station', 'Shower Air Hangat', 'Free Locker', 'Layanan Laundry'],
    status: 'active',
    created_at: new Date().toISOString(),
    gallery: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800'
    ]
  }
];

export const INITIAL_PACKAGES: GymPackage[] = [
  // Gym 1 Packages
  {
    id: 'pkg-1-daily',
    gym_id: 'gym-1',
    name: 'Daily Pass - Elite Sudirman',
    price: 150000,
    duration: 'daily',
    benefits: ['Akses Gym 1 Hari Penuh', 'Akses Semua Fasilitas Alat', 'Akses Kolam Renang & Sauna', 'Free WiFi', 'Loker & Shower'],
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-1-weekly',
    gym_id: 'gym-1',
    name: 'Weekly Pass - Elite Sudirman',
    price: 550000,
    duration: 'weekly',
    benefits: ['Akses Gym 7 Hari Berturut-turut', 'Akses Kolam Renang & Sauna', 'Akses Kelas Group Workout (2x)', 'Loker & Shower', 'Diskon 10% di Cafe Sehat'],
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-1-monthly',
    gym_id: 'gym-1',
    name: 'Monthly Membership - Elite Sudirman',
    price: 1200000,
    duration: 'monthly',
    benefits: ['Akses Gym Tanpa Batas (30 Hari)', 'Akses Kolam Renang, Sauna, & Jacuzzi', 'Bebas Mengikuti Semua Kelas Group', '1x Konsultasi Personal Trainer', 'Prioritas Booking Locker & Sportswear Rental', 'Diskon Layanan Laundry Partner'],
    created_at: new Date().toISOString()
  },
  // Gym 2 Packages
  {
    id: 'pkg-2-daily',
    gym_id: 'gym-2',
    name: 'Daily Pass - Pulse Kuningan',
    price: 120000,
    duration: 'daily',
    benefits: ['Akses Gym Harian', 'Akses Area Kardio & Fungsional', 'Loker & Shower Air Hangat', 'Free WiFi'],
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-2-monthly',
    gym_id: 'gym-2',
    name: 'Monthly Membership - Pulse Kuningan',
    price: 900000,
    duration: 'monthly',
    benefits: ['Akses Gym 30 Hari Tanpa Batas', 'Akses Studio Yoga & Pilates', 'Fungsional Area Training', 'Akses Loker & Shower Room', 'Free Handuk Setiap Kedatangan'],
    created_at: new Date().toISOString()
  },
  // Gym 3 Packages
  {
    id: 'pkg-3-daily',
    gym_id: 'gym-3',
    name: 'Daily Pass - Apex Senopati',
    price: 175000,
    duration: 'daily',
    benefits: ['Akses Klub Atletik Harian', 'Akses Ruang HIIT Spesialis', 'Akses Sauna Inframerah', 'Handuk & Loker Dingin', 'Free Shower amenities premium'],
    created_at: new Date().toISOString()
  },
  {
    id: 'pkg-3-monthly',
    gym_id: 'gym-3',
    name: 'Monthly Membership - Apex Senopati',
    price: 1500000,
    duration: 'monthly',
    benefits: ['Akses Premium 30 Hari Tanpa Batas', 'Akses Semua Fasilitas Olahraga & Kelas HIIT', 'Akses Sauna Inframerah & Jacuzzi Dingin', 'Bebas Minum Protein Shake 2x Seminggu', 'Gratis Layanan Laundry Handuk harian', 'Gratis Locker Pribadi selama keanggotaan'],
    created_at: new Date().toISOString()
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-shirt',
    name: 'Dry-Fit Sports Shirt',
    description: 'Kaos olahraga premium dengan serat dry-fit penyerap keringat optimal. Ringan, lentur, dan nyaman dipakai berlatih beban maupun kardio.',
    category: 'shirt',
    price: 35000,
    stock: 50,
    photo_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
    status: 'active',
    created_at: new Date().toISOString(),
    sizes: [
      { id: 'size-shirt-xs', product_id: 'prod-shirt', size: 'XS', stock: 5 },
      { id: 'size-shirt-s', product_id: 'prod-shirt', size: 'S', stock: 10 },
      { id: 'size-shirt-m', product_id: 'prod-shirt', size: 'M', stock: 15 },
      { id: 'size-shirt-l', product_id: 'prod-shirt', size: 'L', stock: 12 },
      { id: 'size-shirt-xl', product_id: 'prod-shirt', size: 'XL', stock: 6 },
      { id: 'size-shirt-xxl', product_id: 'prod-shirt', size: 'XXL', stock: 2 }
    ]
  },
  {
    id: 'prod-shorts',
    name: 'Flex Athletic Shorts',
    description: 'Celana pendek olahraga dengan bahan elastis yang memberikan keleluasaan bergerak secara maksimal. Dilengkapi tali pinggang dan saku ritsleting.',
    category: 'shorts',
    price: 30000,
    stock: 45,
    photo_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800',
    status: 'active',
    created_at: new Date().toISOString(),
    sizes: [
      { id: 'size-shorts-xs', product_id: 'prod-shorts', size: 'XS', stock: 4 },
      { id: 'size-shorts-s', product_id: 'prod-shorts', size: 'S', stock: 8 },
      { id: 'size-shorts-m', product_id: 'prod-shorts', size: 'M', stock: 15 },
      { id: 'size-shorts-l', product_id: 'prod-shorts', size: 'L', stock: 12 },
      { id: 'size-shorts-xl', product_id: 'prod-shorts', size: 'XL', stock: 4 },
      { id: 'size-shorts-xxl', product_id: 'prod-shorts', size: 'XXL', stock: 2 }
    ]
  },
  {
    id: 'prod-towel',
    name: 'Microfiber Gym Towel',
    description: 'Handuk microfiber tebal berdaya serap tinggi, higienis, anti-bakteri, dan lembut di kulit. Dicuci dan disterilkan secara profesional.',
    category: 'towel',
    price: 15000,
    stock: 120,
    photo_url: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=800',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-locker',
    name: 'Smart Locker Access',
    description: 'Akses loker pintar berkeamanan tinggi dengan teknologi kunci digital RFID / kode pin unik untuk menjaga keamanan barang bawaan berharga Anda.',
    category: 'locker',
    price: 25000,
    stock: 80,
    photo_url: 'https://images.unsplash.com/photo-1567113379515-6e85e7168ebb?q=80&w=800',
    status: 'active',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    user_id: 'user-id-1',
    gym_id: 'gym-1',
    rating: 5,
    comment: 'Luar biasa membantu! Saya tidak perlu repot membawa tas gym besar yang berisi baju kotor dan handuk basah ke kantor. Baju dan handuk GymEase wangi, bersih, dan pas ukurannya. Gym Elite Sudirman juga mantap!',
    created_at: new Date().toISOString(),
    user_name: 'Budi Santoso',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
  },
  {
    id: 'rev-2',
    user_id: 'user-id-2',
    gym_id: 'gym-1',
    rating: 4,
    comment: 'Sangat praktis untuk eksekutif yang sibuk. Gym-nya modern, kelas-kelasnya asik, dan rental kaosnya sangat wangi. Laundry service-nya juga cepat. Kurang satu bintang hanya karena jam 18:00 sangat ramai.',
    created_at: new Date().toISOString(),
    user_name: 'Siti Rahma',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
  },
  {
    id: 'rev-3',
    user_id: 'user-id-3',
    gym_id: 'gym-2',
    rating: 5,
    comment: 'Sangat suka dengan yoga studionya di Mega Kuningan. Ditambah paket GymEase yang meminjamkan baju & handuk, rasanya olahraga jadi mudah sekali dilakukan kapan saja tanpa persiapan.',
    created_at: new Date().toISOString(),
    user_name: 'Dewi Lestari',
    user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara kerja GymEase?',
    answer: 'Anda cukup memesan tiket masuk (Daily/Monthly) di gym mitra pilihan Anda via GymEase, lalu tambahkan opsi rental baju, celana, handuk, atau loker, serta layanan laundry baju olahraga kotor Anda. Semua diselesaikan dalam satu transaksi. Anda tinggal datang ke gym, tunjukkan kode QR pemesanan, dan peralatan olahraga Anda sudah siap di tempat!',
    order_num: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'faq-2',
    question: 'Apakah pakaian olahraga yang disewa higienis?',
    answer: 'Sangat higienis. Seluruh pakaian dan handuk dicuci menggunakan deterjen antiseptik premium dengan suhu tinggi, dikeringkan, dan disetrika uap panas untuk mensterilkan bakteri, kemudian dikemas secara rapat. Kebersihan adalah prioritas utama kami.',
    order_num: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'faq-3',
    question: 'Di mana saya mengambil pakaian sewaan?',
    answer: 'Anda bisa mengambilnya di meja resepsionis gym mitra saat melakukan Check-In menggunakan kode QR pemesanan Anda.',
    order_num: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara kerja layanan laundry tambahan?',
    answer: 'Jika Anda menambahkan layanan laundry, setelah Anda selesai berolahraga, Anda bisa memasukkan baju olahraga sewaan yang kotor ke dalam keranjang pengembalian khusus di resepsionis. Kami akan mencuci baju Anda dan menyimpannya kembali agar siap digunakan saat Anda berkunjung berikutnya.',
    order_num: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'faq-5',
    question: 'Apa metode pembayaran yang tersedia?',
    answer: 'Kami menerima pembayaran melalui QRIS, Transfer Bank Mandiri/BCA, serta E-Wallet (GoPay, OVO, ShopeePay, Dana). Setelah memesan, Anda mengunggah bukti transfer untuk dikonfirmasi admin secara instan.',
    order_num: 5,
    created_at: new Date().toISOString()
  }
];
