-- GymEase Seed Data for Supabase
-- Target Branches: Kemanggisan, Grogol, BSD, Bekasi, Tangerang, Depok

-- 1. SEED BRANCHES (Prefix 'b' is valid)
INSERT INTO
    branches (
        id,
        name,
        code,
        address,
        city,
        province,
        latitude,
        longitude,
        google_maps_url,
        opening_hours,
        closing_hours,
        phone,
        email,
        image_url,
        description,
        status
    )
VALUES (
        'b0000000-0000-0000-0000-000000000001',
        'GymEase Kemanggisan',
        'KMG',
        'Jl. Kemanggisan Utama No. 12, Palmerah',
        'Jakarta Barat',
        'DKI Jakarta',
        -6.1954,
        106.7865,
        'https://maps.google.com/?q=-6.1954,106.7865',
        '06:00',
        '22:00',
        '+62 812-3456-7890',
        'kemanggisan@gymease.co.id',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
        'Modern flagship gym near BINUS University with powerlifting platforms and sauna.',
        'active'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'GymEase Grogol',
        'GGL',
        'Jl. Dr. Susilo No. 45, Grogol Petamburan',
        'Jakarta Barat',
        'DKI Jakarta',
        -6.1624,
        106.7884,
        'https://maps.google.com/?q=-6.1624,106.7884',
        '06:00',
        '23:00',
        '+62 812-3456-7891',
        'grogol@gymease.co.id',
        'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1200&q=80',
        'Spacious multi-floor gym hub equipped with Olympic barbells and functional training arena.',
        'active'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'GymEase BSD',
        'BSD',
        'BSD Green Office Park 6, BSD City',
        'Tangerang Selatan',
        'Banten',
        -6.3016,
        106.6534,
        'https://maps.google.com/?q=-6.3016,106.6534',
        '05:30',
        '22:30',
        '+62 812-3456-7892',
        'bsd@gymease.co.id',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
        'Premium fitness studio featuring ice baths, Technogym cardio machines and towel service.',
        'active'
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'GymEase Bekasi',
        'BKS',
        'Bekasi Cyber Park Fl. 2, Jl. KH. Noer Ali',
        'Bekasi',
        'Jawa Barat',
        -6.2415,
        106.9924,
        'https://maps.google.com/?q=-6.2415,106.9924',
        '06:00',
        '22:00',
        '+62 812-3456-7893',
        'bekasi@gymease.co.id',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
        'High-energy fitness center with dedicated Crossfit zone and spin classes.',
        'active'
    ),
    (
        'b0000000-0000-0000-0000-000000000005',
        'GymEase Tangerang',
        'TNG',
        'Tangcity Mall Podium 3, Cikokol',
        'Tangerang',
        'Banten',
        -6.1783,
        106.6319,
        'https://maps.google.com/?q=-6.1783,106.6319',
        '06:00',
        '22:00',
        '+62 812-3456-7894',
        'tangerang@gymease.co.id',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
        'Convenient mall location with luxury changing rooms and complete workout kit rental.',
        'active'
    ),
    (
        'b0000000-0000-0000-0000-000000000006',
        'GymEase Depok',
        'DPK',
        'Jl. Margonda Raya No. 88, Beji',
        'Depok',
        'Jawa Barat',
        -6.3732,
        106.8315,
        'https://maps.google.com/?q=-6.3732,106.8315',
        '06:00',
        '23:00',
        '+62 812-3456-7895',
        'depok@gymease.co.id',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
        'Student-friendly modern gym near UI with calisthenics area and fresh protein smoothies.',
        'active'
    ) ON CONFLICT (code) DO NOTHING;

-- 2. SEED PARTNER GYMS (Changed 'g' prefix to 'c')
INSERT INTO partner_gyms (id, branch_id, name, slug, description, main_image, facilities, rating, total_reviews, google_maps_url, latitude, longitude, opening_hours, closing_hours) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Titan Iron Gym Kemanggisan', 'titan-iron-kemanggisan', 'Hardcore powerlifting & bodybuilding sanctuary equipped with Hammer Strength equipment.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', ARRAY['Locker Room', 'Shower', 'Personal Trainer', 'Sauna', 'WiFi'], 4.9, 142, 'https://maps.google.com/?q=-6.1954,106.7865', -6.1954, 106.7865, '06:00', '22:00'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Apex Fitness Hub Grogol', 'apex-fitness-grogol', 'Multi-floor modern fitness hub with spin classes, pilates studio and protein bar.', 'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=1200&q=80', ARRAY['Locker Room', 'Shower', 'WiFi', 'Spin Studio', 'Sauna'], 4.8, 98, 'https://maps.google.com/?q=-6.1624,106.7884', -6.1624, 106.7884, '06:00', '23:00'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Zenith Luxury Club BSD', 'zenith-luxury-bsd', 'Boutique eco-luxury gym with ice bath recovery, state-of-the-art bio-hacking tech.', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80', ARRAY['Locker Room', 'Shower', 'Ice Bath', 'Personal Trainer', 'Valet Parking', 'WiFi'], 4.95, 215, 'https://maps.google.com/?q=-6.3016,106.6534', -6.3016, 106.6534, '05:30', '22:30'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'Metro Strength Bekasi', 'metro-strength-bekasi', 'Massive 1500sqm gym arena with indoor sprint track and heavy-duty squat racks.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80', ARRAY['Locker Room', 'Shower', 'Sprint Track', 'Parking', 'WiFi'], 4.7, 86, 'https://maps.google.com/?q=-6.2415,106.9924', -6.2415, 106.9924, '06:00', '22:00')
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PACKAGES (Changed 'p' prefix to 'd')
INSERT INTO packages (id, branch_id, name, description, price, duration_days, benefits, image_url, is_popular) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Single Gym Pass', '1 Day full access to gym facilities & locker room', 50000, 1, ARRAY['Full Equipment Access', 'Free Locker Access', 'Shower Room Access'], 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80', false),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'All-Inclusive Day Pass', '1 Day access including rental clothes & towel rental', 75000, 1, ARRAY['Full Equipment Access', 'Rental Clothes (Any Size)', 'Microfiber Towel Rental', 'Free Locker & Sauna'], 'https://images.unsplash.com/photo-1576678927484-cc909957088c?auto=format&fit=crop&w=600&q=80', true),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Monthly Unlimited Flex', '30 Days unlimited access to all GymEase nationwide branches', 450000, 30, ARRAY['Nationwide Branch Access', 'Complimentary Towels', '1 PT Consultation', 'Sauna & Ice Bath'], 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80', false);

-- 4. SEED PROMO CODES
INSERT INTO
    promo_codes (
        code,
        discount_percentage,
        discount_amount,
        min_spend,
        max_discount,
        is_active
    )
VALUES (
        'GYMEASE20',
        20,
        0,
        50000,
        25000,
        true
    ),
    (
        'FITSTART',
        0,
        15000,
        45000,
        15000,
        true
    );

-- 5. SEED BANNERS
INSERT INTO
    banners (
        title,
        subtitle,
        image_url,
        target_url
    )
VALUES (
        'Workout Without Bringing Anything!',
        'Rent fresh apparel & ultra-absorbent towels directly at checkout.',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
        '/search'
    ),
    (
        'Special 20% OFF First Booking',
        'Use promo code GYMEASE20 during checkout today!',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
        '/booking'
    );