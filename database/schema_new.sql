-- =============================================================================
-- DATABASE SCHEMA: HOSPITAL MANAGEMENT SYSTEM (HMS)
-- Target DB: MySQL 8.0+ / MariaDB 10.5+
-- Engine: InnoDB | Charset: utf8mb4_unicode_ci
-- =============================================================================

CREATE DATABASE IF NOT EXISTS hospital_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hospital_db;

-- Tắt kiểm tra khóa ngoại tạm thời để tránh lỗi phụ thuộc khi Drop/Create
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS staff_shifts;
DROP TABLE IF EXISTS shifts;
DROP TABLE IF EXISTS lab_results;
DROP TABLE IF EXISTS lab_requests;
DROP TABLE IF EXISTS prescription_details;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS medicine;
DROP TABLE IF EXISTS medical_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS building;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. BẢNG USERS (Tài khoản truy cập hệ thống)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    role ENUM('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'LAB_TECH', 'ADMIN') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. BẢNG DEPARTMENTS (Danh mục Khoa / Phòng ban)
-- -----------------------------------------------------------------------------
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE, -- Vd: 'K_NOI', 'K_NGOAI', 'LAB', 'RECEPTION'
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. BẢNG PATIENTS (Hồ sơ lý lịch Bệnh nhân)
-- -----------------------------------------------------------------------------
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- Có thể NULL nếu bệnh nhân vãng lai chưa tạo tài khoản app
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    address TEXT,
    identity_card VARCHAR(20) UNIQUE, -- Số CCCD/VNeID
    insurance_number VARCHAR(20) UNIQUE, -- Số BHYT
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_patients_user
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. BẢNG BUILDING (Tòa nhà)
-- -----------------------------------------------------------------------------
CREATE TABLE building (
    building_id INT AUTO_INCREMENT PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. BẢNG ROOMS (Phòng khám / phòng xét nghiệm)
-- -----------------------------------------------------------------------------
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    department_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    room_type ENUM('CLINIC', 'LAB', 'OTHER') NOT NULL DEFAULT 'CLINIC',

    CONSTRAINT fk_rooms_building FOREIGN KEY (building_id)
        REFERENCES building(building_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_rooms_department FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_rooms_building_number UNIQUE (building_id, room_number) -- Không trùng số phòng trong cùng tòa nhà
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. BẢNG STAFF (Hồ sơ Nhân viên: Bác sĩ, Tiếp tân, KTV Lab, Admin)
-- Phòng làm việc của nhân viên được xác định theo ca trong bảng staff_shifts
-- -----------------------------------------------------------------------------
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(50), 
    license_number VARCHAR(50) UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_staff_department FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. BẢNG APPOINTMENTS (Lịch hẹn)
-- -----------------------------------------------------------------------------
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL, -- Trỏ tới staff_id của Bác sĩ
    room_id INT NOT NULL,   -- Phòng khám diễn ra cuộc hẹn
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL, -- Vd: '08:00:00'
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_room FOREIGN KEY (room_id) 
        REFERENCES rooms(room_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    -- Một bác sĩ không có 2 lịch hẹn cùng ngày cùng giờ
    CONSTRAINT uq_appointments_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. BẢNG MEDICAL_RECORDS (Bệnh án điện tử - EMR)
-- -----------------------------------------------------------------------------
CREATE TABLE medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    symptoms TEXT, -- Triệu chứng lâm sàng
    diagnosis_icd10 VARCHAR(20), -- Mã chẩn đoán quốc tế ICD-10
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_records_appointment FOREIGN KEY (appointment_id) 
        REFERENCES appointments(appointment_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_records_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_records_doctor FOREIGN KEY (doctor_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. BẢNG PRESCRIPTIONS (Đơn thuốc điện tử)
-- -----------------------------------------------------------------------------
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL UNIQUE,
    doctor_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prescriptions_record FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. BẢNG LAB_REQUESTS (Yêu cầu Xét nghiệm / Cận lâm sàng)
-- -----------------------------------------------------------------------------
CREATE TABLE lab_requests (
    lab_request_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL, -- Bác sĩ chỉ định
    test_type VARCHAR(100) NOT NULL, -- Vd: 'Xét nghiệm máu toàn phần', 'X-Quang ngực'
    status ENUM('REQUESTED', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lab_requests_record FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lab_requests_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_lab_requests_doctor FOREIGN KEY (doctor_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. BẢNG LAB_RESULTS (Kết quả Xét nghiệm / PACS)
-- -----------------------------------------------------------------------------
CREATE TABLE lab_results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_request_id INT NOT NULL UNIQUE,
    lab_tech_id INT NOT NULL, -- Kỹ thuật viên xử lý
    result_data JSON NULL, -- Các chỉ số định lượng/định tính dạng JSON
    attachment_url VARCHAR(500) NULL, -- Link tới file ảnh DICOM/PDF kết quả
    completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lab_results_request FOREIGN KEY (lab_request_id) 
        REFERENCES lab_requests(lab_request_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lab_results_tech FOREIGN KEY (lab_tech_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. BẢNG MEDICINE (Kho/danh mục thuốc)
-- -----------------------------------------------------------------------------
CREATE TABLE medicine (
    med_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    unit_price INT NOT NULL, -- VND
    quantity INT NOT NULL DEFAULT 0,
    is_insurance_covered BOOLEAN NOT NULL DEFAULT FALSE,
    unit VARCHAR(50) NOT NULL, -- Vd: 'Viên', 'Gói', 'Chai'

    CONSTRAINT chk_medicine_price CHECK (unit_price >= 0),
    CONSTRAINT chk_medicine_quantity CHECK (quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. BẢNG PRESCRIPTION_DETAILS (Chi tiết các thuốc trong từng đơn)
-- -----------------------------------------------------------------------------
CREATE TABLE prescription_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    med_id INT NOT NULL,
    quantity INT NOT NULL, -- Số lượng bác sĩ kê cho đơn này (VD: 10 viên)
    unit_price INT NOT NULL, -- Giá tại thời điểm kê đơn (VND), không đổi khi medicine.unit_price thay đổi
    dosage VARCHAR(255) NOT NULL, -- Liều dùng (VD: "Sáng 1 viên, Tối 1 viên")
    note VARCHAR(255) NULL, -- Ghi chú thêm (VD: "Uống sau khi ăn no")

    CONSTRAINT fk_details_prescription FOREIGN KEY (prescription_id) 
        REFERENCES prescriptions(prescription_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_details_medicine FOREIGN KEY (med_id) 
        REFERENCES medicine(med_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_details_prescription_med UNIQUE (prescription_id, med_id), -- Một thuốc chỉ xuất hiện 1 lần trong 1 đơn
    CONSTRAINT chk_details_quantity CHECK (quantity > 0),
    CONSTRAINT chk_details_price CHECK (unit_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. BẢNG SHIFTS (Ca làm việc)
-- -----------------------------------------------------------------------------
CREATE TABLE shifts (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    shift_name VARCHAR(50) NOT NULL, -- Vd: 'Ca Sáng', 'Ca Chiều', 'Ca Đêm'
    start_time TIME NOT NULL,        -- Vd: '07:30:00'
    end_time TIME NOT NULL           -- Vd: '11:30:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 15. BẢNG STAFF_SHIFTS (Phân ca làm việc cho nhân viên)
-- -----------------------------------------------------------------------------
CREATE TABLE staff_shifts (
    staff_shift_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    shift_id INT NOT NULL,
    room_id INT NOT NULL, -- Trực ở phòng nào trong ca này
    work_date DATE NOT NULL, -- Ngày làm việc
    
    CONSTRAINT fk_staff_shifts_staff FOREIGN KEY (staff_id) 
        REFERENCES staff(staff_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_staff_shifts_shift FOREIGN KEY (shift_id) 
        REFERENCES shifts(shift_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_staff_shifts_room FOREIGN KEY (room_id) 
        REFERENCES rooms(room_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_staff_shift_date UNIQUE (staff_id, shift_id, work_date) -- 1 NV không trực 2 phòng cùng ca
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE INDEX idx_users_role ON users(role);

-- Lọc lịch hẹn theo ngày và trạng thái
CREATE INDEX idx_appointments_date_status ON appointments(appointment_date, status);

-- Tra cứu lịch sử bệnh án và chỉ định Lab
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_lab_requests_status ON lab_requests(status);

-- Tra cứu lịch trực theo ngày
CREATE INDEX idx_staff_shifts_date ON staff_shifts(work_date);