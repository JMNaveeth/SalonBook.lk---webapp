-- SEED DATA FOR SALONBOOK LK

-- Passwords for seeded users are bcrypt hash of "Password123!"
-- $2a$10$wN9D/3fJ6uM/H729q/1eOOq9o6M5tN5eXf.tF83K.G0Z2tG8qZ9mG (or bcrypt salt)

INSERT INTO users (id, name, email, phone, password_hash, role, is_verified, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@salonbook.lk', '+94771234567', '$2a$10$e7K9yYfF6y9A0z.Z5oH.6u1S5y3mR7i0/W8N3V1J2.R4M5K6L7P8O', 'admin', true, true),
('22222222-2222-2222-2222-222222222222', 'Kasun Perera', 'owner.kasun@gmail.com', '+94772345678', '$2a$10$e7K9yYfF6y9A0z.Z5oH.6u1S5y3mR7i0/W8N3V1J2.R4M5K6L7P8O', 'owner', true, true),
('33333333-3333-3333-3333-333333333333', 'Dilhani Fernando', 'owner.dilhani@gmail.com', '+94773456789', '$2a$10$e7K9yYfF6y9A0z.Z5oH.6u1S5y3mR7i0/W8N3V1J2.R4M5K6L7P8O', 'owner', true, true),
('44444444-4444-4444-4444-444444444444', 'Nimal Silva', 'customer.nimal@gmail.com', '+94774567890', '$2a$10$e7K9yYfF6y9A0z.Z5oH.6u1S5y3mR7i0/W8N3V1J2.R4M5K6L7P8O', 'customer', true, true),
('55555555-5555-5555-5555-555555555555', 'Sarah Jayasinghe', 'customer.sarah@gmail.com', '+94775678901', '$2a$10$e7K9yYfF6y9A0z.Z5oH.6u1S5y3mR7i0/W8N3V1J2.R4M5K6L7P8O', 'customer', true, true);

INSERT INTO shops (id, owner_id, name, description, address, city, latitude, longitude, phone, email, cover_image_url, logo_url, status, is_featured, rating, total_reviews) VALUES
('aaaaaaa1-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Crown Barber Studio', 'Premier gents grooming & luxury hair styling salon in Colombo 03.', '45 Galle Road, Bambalapitiya', 'Colombo', 6.8923, 79.8547, '+94112345678', 'contact@crownbarber.lk', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=200', 'approved', true, 4.85, 24),
('aaaaaaa2-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Glamour Beauty & Bridal Lounge', 'Specialized bridal dressing, facial care, hair coloring and nail spa in Kandy.', '112 Peradeniya Road', 'Kandy', 7.2906, 80.6337, '+94812234567', 'info@glamourlounge.lk', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=200', 'approved', true, 4.90, 18),
('aaaaaaa3-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Velvet Hair & Spa', 'Modern unisex salon offering hair treatments, massages, and skin care.', '78 Main Street', 'Negombo', 7.2083, 79.8358, '+94312234567', 'velvet@salons.lk', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=200', 'approved', false, 4.60, 10);

INSERT INTO services (id, shop_id, name, description, price, duration_mins, category) VALUES
('s1111111-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'Executive Haircut & Beard Trim', 'Precision fade cut, warm towel finish, and beard styling.', 2500.00, 45, 'Haircut'),
('s1111112-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'Deep Cleanse Facial', 'Revitalizing skin facial with herbal steam.', 4000.00, 60, 'Facial'),
('s2222221-2222-2222-2222-222222222222', 'aaaaaaa2-2222-2222-2222-222222222222', 'Kandyan Bridal Dressing Package', 'Full bridal hair, makeup, drape, and pre-wedding consultation.', 45000.00, 180, 'Bridal'),
('s2222222-2222-2222-2222-222222222222', 'aaaaaaa2-2222-2222-2222-222222222222', 'Gel Manicure & Pedicure', 'Nail care, gel polish, and scrub treatment.', 6500.00, 75, 'Nails');

INSERT INTO staff (id, shop_id, name, specialization, avatar_url) VALUES
('st111111-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'Kamal Wickramasinghe', 'Senior Stylist & Fade Specialist', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'),
('st111112-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'Sunil Shantha', 'Beard Artisan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'),
('st222221-2222-2222-2222-222222222222', 'aaaaaaa2-2222-2222-2222-222222222222', 'Dilhani (Lead)', 'Master Bridal Stylist', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200');

INSERT INTO time_slots (id, shop_id, staff_id, slot_date, slot_time, is_booked) VALUES
('ts111111-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'st111111-1111-1111-1111-111111111111', CURRENT_DATE + INTERVAL '1 day', '09:00:00', false),
('ts111112-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'st111111-1111-1111-1111-111111111111', CURRENT_DATE + INTERVAL '1 day', '10:00:00', false),
('ts111113-1111-1111-1111-111111111111', 'aaaaaaa1-1111-1111-1111-111111111111', 'st111111-1111-1111-1111-111111111111', CURRENT_DATE + INTERVAL '1 day', '11:00:00', false),
('ts222221-2222-2222-2222-222222222222', 'aaaaaaa2-2222-2222-2222-222222222222', 'st222221-2222-2222-2222-222222222222', CURRENT_DATE + INTERVAL '1 day', '14:00:00', false);
