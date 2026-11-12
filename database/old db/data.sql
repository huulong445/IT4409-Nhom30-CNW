-- =============================================================================
-- SAMPLE DATA: HOSPITAL MANAGEMENT SYSTEM (HMS)
-- Target DB: MySQL 8.0+ / MariaDB 10.5+
-- Chạy SAU khi đã chạy file schema (tạo hospital_db và các bảng).
-- Mật khẩu mẫu của MỌI tài khoản: Hms@12345 (đã băm bcrypt)
-- Script có thể chạy lại nhiều lần (TRUNCATE trước khi insert).
-- =============================================================================

USE hospital_db;
SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE lab_results;
TRUNCATE TABLE lab_requests;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE medical_records;
TRUNCATE TABLE appointments;
TRUNCATE TABLE staff;
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
-- 4. STAFF (11): staff_id = user_id
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
-- 5. APPOINTMENTS (21): đủ 5 trạng thái. "Hôm nay" của dữ liệu mẫu = 2026-10-19
-- doctor_id / receptionist_id trỏ tới staff_id. queue_number tính theo bác sĩ/ngày.
-- -----------------------------------------------------------------------------
INSERT INTO appointments (appointment_id, patient_id, doctor_id, receptionist_id, appointment_date, time_slot, queue_number, status, created_at) VALUES
(1,  1,  2, 8,    '2026-10-05', '08:00 - 08:30', 1, 'COMPLETED',   '2026-10-03 20:15:00'),
(2,  2,  2, 8,    '2026-10-05', '08:30 - 09:00', 2, 'COMPLETED',   '2026-10-04 09:30:00'),
(3,  3,  3, 9,    '2026-10-05', '09:00 - 09:30', 1, 'COMPLETED',   '2026-10-05 08:40:00'),
(4,  4,  4, NULL, '2026-10-06', '08:00 - 08:30', 1, 'COMPLETED',   '2026-10-05 21:00:00'),
(5,  5,  5, 8,    '2026-10-06', '09:00 - 09:30', 1, 'COMPLETED',   '2026-10-06 07:50:00'),
(6,  6,  6, NULL, '2026-10-07', '10:00 - 10:30', 1, 'COMPLETED',   '2026-10-04 19:20:00'),
(7,  7,  7, 9,    '2026-10-07', '08:00 - 08:30', 1, 'COMPLETED',   '2026-10-06 14:00:00'),
(8,  8,  7, NULL, '2026-10-08', '14:00 - 14:30', 1, 'COMPLETED',   '2026-10-07 10:05:00'),
(9,  9,  3, 8,    '2026-10-12', '08:00 - 08:30', 1, 'COMPLETED',   '2026-10-11 16:45:00'),
(10, 10, 2, NULL, '2026-10-12', '09:00 - 09:30', 1, 'CANCELLED',   '2026-10-10 22:10:00'),
(11, 11, 4, 9,    '2026-10-14', '08:30 - 09:00', 1, 'COMPLETED',   '2026-10-14 08:25:00'),
(12, 12, 5, 8,    '2026-10-15', '08:00 - 08:30', 1, 'COMPLETED',   '2026-10-15 07:55:00'),
(13, 13, 6, 9,    '2026-10-16', '09:30 - 10:00', 1, 'COMPLETED',   '2026-10-16 09:20:00'),
(14, 14, 2, 8,    '2026-10-19', '08:00 - 08:30', 1, 'COMPLETED',   '2026-10-19 07:50:00'),
(15, 15, 7, 9,    '2026-10-19', '08:30 - 09:00', 1, 'IN_PROGRESS', '2026-10-19 08:20:00'),
(16, 1,  2, 8,    '2026-10-19', '09:00 - 09:30', 2, 'CHECKED_IN',  '2026-10-17 19:00:00'),
(17, 3,  3, 9,    '2026-10-19', '10:00 - 10:30', 1, 'CHECKED_IN',  '2026-10-16 11:30:00'),
(18, 2,  2, NULL, '2026-10-21', '08:00 - 08:30', 1, 'PENDING',     '2026-10-18 20:40:00'),
(19, 5,  5, NULL, '2026-10-22', '09:00 - 09:30', 1, 'PENDING',     '2026-10-18 21:10:00'),
(20, 8,  7, NULL, '2026-10-23', '14:00 - 14:30', 1, 'PENDING',     '2026-10-19 06:30:00'),
(21, 4,  4, 8,    '2026-10-24', '08:30 - 09:00', 1, 'PENDING',     '2026-10-19 08:05:00');

-- -----------------------------------------------------------------------------
-- 6. MEDICAL_RECORDS (14): 1 bệnh án / lịch hẹn (appointment_id UNIQUE)
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
-- 7. PRESCRIPTIONS (12): record_id UNIQUE; record 4 (chuyển mổ) và 14 (đang khám) chưa có đơn
-- -----------------------------------------------------------------------------
INSERT INTO prescriptions (prescription_id, record_id, doctor_id, medication_details, created_at) VALUES
(1,  1,  2, '[{"name":"Paracetamol","dosage":"500mg","quantity":15,"note":"Uống 1 viên khi sốt trên 38.5 độ C, cách nhau tối thiểu 6 giờ"},{"name":"Amoxicillin","dosage":"500mg","quantity":21,"note":"Uống 1 viên x 3 lần/ngày, sau ăn, trong 7 ngày"},{"name":"Alpha chymotrypsin","dosage":"4.2mg","quantity":20,"note":"Ngậm dưới lưỡi 2 viên x 2 lần/ngày"}]', '2026-10-05 08:25:00'),
(2,  2,  2, '[{"name":"Omeprazole","dosage":"20mg","quantity":28,"note":"Uống 1 viên buổi sáng trước ăn 30 phút, trong 4 tuần"},{"name":"Sucralfate","dosage":"1g","quantity":28,"note":"Uống 1 gói x 2 lần/ngày, trước ăn 1 giờ"}]', '2026-10-05 08:55:00'),
(3,  3,  3, '[{"name":"Metformin","dosage":"500mg","quantity":60,"note":"Uống 1 viên x 2 lần/ngày, trong bữa ăn"},{"name":"Vitamin B1 B6 B12","dosage":"125mg","quantity":30,"note":"Uống 1 viên/ngày sau ăn sáng"}]', '2026-10-05 09:30:00'),
(4,  5,  5, '[{"name":"Acetylcystein","dosage":"200mg","quantity":15,"note":"Uống 1 gói x 3 lần/ngày, pha với nước"},{"name":"Salbutamol","dosage":"2mg","quantity":10,"note":"Uống nửa viên x 2 lần/ngày khi khò khè"},{"name":"Paracetamol","dosage":"150mg","quantity":10,"note":"Gói 150mg, uống 1 gói khi sốt trên 38.5 độ C"}]', '2026-10-06 09:20:00'),
(5,  6,  6, '[{"name":"Sắt fumarat + Acid folic","dosage":"310mg/0.35mg","quantity":30,"note":"Uống 1 viên/ngày sau ăn sáng"},{"name":"Canxi + Vitamin D3","dosage":"500mg/200IU","quantity":30,"note":"Uống 1 viên/ngày sau ăn trưa"}]', '2026-10-07 10:25:00'),
(6,  7,  7, '[{"name":"Amlodipine","dosage":"5mg","quantity":30,"note":"Uống 1 viên buổi sáng"},{"name":"Telmisartan","dosage":"40mg","quantity":30,"note":"Uống 1 viên buổi sáng sau ăn"}]', '2026-10-07 08:30:00'),
(7,  8,  7, '[{"name":"Aspirin","dosage":"81mg","quantity":30,"note":"Uống 1 viên/ngày sau ăn trưa"},{"name":"Atorvastatin","dosage":"20mg","quantity":30,"note":"Uống 1 viên buổi tối"},{"name":"Bisoprolol","dosage":"2.5mg","quantity":30,"note":"Uống 1 viên buổi sáng"},{"name":"Nitroglycerin","dosage":"0.5mg","quantity":10,"note":"Ngậm dưới lưỡi 1 viên khi đau ngực, tối đa 3 viên"}]', '2026-10-08 14:45:00'),
(8,  9,  3, '[{"name":"Atorvastatin","dosage":"10mg","quantity":30,"note":"Uống 1 viên buổi tối"},{"name":"Omega-3","dosage":"1000mg","quantity":60,"note":"Uống 1 viên x 2 lần/ngày sau ăn"}]', '2026-10-12 08:30:00'),
(9,  10, 4, '[{"name":"Meloxicam","dosage":"7.5mg","quantity":14,"note":"Uống 1 viên/ngày sau ăn no, trong 7 ngày"},{"name":"Eperisone","dosage":"50mg","quantity":42,"note":"Uống 1 viên x 3 lần/ngày sau ăn"},{"name":"Omeprazole","dosage":"20mg","quantity":14,"note":"Uống 1 viên sáng trước ăn, dùng cùng Meloxicam"}]', '2026-10-14 08:55:00'),
(10, 11, 5, '[{"name":"Oresol","dosage":"27.9g","quantity":10,"note":"Pha 1 gói với 200ml nước, uống sau mỗi lần đi ngoài"},{"name":"Kẽm gluconat","dosage":"10mg","quantity":10,"note":"Uống 1 viên/ngày trong 10 ngày"},{"name":"Men vi sinh Lactobacillus","dosage":"1 gói","quantity":10,"note":"Uống 1 gói x 2 lần/ngày"}]', '2026-10-15 08:30:00'),
(11, 12, 6, '[{"name":"Metronidazole","dosage":"500mg","quantity":14,"note":"Uống 1 viên x 2 lần/ngày trong 7 ngày, kiêng rượu bia"},{"name":"Clotrimazole","dosage":"100mg","quantity":6,"note":"Đặt âm đạo 1 viên mỗi tối trong 6 ngày"}]', '2026-10-16 10:00:00'),
(12, 13, 2, '[{"name":"Paracetamol","dosage":"500mg","quantity":10,"note":"Uống 1 viên khi sốt hoặc đau mỏi, cách nhau 6 giờ"},{"name":"Loratadin","dosage":"10mg","quantity":5,"note":"Uống 1 viên buổi tối"},{"name":"Acetylcystein","dosage":"200mg","quantity":15,"note":"Uống 1 gói x 3 lần/ngày"}]', '2026-10-19 08:25:00');

-- -----------------------------------------------------------------------------
-- 8. LAB_REQUESTS (18): đủ 4 trạng thái
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
-- 9. LAB_RESULTS (13): chỉ cho các yêu cầu COMPLETED (lab_request_id UNIQUE)
-- lab_tech_id = staff_id 10 (KTV xét nghiệm) hoặc 11 (KTV chẩn đoán hình ảnh)
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
UNION ALL SELECT 'departments',     COUNT(*) FROM departments
UNION ALL SELECT 'patients',        COUNT(*) FROM patients
UNION ALL SELECT 'staff',           COUNT(*) FROM staff
UNION ALL SELECT 'appointments',    COUNT(*) FROM appointments
UNION ALL SELECT 'medical_records', COUNT(*) FROM medical_records
UNION ALL SELECT 'prescriptions',   COUNT(*) FROM prescriptions
UNION ALL SELECT 'lab_requests',    COUNT(*) FROM lab_requests
UNION ALL SELECT 'lab_results',     COUNT(*) FROM lab_results;