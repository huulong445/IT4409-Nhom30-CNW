-- =============================================================================
-- SAMPLE DATA: HOSPITAL MANAGEMENT SYSTEM (HMS) - khớp với hospital_schema.sql (15 bảng)
-- Target DB: MySQL 8.0+ / MariaDB 10.5+
-- Chạy SAU khi đã chạy file schema (tạo hospital_db và các bảng).
-- Mật khẩu mẫu của MỌI tài khoản: Hms@12345 (đã băm bcrypt)
-- "Hôm nay" của dữ liệu mẫu = 2026-10-19 (thứ Hai).
-- Script có thể chạy lại nhiều lần (TRUNCATE trước khi insert).
-- =============================================================================

USE hospital_db;
SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE staff_shifts;
TRUNCATE TABLE shifts;
TRUNCATE TABLE lab_results;
TRUNCATE TABLE lab_requests;
TRUNCATE TABLE prescription_details;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE medicine;
TRUNCATE TABLE medical_records;
TRUNCATE TABLE appointments;
TRUNCATE TABLE staff;
TRUNCATE TABLE rooms;
TRUNCATE TABLE building;
TRUNCATE TABLE patients;
TRUNCATE TABLE departments;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. USERS (21): 1 admin | 6 bác sĩ | 2 tiếp tân | 2 KTV lab | 10 bệnh nhân
-- user_id 1-11 tương ứng staff_id 1-11
-- -----------------------------------------------------------------------------
INSERT INTO users (user_id, username, password_hash, email, phone, role, is_active, created_at) VALUES
(1,  'admin',         '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'admin@hospital.vn',        '0900000001', 'ADMIN',        TRUE, '2026-01-05 08:00:00'),
(2,  'bs.tung',       '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'tung.nt@hospital.vn',      '0900000002', 'DOCTOR',       TRUE, '2026-01-05 08:10:00'),
(3,  'bs.hoa',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'hoa.lt@hospital.vn',       '0900000003', 'DOCTOR',       TRUE, '2026-01-05 08:10:00'),
(4,  'bs.binh',       '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'binh.tq@hospital.vn',      '0900000004', 'DOCTOR',       TRUE, '2026-01-05 08:10:00'),
(5,  'bs.lan',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'lan.pt@hospital.vn',       '0900000005', 'DOCTOR',       TRUE, '2026-01-05 08:10:00'),
(6,  'bs.chau',       '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'chau.vm@hospital.vn',      '0900000006', 'DOCTOR',       TRUE, '2026-01-05 08:10:00'),
(7,  'bs.hai',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'hai.dc@hospital.vn',       '0900000007', 'DOCTOR',       TRUE, '2026-01-05 08:10:00'),
(8,  'tieptan.thu',   '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'thu.nt@hospital.vn',       '0900000008', 'RECEPTIONIST', TRUE, '2026-01-06 08:00:00'),
(9,  'tieptan.son',   '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'son.lv@hospital.vn',       '0900000009', 'RECEPTIONIST', TRUE, '2026-01-06 08:00:00'),
(10, 'ktv.tuan',      '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'tuan.pa@hospital.vn',      '0900000010', 'LAB_TECH',     TRUE, '2026-01-06 08:30:00'),
(11, 'ktv.yen',       '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'yen.ht@hospital.vn',       '0900000011', 'LAB_TECH',     TRUE, '2026-01-06 08:30:00'),
(12, 'bn.an',         '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'an.nguyen@gmail.com',      '0912000001', 'PATIENT',      TRUE, '2026-02-10 09:00:00'),
(13, 'bn.bich',       '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'bich.tran@gmail.com',      '0912000002', 'PATIENT',      TRUE, '2026-02-11 10:00:00'),
(14, 'bn.cuong',      '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'cuong.le@gmail.com',       '0912000003', 'PATIENT',      TRUE, '2026-02-15 14:20:00'),
(15, 'bn.duc',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'duc.pham@gmail.com',       '0912000004', 'PATIENT',      TRUE, '2026-03-01 08:45:00'),
(16, 'bn.han',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'han.vu@gmail.com',         '0912000005', 'PATIENT',      TRUE, '2026-03-05 16:00:00'),
(17, 'bn.ha',         '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'ha.dang@gmail.com',        '0912000006', 'PATIENT',      TRUE, '2026-03-12 11:30:00'),
(18, 'bn.huy',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'huy.hoang@gmail.com',      '0912000007', 'PATIENT',      TRUE, '2026-04-02 09:15:00'),
(19, 'bn.khanh',      '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'khanh.bui@gmail.com',      '0912000008', 'PATIENT',      TRUE, '2026-04-20 13:00:00'),
(20, 'bn.lan',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'lan.ngo@gmail.com',        '0912000009', 'PATIENT',      TRUE, '2026-05-08 10:10:00'),
(21, 'bn.mai',        '$2b$10$mHKbkH4SN1zklnY1n6Bp9.ZS1KXpt2KK3vfE7oU87F1hXDIyrQz.q', 'mai.do@gmail.com',         '0912000010', 'PATIENT',      FALSE,'2026-06-18 15:40:00');

-- -----------------------------------------------------------------------------
-- 2. DEPARTMENTS (8)
-- -----------------------------------------------------------------------------
INSERT INTO departments (department_id, code, department_name, description, created_at) VALUES
(1, 'K_NOI',       'Khoa Nội tổng hợp',       'Khám và điều trị các bệnh nội khoa: tiêu hóa, hô hấp, nội tiết, chuyển hóa.', '2026-01-01 00:00:00'),
(2, 'K_NGOAI',     'Khoa Ngoại tổng hợp',     'Khám, chẩn đoán và phẫu thuật các bệnh lý ngoại khoa, cơ xương khớp.',       '2026-01-01 00:00:00'),
(3, 'K_NHI',       'Khoa Nhi',                'Khám và điều trị bệnh cho trẻ em dưới 16 tuổi.',                              '2026-01-01 00:00:00'),
(4, 'K_SAN',       'Khoa Sản - Phụ khoa',     'Khám thai, chăm sóc sức khỏe sinh sản và các bệnh lý phụ khoa.',              '2026-01-01 00:00:00'),
(5, 'K_TIM_MACH',  'Khoa Tim mạch',           'Chẩn đoán và điều trị bệnh lý tim mạch, huyết áp.',                           '2026-01-01 00:00:00'),
(6, 'LAB',         'Khoa Xét nghiệm - CĐHA',  'Xét nghiệm, chẩn đoán hình ảnh (X-Quang, siêu âm, MRI) và thăm dò chức năng.','2026-01-01 00:00:00'),
(7, 'RECEPTION',   'Phòng Tiếp đón',          'Tiếp nhận bệnh nhân, đăng ký khám và cấp số thứ tự.',                         '2026-01-01 00:00:00'),
(8, 'ADMIN',       'Phòng Quản trị hệ thống', 'Quản trị người dùng và vận hành hệ thống HMS.',                               '2026-01-01 00:00:00');

-- -----------------------------------------------------------------------------
-- 3. PATIENTS (15): 10 có tài khoản app, 5 bệnh nhân vãng lai (user_id NULL)
-- -----------------------------------------------------------------------------
INSERT INTO patients (patient_id, user_id, full_name, dob, gender, address, identity_card, insurance_number, created_at) VALUES
(1,  12,   'Nguyễn Văn An',     '1985-03-12', 'MALE',   'Số 12 Ngõ 45 Phố Kim Mã, Ba Đình, Hà Nội',          '001085012345', 'HN4010100000001', '2026-02-10 09:00:00'),
(2,  13,   'Trần Thị Bích',     '1990-07-25', 'FEMALE', 'Số 8 Phố Hàng Bài, Hoàn Kiếm, Hà Nội',             '001190023456', 'HN4010100000002', '2026-02-11 10:00:00'),
(3,  14,   'Lê Hoàng Cường',    '1972-11-02', 'MALE',   'Số 27 Đường Láng, Đống Đa, Hà Nội',                 '001072034567', 'HN4010100000003', '2026-02-15 14:20:00'),
(4,  15,   'Phạm Minh Đức',     '1998-01-30', 'MALE',   'Số 103 Phố Nguyễn Trãi, Thanh Xuân, Hà Nội',        '001098045678', 'HN4010100000004', '2026-03-01 08:45:00'),
(5,  16,   'Vũ Gia Hân',        '2019-05-14', 'FEMALE', 'Số 5 Ngõ 120 Phố Trường Chinh, Đống Đa, Hà Nội',    NULL,           'HN4010100000005', '2026-03-05 16:00:00'),
(6,  17,   'Đặng Thu Hà',       '1996-09-09', 'FEMALE', 'Số 66 Phố Cầu Giấy, Cầu Giấy, Hà Nội',              '001196056789', 'HN4010100000006', '2026-03-12 11:30:00'),
(7,  18,   'Hoàng Quốc Huy',    '1965-04-18', 'MALE',   'Số 31 Phố Tây Sơn, Đống Đa, Hà Nội',                '001065067890', 'HN4010100000007', '2026-04-02 09:15:00'),
(8,  19,   'Bùi Văn Khánh',     '1958-12-05', 'MALE',   'Số 14 Phố Giải Phóng, Hai Bà Trưng, Hà Nội',        '001058078901', 'HN4010100000008', '2026-04-20 13:00:00'),
(9,  20,   'Ngô Thị Lan',       '1980-06-21', 'FEMALE', 'Số 9 Phố Minh Khai, Hai Bà Trưng, Hà Nội',          '001180089012', 'HN4010100000009', '2026-05-08 10:10:00'),
(10, 21,   'Đỗ Thanh Mai',      '2001-02-14', 'FEMALE', 'Số 77 Phố Lê Văn Lương, Thanh Xuân, Hà Nội',        '001301090123', NULL,              '2026-06-18 15:40:00'),
(11, NULL, 'Nguyễn Hữu Nam',    '1993-08-08', 'MALE',   'Xã Đông Anh, Huyện Đông Anh, Hà Nội',               '001093101234', 'HN4010100000011', '2026-10-14 08:25:00'),
(12, NULL, 'Trần Bảo Long',     '2020-10-03', 'MALE',   'Phường Dịch Vọng, Cầu Giấy, Hà Nội',                NULL,           'HN4010100000012', '2026-10-15 07:55:00'),
(13, NULL, 'Lý Thị Ngọc',       '1988-03-03', 'FEMALE', 'Phường Yên Hòa, Cầu Giấy, Hà Nội',                  '001188112345', NULL,              '2026-10-16 09:20:00'),
(14, NULL, 'Phan Văn Phúc',     '1975-10-10', 'MALE',   'Phường Bồ Đề, Long Biên, Hà Nội',                   '001075123456', 'HN4010100000014', '2026-10-19 07:50:00'),
(15, NULL, 'Võ Thị Quỳnh',      '1969-12-25', 'FEMALE', 'Phường Văn Quán, Hà Đông, Hà Nội',                  '001169134567', 'HN4010100000015', '2026-10-19 08:20:00');

-- -----------------------------------------------------------------------------
-- 4. BUILDING (2)
-- -----------------------------------------------------------------------------
INSERT INTO building (building_id, building_name) VALUES
(1, 'Nhà A - Khối Khám bệnh'),
(2, 'Nhà B - Khối Cận lâm sàng');

-- -----------------------------------------------------------------------------
-- 5. ROOMS (10): 6 phòng khám, 2 phòng lab/CĐHA, 2 phòng khác
-- -----------------------------------------------------------------------------
INSERT INTO rooms (room_id, building_id, department_id, room_number, room_name, room_type) VALUES
(1,  1, 1, 'A101', 'Phòng khám Nội 1',                        'CLINIC'),
(2,  1, 1, 'A102', 'Phòng khám Nội 2',                        'CLINIC'),
(3,  1, 2, 'A201', 'Phòng khám Ngoại',                        'CLINIC'),
(4,  1, 3, 'A202', 'Phòng khám Nhi',                          'CLINIC'),
(5,  1, 4, 'A301', 'Phòng khám Sản - Phụ khoa',               'CLINIC'),
(6,  1, 5, 'A302', 'Phòng khám Tim mạch',                     'CLINIC'),
(7,  2, 6, 'B101', 'Phòng xét nghiệm Huyết học - Sinh hóa',   'LAB'),
(8,  2, 6, 'B102', 'Phòng Chẩn đoán hình ảnh',                'LAB'),
(9,  1, 7, 'A001', 'Quầy tiếp đón',                           'OTHER'),
(10, 1, 8, 'A401', 'Phòng Quản trị hệ thống',                 'OTHER');

-- -----------------------------------------------------------------------------
-- 6. STAFF (11): staff_id = user_id
-- -----------------------------------------------------------------------------
INSERT INTO staff (staff_id, user_id, department_id, full_name, title, license_number, created_at) VALUES
(1,  1,  8, 'Quản trị viên hệ thống', 'Quản trị hệ thống',            NULL,           '2026-01-05 08:00:00'),
(2,  2,  1, 'Nguyễn Thanh Tùng',      'Thạc sĩ, Bác sĩ CKI Nội tổng hợp', 'CCHN-001234/HNO', '2026-01-05 08:10:00'),
(3,  3,  1, 'Lê Thị Hoa',             'Tiến sĩ, Bác sĩ CKII Nội tiết',    'CCHN-002345/HNO', '2026-01-05 08:10:00'),
(4,  4,  2, 'Trần Quang Bình',        'Thạc sĩ, Bác sĩ CKI Ngoại',        'CCHN-003456/HNO', '2026-01-05 08:10:00'),
(5,  5,  3, 'Phạm Thu Lan',           'Bác sĩ CKI Nhi khoa',              'CCHN-004567/HNO', '2026-01-05 08:10:00'),
(6,  6,  4, 'Vũ Minh Châu',           'Thạc sĩ, Bác sĩ CKI Sản phụ khoa', 'CCHN-005678/HNO', '2026-01-05 08:10:00'),
(7,  7,  5, 'Đinh Công Hải',          'Phó Giáo sư, Tiến sĩ, Bác sĩ CKII Tim mạch', 'CCHN-006789/HNO', '2026-01-05 08:10:00'),
(8,  8,  7, 'Nguyễn Thị Thu',         'Nhân viên tiếp đón',               NULL,           '2026-01-06 08:00:00'),
(9,  9,  7, 'Lê Văn Sơn',             'Nhân viên tiếp đón',               NULL,           '2026-01-06 08:00:00'),
(10, 10, 6, 'Phạm Anh Tuấn',          'Kỹ thuật viên Xét nghiệm',         'CCHN-007890/HNO', '2026-01-06 08:30:00'),
(11, 11, 6, 'Hoàng Thị Yến',          'Kỹ thuật viên Chẩn đoán hình ảnh', 'CCHN-008901/HNO', '2026-01-06 08:30:00');

-- -----------------------------------------------------------------------------
-- 7. SHIFTS (3)
-- -----------------------------------------------------------------------------
INSERT INTO shifts (shift_id, shift_name, start_time, end_time) VALUES
(1, 'Ca Sáng',  '07:30:00', '11:30:00'),
(2, 'Ca Chiều', '13:00:00', '17:00:00'),
(3, 'Ca Đêm',   '20:00:00', '06:00:00');

-- -----------------------------------------------------------------------------
-- 8. STAFF_SHIFTS: lịch trực T2-T6 từ 05/10 đến 30/10/2026 + vài ca đêm
-- -----------------------------------------------------------------------------
-- Mẫu trực cố định theo tuần (nhân viên, ca, phòng), áp dụng cho các ngày thứ Hai - thứ Sáu
INSERT INTO staff_shifts (staff_id, shift_id, room_id, work_date)
SELECT p.staff_id, p.shift_id, p.room_id, d.work_date
FROM (
    SELECT DATE_ADD('2026-10-05', INTERVAL (a.n + 10 * b.n) DAY) AS work_date
    FROM (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
    CROSS JOIN (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2) b
) d
JOIN (
    SELECT 1 AS staff_id, 1 AS shift_id, 10 AS room_id   -- Quản trị viên: ca sáng
    UNION ALL SELECT 2, 1, 1                             -- BS Tùng: Nội 1, ca sáng
    UNION ALL SELECT 3, 1, 2                             -- BS Hoa: Nội 2, ca sáng
    UNION ALL SELECT 4, 1, 3                             -- BS Bình: Ngoại, ca sáng
    UNION ALL SELECT 5, 1, 4                             -- BS Lan: Nhi, ca sáng
    UNION ALL SELECT 6, 1, 5                             -- BS Châu: Sản, ca sáng
    UNION ALL SELECT 7, 1, 6                             -- BS Hải: Tim mạch, ca sáng
    UNION ALL SELECT 7, 2, 6                             -- BS Hải: Tim mạch, ca chiều
    UNION ALL SELECT 8, 1, 9                             -- Tiếp tân Thu: quầy tiếp đón, ca sáng
    UNION ALL SELECT 9, 2, 9                             -- Tiếp tân Sơn: quầy tiếp đón, ca chiều
    UNION ALL SELECT 10, 1, 7                            -- KTV Tuấn: xét nghiệm, ca sáng
    UNION ALL SELECT 10, 2, 7                            -- KTV Tuấn: xét nghiệm, ca chiều
    UNION ALL SELECT 11, 1, 8                            -- KTV Yến: CĐHA, ca sáng
    UNION ALL SELECT 11, 2, 8                            -- KTV Yến: CĐHA, ca chiều
) p
WHERE DAYOFWEEK(d.work_date) BETWEEN 2 AND 6
  AND d.work_date <= '2026-10-30';

-- Một vài ca đêm trực thêm vào ngày 2026-10-19
INSERT INTO staff_shifts (staff_id, shift_id, room_id, work_date) VALUES
(2,  3, 1, '2026-10-19'),
(10, 3, 7, '2026-10-19');

-- -----------------------------------------------------------------------------
-- 9. APPOINTMENTS (21): room_id là phòng khám của bác sĩ; 4 trạng thái
-- -----------------------------------------------------------------------------
INSERT INTO appointments (appointment_id, patient_id, doctor_id, room_id, appointment_date, appointment_time, status, created_at) VALUES
(1,1,2,1,'2026-10-05','08:00:00','COMPLETED','2026-10-03 20:15:00'),
(2,2,2,1,'2026-10-05','08:30:00','COMPLETED','2026-10-04 09:30:00'),
(3,3,3,2,'2026-10-05','09:00:00','COMPLETED','2026-10-05 08:40:00'),
(4,4,4,3,'2026-10-06','08:00:00','COMPLETED','2026-10-05 21:00:00'),
(5,5,5,4,'2026-10-06','09:00:00','COMPLETED','2026-10-06 07:50:00'),
(6,6,6,5,'2026-10-07','10:00:00','COMPLETED','2026-10-04 19:20:00'),
(7,7,7,6,'2026-10-07','08:00:00','COMPLETED','2026-10-06 14:00:00'),
(8,8,7,6,'2026-10-08','14:00:00','COMPLETED','2026-10-07 10:05:00'),
(9,9,3,2,'2026-10-12','08:00:00','COMPLETED','2026-10-11 16:45:00'),
(10,10,2,1,'2026-10-12','09:00:00','CANCELLED','2026-10-10 22:10:00'),
(11,11,4,3,'2026-10-14','08:30:00','COMPLETED','2026-10-14 08:25:00'),
(12,12,5,4,'2026-10-15','08:00:00','COMPLETED','2026-10-15 07:55:00'),
(13,13,6,5,'2026-10-16','09:30:00','COMPLETED','2026-10-16 09:20:00'),
(14,14,2,1,'2026-10-19','08:00:00','COMPLETED','2026-10-19 07:50:00'),
(15,15,7,6,'2026-10-19','08:30:00','IN_PROGRESS','2026-10-19 08:20:00'),
(16,1,2,1,'2026-10-19','09:00:00','PENDING','2026-10-17 19:00:00'),
(17,3,3,2,'2026-10-19','10:00:00','PENDING','2026-10-16 11:30:00'),
(18,2,2,1,'2026-10-21','08:00:00','PENDING','2026-10-18 20:40:00'),
(19,5,5,4,'2026-10-22','09:00:00','PENDING','2026-10-18 21:10:00'),
(20,8,7,6,'2026-10-23','14:00:00','PENDING','2026-10-19 06:30:00'),
(21,4,4,3,'2026-10-26','08:30:00','PENDING','2026-10-19 08:05:00');

-- -----------------------------------------------------------------------------
-- 10. MEDICAL_RECORDS (14): 1 bệnh án / lịch hẹn (appointment_id UNIQUE)
-- -----------------------------------------------------------------------------
INSERT INTO medical_records (record_id, appointment_id, patient_id, doctor_id, symptoms, diagnosis_icd10, notes, created_at) VALUES
(1,  1,  1,  2, 'Sốt 38.5 độ C, đau họng, ho khan 3 ngày. Họng đỏ, amidan sưng nhẹ.',                         'J02.9',  'Viêm họng cấp. Nghỉ ngơi, uống nhiều nước ấm, tái khám nếu sốt quá 3 ngày.', '2026-10-05 08:10:00'),
(2,  2,  2,  2, 'Đau thượng vị âm ỉ, ợ chua, buồn nôn sau ăn khoảng 2 tuần.',                                 'K29.7',  'Viêm dạ dày. Kiêng đồ cay, rượu bia, cà phê. Ăn đúng giờ.',                  '2026-10-05 08:40:00'),
(3,  3,  3,  3, 'Khát nhiều, tiểu nhiều, mệt mỏi, sụt 4 kg trong 2 tháng.',                                   'E11.9',  'Đái tháo đường típ 2 mới phát hiện. Hướng dẫn chế độ ăn, theo dõi đường huyết tại nhà.', '2026-10-05 09:10:00'),
(4,  4,  4,  4, 'Đau bụng hố chậu phải 12 giờ, sốt nhẹ, buồn nôn. Ấn đau điểm McBurney.',                    'K35.8',  'Nghi viêm ruột thừa cấp. Chỉ định CTM và siêu âm. Hội chẩn chỉ định mổ nội soi.', '2026-10-06 08:10:00'),
(5,  5,  5,  5, 'Sốt 38 độ C, ho có đờm, thở khò khè nhẹ 4 ngày. Phổi có ran ẩm rải rác.',                  'J20.9',  'Viêm phế quản cấp. Theo dõi nhịp thở, tái khám sau 5 ngày.',                  '2026-10-06 09:05:00'),
(6,  6,  6,  6, 'Thai 12 tuần, khám thai định kỳ. Không ra máu, không đau bụng.',                              'Z34.0',  'Thai phát triển bình thường. Hẹn khám thai tuần 20.',                          '2026-10-07 10:05:00'),
(7,  7,  7,  7, 'Đau đầu vùng chẩm, hồi hộp, huyết áp đo tại nhà 160/95 mmHg.',                               'I10',    'Tăng huyết áp. Huyết áp tại phòng khám 158/94 mmHg. Giảm muối, theo dõi huyết áp mỗi sáng.', '2026-10-07 08:10:00'),
(8,  8,  8,  7, 'Khó thở khi leo cầu thang, đau tức ngực trái khi gắng sức, tiền sử hút thuốc 30 năm.',      'I25.1',  'Bệnh tim thiếu máu cục bộ mạn. Chỉ định siêu âm tim, men tim. Ngừng thuốc lá.', '2026-10-08 14:10:00'),
(9,  9,  9,  3, 'Đau đầu, chóng mặt khi đứng dậy nhanh, mệt mỏi. Béo phì độ 1.',                              'E78.5',  'Rối loạn lipid máu. Điều chỉnh chế độ ăn, tăng vận động, tái khám sau 1 tháng.', '2026-10-12 08:10:00'),
(10, 11, 11, 4, 'Đau lưng vùng thắt lưng lan xuống chân phải, tê bì bàn chân 3 tuần.',                       'M51.1',  'Nghi thoát vị đĩa đệm L4-L5. Chỉ định MRI cột sống thắt lưng.',               '2026-10-14 08:40:00'),
(11, 12, 12, 5, 'Tiêu chảy 5 lần/ngày, nôn 2 lần, sốt nhẹ từ hôm qua. Trẻ bú kém.',                         'A09',    'Tiêu chảy cấp nhiễm khuẩn. Bù nước điện giải, theo dõi mất nước.',            '2026-10-15 08:10:00'),
(12, 13, 13, 6, 'Khí hư nhiều, ngứa vùng kín, đau rát khi đi tiểu 1 tuần.',                                  'N76.0',  'Viêm âm đạo cấp. Chờ kết quả xét nghiệm dịch âm đạo để điều chỉnh thuốc.',    '2026-10-16 09:40:00'),
(13, 14, 14, 2, 'Ho, sổ mũi, đau mỏi người, sốt nhẹ 2 ngày.',                                                 'J06.9',  'Nhiễm khuẩn hô hấp trên cấp. Điều trị triệu chứng, nghỉ ngơi.',               '2026-10-19 08:10:00'),
(14, 15, 15, 7, 'Đau thắt ngực sau xương ức khi đi bộ nhanh, kéo dài 5 phút, đỡ khi nghỉ.',                   NULL,     'Đang thăm khám, chờ kết quả ECG và Troponin.',                                '2026-10-19 08:40:00');

-- -----------------------------------------------------------------------------
-- 11. MEDICINE (31): có 1 thuốc sắp hết (Nitroglycerin) và 1 thuốc hết hàng (Ibuprofen)
-- -----------------------------------------------------------------------------
INSERT INTO medicine (med_id, name, unit_price, quantity, is_insurance_covered, unit) VALUES
(1,'Paracetamol 500mg',800,5000,TRUE,'Viên'),
(2,'Amoxicillin 500mg',2500,2000,TRUE,'Viên'),
(3,'Alpha chymotrypsin 4.2mg',700,3000,TRUE,'Viên'),
(4,'Omeprazole 20mg',1500,4000,TRUE,'Viên'),
(5,'Sucralfate 1g',3500,1500,TRUE,'Gói'),
(6,'Metformin 500mg',600,6000,TRUE,'Viên'),
(7,'Vitamin B1 B6 B12',900,4000,FALSE,'Viên'),
(8,'Acetylcystein 200mg',2200,3000,TRUE,'Gói'),
(9,'Salbutamol 2mg',400,2000,TRUE,'Viên'),
(10,'Paracetamol 150mg',1800,2500,TRUE,'Gói'),
(11,'Sắt fumarat + Acid folic',2800,3000,FALSE,'Viên'),
(12,'Canxi + Vitamin D3',3200,3000,FALSE,'Viên'),
(13,'Amlodipine 5mg',500,5000,TRUE,'Viên'),
(14,'Telmisartan 40mg',3500,3000,TRUE,'Viên'),
(15,'Aspirin 81mg',400,6000,TRUE,'Viên'),
(16,'Atorvastatin 20mg',2800,3000,TRUE,'Viên'),
(17,'Bisoprolol 2.5mg',1800,3000,TRUE,'Viên'),
(18,'Nitroglycerin 0.5mg',1500,80,TRUE,'Viên'),
(19,'Atorvastatin 10mg',2000,3000,TRUE,'Viên'),
(20,'Omega-3 1000mg',4500,2000,FALSE,'Viên'),
(21,'Meloxicam 7.5mg',1200,3000,TRUE,'Viên'),
(22,'Eperisone 50mg',2000,3000,TRUE,'Viên'),
(23,'Oresol',3000,2000,TRUE,'Gói'),
(24,'Kẽm gluconat 10mg',1800,2500,TRUE,'Viên'),
(25,'Men vi sinh Lactobacillus',5500,1500,FALSE,'Gói'),
(26,'Metronidazole 500mg',1500,2500,TRUE,'Viên'),
(27,'Clotrimazole 100mg',6000,1000,TRUE,'Viên đặt'),
(28,'Loratadin 10mg',600,3000,TRUE,'Viên'),
(29,'Ibuprofen 400mg',1000,0,TRUE,'Viên'),
(30,'Cefuroxime 500mg',6500,1500,TRUE,'Viên'),
(31,'Vitamin C 500mg',1200,4000,FALSE,'Viên');

-- -----------------------------------------------------------------------------
-- 12. PRESCRIPTIONS (12): record 4 (chuyển mổ) và 14 (đang khám) chưa có đơn
-- -----------------------------------------------------------------------------
INSERT INTO prescriptions (prescription_id, record_id, doctor_id, created_at) VALUES
(1,1,2,'2026-10-05 08:25:00'),
(2,2,2,'2026-10-05 08:55:00'),
(3,3,3,'2026-10-05 09:30:00'),
(4,5,5,'2026-10-06 09:20:00'),
(5,6,6,'2026-10-07 10:25:00'),
(6,7,7,'2026-10-07 08:30:00'),
(7,8,7,'2026-10-08 14:45:00'),
(8,9,3,'2026-10-12 08:30:00'),
(9,10,4,'2026-10-14 08:55:00'),
(10,11,5,'2026-10-15 08:30:00'),
(11,12,6,'2026-10-16 10:00:00'),
(12,13,2,'2026-10-19 08:25:00');

-- -----------------------------------------------------------------------------
-- 13. PRESCRIPTION_DETAILS (31): unit_price là giá tại thời điểm kê đơn
-- -----------------------------------------------------------------------------
INSERT INTO prescription_details (detail_id, prescription_id, med_id, quantity, unit_price, dosage, note) VALUES
(1,1,1,15,800,'1 viên khi sốt trên 38.5 độ C','Cách nhau tối thiểu 6 giờ'),
(2,1,2,21,2500,'1 viên x 3 lần/ngày','Uống sau ăn, trong 7 ngày'),
(3,1,3,20,700,'Ngậm 2 viên x 2 lần/ngày','Ngậm dưới lưỡi'),
(4,2,4,28,1500,'1 viên buổi sáng','Trước ăn 30 phút, trong 4 tuần'),
(5,2,5,28,3500,'1 gói x 2 lần/ngày','Uống trước ăn 1 giờ'),
(6,3,6,60,600,'1 viên x 2 lần/ngày','Uống trong bữa ăn'),
(7,3,7,30,900,'1 viên/ngày','Uống sau ăn sáng'),
(8,4,8,15,2200,'1 gói x 3 lần/ngày','Pha với nước'),
(9,4,9,10,400,'Nửa viên x 2 lần/ngày','Chỉ dùng khi khò khè'),
(10,4,10,10,1800,'1 gói khi sốt trên 38.5 độ C',NULL),
(11,5,11,30,2800,'1 viên/ngày','Sau ăn sáng'),
(12,5,12,30,3200,'1 viên/ngày','Sau ăn trưa'),
(13,6,13,30,500,'1 viên buổi sáng',NULL),
(14,6,14,30,3500,'1 viên buổi sáng','Sau ăn'),
(15,7,15,30,400,'1 viên/ngày','Sau ăn trưa'),
(16,7,16,30,2800,'1 viên buổi tối',NULL),
(17,7,17,30,1800,'1 viên buổi sáng',NULL),
(18,7,18,10,1500,'Ngậm 1 viên khi đau ngực','Tối đa 3 viên, đau không giảm thì đến cấp cứu'),
(19,8,19,30,2000,'1 viên buổi tối',NULL),
(20,8,20,60,4500,'1 viên x 2 lần/ngày','Sau ăn'),
(21,9,21,14,1200,'1 viên/ngày','Sau ăn no, trong 7 ngày'),
(22,9,22,42,2000,'1 viên x 3 lần/ngày','Sau ăn'),
(23,9,4,14,1500,'1 viên buổi sáng','Dùng cùng Meloxicam'),
(24,10,23,10,3000,'Pha 1 gói với 200ml nước','Uống sau mỗi lần đi ngoài'),
(25,10,24,10,1800,'1 viên/ngày','Trong 10 ngày'),
(26,10,25,10,5500,'1 gói x 2 lần/ngày',NULL),
(27,11,26,14,1500,'1 viên x 2 lần/ngày','Trong 7 ngày, kiêng rượu bia'),
(28,11,27,6,6000,'Đặt âm đạo 1 viên mỗi tối','Trong 6 ngày'),
(29,12,1,10,800,'1 viên khi sốt hoặc đau mỏi','Cách nhau 6 giờ'),
(30,12,28,5,600,'1 viên buổi tối',NULL),
(31,12,8,15,2200,'1 gói x 3 lần/ngày',NULL);

-- -----------------------------------------------------------------------------
-- 14. LAB_REQUESTS (18): đủ 4 trạng thái
-- -----------------------------------------------------------------------------
INSERT INTO lab_requests (lab_request_id, record_id, patient_id, doctor_id, test_type, status, created_at) VALUES
(1,  3,  3,  3, 'Xét nghiệm đường huyết lúc đói và HbA1c',  'COMPLETED',  '2026-10-05 09:15:00'),
(2,  3,  3,  3, 'Xét nghiệm lipid máu',                     'COMPLETED',  '2026-10-05 09:15:00'),
(3,  4,  4,  4, 'Xét nghiệm máu toàn phần (CBC)',           'COMPLETED',  '2026-10-06 08:15:00'),
(4,  4,  4,  4, 'Siêu âm ổ bụng',                           'COMPLETED',  '2026-10-06 08:15:00'),
(5,  5,  5,  5, 'X-Quang ngực thẳng',                       'COMPLETED',  '2026-10-06 09:10:00'),
(6,  6,  6,  6, 'Siêu âm thai',                             'COMPLETED',  '2026-10-07 10:10:00'),
(7,  7,  7,  7, 'Điện tâm đồ (ECG)',                        'COMPLETED',  '2026-10-07 08:15:00'),
(8,  8,  8,  7, 'Siêu âm tim',                              'COMPLETED',  '2026-10-08 14:15:00'),
(9,  8,  8,  7, 'Xét nghiệm men tim Troponin T',            'COMPLETED',  '2026-10-08 14:15:00'),
(10, 9,  9,  3, 'Xét nghiệm lipid máu',                     'COMPLETED',  '2026-10-12 08:15:00'),
(11, 10, 11, 4, 'Chụp MRI cột sống thắt lưng',              'PROCESSING', '2026-10-14 08:45:00'),
(12, 11, 12, 5, 'Xét nghiệm phân',                          'COMPLETED',  '2026-10-15 08:15:00'),
(13, 12, 13, 6, 'Xét nghiệm dịch âm đạo',                   'REQUESTED',  '2026-10-16 09:45:00'),
(14, 13, 14, 2, 'Xét nghiệm máu toàn phần (CBC)',           'COMPLETED',  '2026-10-19 08:15:00'),
(15, 14, 15, 7, 'Xét nghiệm men tim Troponin T',            'REQUESTED',  '2026-10-19 08:45:00'),
(16, 2,  2,  2, 'Test nhanh H. pylori',                     'COMPLETED',  '2026-10-05 08:45:00'),
(17, 14, 15, 7, 'Điện tâm đồ (ECG)',                        'PROCESSING', '2026-10-19 08:45:00'),
(18, 10, 11, 4, 'X-Quang cột sống thắt lưng',               'CANCELLED',  '2026-10-14 08:45:00');

-- -----------------------------------------------------------------------------
-- 15. LAB_RESULTS (13): chỉ cho các yêu cầu COMPLETED
-- -----------------------------------------------------------------------------
INSERT INTO lab_results (result_id, lab_request_id, lab_tech_id, result_data, attachment_url, completed_at) VALUES
(1,  1,  10, '{"glucose_fasting":{"value":9.8,"unit":"mmol/L","ref":"3.9-6.4","flag":"HIGH"},"hba1c":{"value":8.2,"unit":"%","ref":"4.0-6.0","flag":"HIGH"}}', 'https://pacs.hospital.vn/results/2026/10/LR0001.pdf', '2026-10-05 10:30:00'),
(2,  2,  10, '{"cholesterol_total":{"value":6.1,"unit":"mmol/L","ref":"<5.2","flag":"HIGH"},"triglyceride":{"value":3.4,"unit":"mmol/L","ref":"<1.7","flag":"HIGH"},"hdl_c":{"value":0.9,"unit":"mmol/L","ref":">1.0","flag":"LOW"},"ldl_c":{"value":3.9,"unit":"mmol/L","ref":"<3.4","flag":"HIGH"}}', 'https://pacs.hospital.vn/results/2026/10/LR0002.pdf', '2026-10-05 10:30:00'),
(3,  3,  10, '{"wbc":{"value":15.2,"unit":"G/L","ref":"4.0-10.0","flag":"HIGH"},"neutrophil_pct":{"value":84,"unit":"%","ref":"40-75","flag":"HIGH"},"rbc":{"value":4.8,"unit":"T/L","ref":"4.2-5.9","flag":"NORMAL"},"hgb":{"value":148,"unit":"g/L","ref":"130-170","flag":"NORMAL"},"plt":{"value":265,"unit":"G/L","ref":"150-400","flag":"NORMAL"}}', 'https://pacs.hospital.vn/results/2026/10/LR0003.pdf', '2026-10-06 09:00:00'),
(4,  4,  11, '{"conclusion":"Ruột thừa viêm, đường kính 9mm, thành dày, quanh ruột thừa có ít dịch. Không thấy dịch tự do ổ bụng.","finding":"Gan, mật, tụy, lách, thận bình thường."}', 'https://pacs.hospital.vn/dicom/2026/10/US0004.dcm', '2026-10-06 09:20:00'),
(5,  5,  11, '{"conclusion":"Tăng đậm rốn phổi hai bên, tăng tuần hoàn phế quản. Không thấy đông đặc nhu mô.","finding":"Bóng tim không to. Hai xoang sườn hoành nhọn."}', 'https://pacs.hospital.vn/dicom/2026/10/XR0005.dcm', '2026-10-06 10:00:00'),
(6,  6,  11, '{"gestational_age_weeks":12,"fetal_heart_rate":{"value":158,"unit":"bpm"},"crl":{"value":58,"unit":"mm"},"nuchal_translucency":{"value":1.4,"unit":"mm"},"conclusion":"Thai 1 con sống trong buồng tử cung, phát triển phù hợp tuổi thai."}', 'https://pacs.hospital.vn/dicom/2026/10/US0006.dcm', '2026-10-07 10:50:00'),
(7,  7,  10, '{"heart_rate":{"value":88,"unit":"bpm"},"rhythm":"Nhịp xoang","axis":"Bình thường","conclusion":"Dày thất trái nhẹ theo tiêu chuẩn điện thế."}', 'https://pacs.hospital.vn/results/2026/10/ECG0007.pdf', '2026-10-07 08:40:00'),
(8,  8,  11, '{"lvef":{"value":48,"unit":"%","ref":">=55","flag":"LOW"},"conclusion":"Giảm động vùng thành trước vách liên thất. Chức năng tâm thu thất trái giảm nhẹ. Van tim không hở đáng kể."}', 'https://pacs.hospital.vn/dicom/2026/10/ECHO0008.dcm', '2026-10-08 15:10:00'),
(9,  9,  10, '{"troponin_t_hs":{"value":0.012,"unit":"ng/mL","ref":"<0.014","flag":"NORMAL"}}', 'https://pacs.hospital.vn/results/2026/10/LR0009.pdf', '2026-10-08 15:00:00'),
(10, 10, 10, '{"cholesterol_total":{"value":5.8,"unit":"mmol/L","ref":"<5.2","flag":"HIGH"},"triglyceride":{"value":2.6,"unit":"mmol/L","ref":"<1.7","flag":"HIGH"},"hdl_c":{"value":1.1,"unit":"mmol/L","ref":">1.0","flag":"NORMAL"},"ldl_c":{"value":3.7,"unit":"mmol/L","ref":"<3.4","flag":"HIGH"}}', 'https://pacs.hospital.vn/results/2026/10/LR0010.pdf', '2026-10-12 09:30:00'),
(11, 12, 10, '{"appearance":"Phân lỏng, vàng nhạt","wbc_stool":"10-15/vi trường","rbc_stool":"Âm tính","rotavirus_antigen":"Dương tính","conclusion":"Tiêu chảy cấp do Rotavirus."}', 'https://pacs.hospital.vn/results/2026/10/LR0012.pdf', '2026-10-15 09:20:00'),
(12, 14, 10, '{"wbc":{"value":7.1,"unit":"G/L","ref":"4.0-10.0","flag":"NORMAL"},"neutrophil_pct":{"value":58,"unit":"%","ref":"40-75","flag":"NORMAL"},"lymphocyte_pct":{"value":34,"unit":"%","ref":"20-45","flag":"NORMAL"},"hgb":{"value":139,"unit":"g/L","ref":"130-170","flag":"NORMAL"},"plt":{"value":242,"unit":"G/L","ref":"150-400","flag":"NORMAL"}}', 'https://pacs.hospital.vn/results/2026/10/LR0014.pdf', '2026-10-19 09:00:00'),
(13, 16, 10, '{"h_pylori_rapid_test":"Dương tính","method":"Test urease nhanh"}', NULL, '2026-10-05 09:30:00');

-- -----------------------------------------------------------------------------
-- KIỂM TRA NHANH SỐ LƯỢNG BẢN GHI
-- -----------------------------------------------------------------------------
SELECT 'users' AS tbl, COUNT(*) AS total FROM users
UNION ALL SELECT 'departments',          COUNT(*) FROM departments
UNION ALL SELECT 'patients',             COUNT(*) FROM patients
UNION ALL SELECT 'building',             COUNT(*) FROM building
UNION ALL SELECT 'rooms',                COUNT(*) FROM rooms
UNION ALL SELECT 'staff',                COUNT(*) FROM staff
UNION ALL SELECT 'shifts',               COUNT(*) FROM shifts
UNION ALL SELECT 'staff_shifts',         COUNT(*) FROM staff_shifts
UNION ALL SELECT 'appointments',         COUNT(*) FROM appointments
UNION ALL SELECT 'medical_records',      COUNT(*) FROM medical_records
UNION ALL SELECT 'medicine',             COUNT(*) FROM medicine
UNION ALL SELECT 'prescriptions',        COUNT(*) FROM prescriptions
UNION ALL SELECT 'prescription_details', COUNT(*) FROM prescription_details
UNION ALL SELECT 'lab_requests',         COUNT(*) FROM lab_requests
UNION ALL SELECT 'lab_results',          COUNT(*) FROM lab_results;