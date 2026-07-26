import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Booking, BookingItem, Payment } from '@/types';
import { db } from './db';
import { getGymById } from './gym';
import { listPackages } from './package';
import { listProducts } from './product';

export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'subtotal' | 'tax' | 'grand_total'>,
  items: Omit<BookingItem, 'id' | 'booking_id'>[],
  paymentMethod: 'qris' | 'bank_transfer' | 'e_wallet',
  paymentProofUrl: string | null = null
): Promise<Booking> {
  // 1. Calculate prices
  let subtotal = 0;
  
  // Package price
  const packages = await listPackages();
  const pkg = packages.find(p => p.id === bookingData.package_id);
  if (pkg) {
    subtotal += Number(pkg.price);
  }

  // Items price
  const products = await listProducts();
  const resolvedItems: Omit<BookingItem, 'id' | 'booking_id'>[] = [];
  for (const item of items) {
    const prod = products.find(p => p.id === item.product_id);
    if (prod) {
      const itemCost = Number(prod.price) * item.quantity;
      subtotal += itemCost;
      resolvedItems.push({
        ...item,
        price: Number(prod.price),
        product_name: prod.name
      });
    }
  }

  // Laundry price (optional, add fixed Rp 20,000 for service)
  if (bookingData.laundry_option) {
    subtotal += 20000;
  }

  const tax = Math.round(subtotal * 0.11); // 11% PPN
  const grandTotal = subtotal + tax;

  if (isSupabaseConfigured && supabase) {
    try {
      // Insert Booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: bookingData.user_id,
          gym_id: bookingData.gym_id,
          package_id: bookingData.package_id,
          booking_date: bookingData.booking_date,
          booking_time: bookingData.booking_time,
          laundry_option: bookingData.laundry_option,
          subtotal,
          tax,
          grand_total: grandTotal,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert Items
      if (resolvedItems.length > 0) {
        const itemInserts = resolvedItems.map(item => ({
          booking_id: booking.id,
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('booking_items')
          .insert(itemInserts);
        
        if (itemsError) throw itemsError;
      }

      // Insert Payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          payment_method: paymentMethod,
          status: 'pending',
          payment_proof_url: paymentProofUrl,
          amount: grandTotal
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      return {
        ...booking,
        items: resolvedItems.map((item, idx) => ({ ...item, id: `bi-${idx}`, booking_id: booking.id })),
        payment
      };
    } catch (err) {
      console.error('Error creating booking in Supabase:', err);
      return createBookingMock(bookingData, resolvedItems, paymentMethod, paymentProofUrl, subtotal, tax, grandTotal);
    }
  } else {
    return createBookingMock(bookingData, resolvedItems, paymentMethod, paymentProofUrl, subtotal, tax, grandTotal);
  }
}

async function createBookingMock(
  bookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'subtotal' | 'tax' | 'grand_total'>,
  items: Omit<BookingItem, 'id' | 'booking_id'>[],
  paymentMethod: 'qris' | 'bank_transfer' | 'e_wallet',
  paymentProofUrl: string | null,
  subtotal: number,
  tax: number,
  grandTotal: number
): Promise<Booking> {
  const bookings = db.bookings.get();
  const payments = db.payments.get();

  const newBookingId = `book-${Date.now()}`;
  const newPaymentId = `pay-${Date.now()}`;

  const gym = await getGymById(bookingData.gym_id);
  const packages = await listPackages();
  const pkg = packages.find(p => p.id === bookingData.package_id);

  const resolvedItems: BookingItem[] = items.map((item, idx) => ({
    ...item,
    id: `item-${newBookingId}-${idx}`,
    booking_id: newBookingId
  }));

  const newPayment: Payment = {
    id: newPaymentId,
    booking_id: newBookingId,
    payment_method: paymentMethod,
    status: 'pending',
    payment_proof_url: paymentProofUrl,
    amount: grandTotal,
    created_at: new Date().toISOString()
  };

  const newBooking: Booking = {
    ...bookingData,
    id: newBookingId,
    status: 'pending',
    subtotal,
    tax,
    grand_total: grandTotal,
    created_at: new Date().toISOString(),
    gym_name: gym?.name || 'Partner Gym',
    package_name: pkg?.name || 'Gym Package',
    items: resolvedItems,
    payment: newPayment
  };

  bookings.push(newBooking);
  payments.push(newPayment);

  db.bookings.set(bookings);
  db.payments.set(payments);

  // Trigger notification
  const notifications = db.notifications.get();
  notifications.push({
    id: `notif-${Date.now()}`,
    user_id: bookingData.user_id,
    title: 'Pemesanan Berhasil Dibuat',
    message: `Pemesanan Anda di ${gym?.name || 'Partner Gym'} menunggu verifikasi pembayaran sebesar Rp ${grandTotal.toLocaleString()}.`,
    is_read: false,
    created_at: new Date().toISOString()
  });
  db.notifications.set(notifications);

  return newBooking;
}

export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          gyms (name),
          gym_packages (name),
          booking_items (*, products (name)),
          payments (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((b: any) => ({
        ...b,
        gym_name: b.gyms?.name,
        package_name: b.gym_packages?.name,
        payment: b.payments?.[0] || null,
        items: b.booking_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name
        })) || []
      }));
    } catch (err) {
      console.error(`Error fetching bookings for user ${userId} from Supabase:`, err);
      return getBookingsByUserIdMock(userId);
    }
  } else {
    return getBookingsByUserIdMock(userId);
  }
}

async function getBookingsByUserIdMock(userId: string): Promise<Booking[]> {
  const bookings = db.bookings.get();
  const userBookings = bookings.filter(b => b.user_id === userId);
  
  // Resolve payments and items
  const payments = db.payments.get();
  const allGyms = await getGymById(''); // Just trigger local storage load
  const gyms = db.gyms.get();
  const packages = db.packages.get();

  return userBookings.map(b => {
    const gym = gyms.find(g => g.id === b.gym_id);
    const pkg = packages.find(p => p.id === b.package_id);
    const payment = payments.find(p => p.booking_id === b.id) || undefined;
    return {
      ...b,
      gym_name: gym?.name || 'Partner Gym',
      package_name: pkg?.name || 'Gym Package',
      payment
    };
  }).reverse(); // Sort descending by creation
}

export async function getAllBookings(): Promise<Booking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles (full_name),
          gyms (name),
          gym_packages (name),
          booking_items (*, products (name)),
          payments (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((b: any) => ({
        ...b,
        user_name: b.profiles?.full_name,
        gym_name: b.gyms?.name,
        package_name: b.gym_packages?.name,
        payment: b.payments?.[0] || null,
        items: b.booking_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name
        })) || []
      }));
    } catch (err) {
      console.error('Error fetching all bookings from Supabase:', err);
      return getAllBookingsMock();
    }
  } else {
    return getAllBookingsMock();
  }
}

async function getAllBookingsMock(): Promise<Booking[]> {
  const bookings = db.bookings.get();
  const payments = db.payments.get();
  const gyms = db.gyms.get();
  const packages = db.packages.get();

  return bookings.map(b => {
    const gym = gyms.find(g => g.id === b.gym_id);
    const pkg = packages.find(p => p.id === b.package_id);
    const payment = payments.find(p => p.booking_id === b.id) || undefined;
    return {
      ...b,
      gym_name: gym?.name || 'Partner Gym',
      package_name: pkg?.name || 'Gym Package',
      user_name: b.user_id === 'customer-1' ? 'Budi Santoso' : b.user_id === 'customer-2' ? 'Siti Rahma' : 'Dewi Lestari',
      payment
    };
  }).reverse();
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          gyms (name, address, operating_hours),
          gym_packages (name),
          booking_items (*, products (name, photo_url)),
          payments (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        gym_name: data.gyms?.name,
        package_name: data.gym_packages?.name,
        payment: data.payments?.[0] || null,
        items: data.booking_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name
        })) || []
      };
    } catch (err) {
      console.error(`Error fetching booking ${id}:`, err);
      return getBookingByIdMock(id);
    }
  } else {
    return getBookingByIdMock(id);
  }
}

async function getBookingByIdMock(id: string): Promise<Booking | null> {
  const bookings = db.bookings.get();
  const booking = bookings.find(b => b.id === id);
  if (!booking) return null;

  const gyms = db.gyms.get();
  const packages = db.packages.get();
  const payments = db.payments.get();

  const gym = gyms.find(g => g.id === booking.gym_id);
  const pkg = packages.find(p => p.id === booking.package_id);
  const payment = payments.find(p => p.booking_id === booking.id) || null;

  return {
    ...booking,
    gym_name: gym?.name || 'Partner Gym',
    package_name: pkg?.name || 'Gym Package',
    payment: payment || undefined
  };
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error updating booking ${id} status:`, err);
      return updateBookingStatusMock(id, status);
    }
  } else {
    return updateBookingStatusMock(id, status);
  }
}

function updateBookingStatusMock(id: string, status: Booking['status']): boolean {
  const bookings = db.bookings.get();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;

  bookings[idx].status = status;
  db.bookings.set(bookings);

  // Send a notification to the customer about their status update
  const notifications = db.notifications.get();
  let msg = `Status pemesanan Anda telah diperbarui menjadi: ${status.toUpperCase()}.`;
  if (status === 'confirmed') {
    msg = `Pemesanan Anda telah dikonfirmasi oleh Admin! Tunjukkan kode booking ${id} saat tiba di gym.`;
  } else if (status === 'checked_in') {
    msg = `Anda telah check-in! Silakan ambil pakaian sewaan dan kunci loker di resepsionis. Selamat berolahraga!`;
  } else if (status === 'laundry') {
    msg = `Pakaian sewaan Anda telah diserahkan kembali untuk proses laundry. Terima kasih telah menggunakan GymEase!`;
  } else if (status === 'completed') {
    msg = `Olahraga selesai! Terima kasih telah berkunjung. Silakan tinggalkan ulasan Anda untuk meningkatkan layanan kami.`;
  }

  notifications.push({
    id: `notif-${Date.now()}`,
    user_id: bookings[idx].user_id,
    title: 'Update Pemesanan',
    message: msg,
    is_read: false,
    created_at: new Date().toISOString()
  });
  db.notifications.set(notifications);

  return true;
}

export async function updatePaymentStatus(
  id: string,
  status: Payment['status']
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // If payment is marked paid, automatically confirm booking
      if (status === 'paid') {
        const { data: payment } = await supabase
          .from('payments')
          .select('booking_id')
          .eq('id', id)
          .single();
        if (payment) {
          await updateBookingStatus(payment.booking_id, 'confirmed');
        }
      }

      return true;
    } catch (err) {
      console.error(`Error updating payment ${id} status:`, err);
      return updatePaymentStatusMock(id, status);
    }
  } else {
    return updatePaymentStatusMock(id, status);
  }
}

function updatePaymentStatusMock(id: string, status: Payment['status']): boolean {
  const payments = db.payments.get();
  const idx = payments.findIndex(p => p.id === id);
  if (idx === -1) return false;

  payments[idx].status = status;
  db.payments.set(payments);

  if (status === 'paid') {
    updateBookingStatusMock(payments[idx].booking_id, 'confirmed');
  } else if (status === 'rejected') {
    updateBookingStatusMock(payments[idx].booking_id, 'cancelled');
  }

  return true;
}

export async function submitPaymentProof(
  bookingId: string,
  fileOrUrl: File | string
): Promise<boolean> {
  let proofUrl = '';
  
  if (typeof fileOrUrl !== 'string') {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = fileOrUrl.name.split('.').pop();
        const fileName = `${bookingId}_proof.${fileExt}`;
        const filePath = `payments/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, fileOrUrl, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);

        proofUrl = data.publicUrl;
      } catch (err) {
        console.error('Error uploading payment proof file:', err);
        proofUrl = URL.createObjectURL(fileOrUrl);
      }
    } else {
      proofUrl = URL.createObjectURL(fileOrUrl);
    }
  } else {
    proofUrl = fileOrUrl;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ payment_proof_url: proofUrl, status: 'pending' })
        .eq('booking_id', bookingId);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating payment proof in Supabase:', err);
      return submitPaymentProofMock(bookingId, proofUrl);
    }
  } else {
    return submitPaymentProofMock(bookingId, proofUrl);
  }
}

function submitPaymentProofMock(bookingId: string, proofUrl: string): boolean {
  const payments = db.payments.get();
  const idx = payments.findIndex(p => p.booking_id === bookingId);
  if (idx === -1) return false;

  payments[idx].payment_proof_url = proofUrl;
  payments[idx].status = 'pending'; // Reset status to pending so admin sees it for review
  db.payments.set(payments);
  return true;
}
