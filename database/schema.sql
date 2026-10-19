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

DROP TABLE IF EXISTS lab_results;
DROP TABLE IF EXISTS lab_requests;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS medical_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS staff;
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
    user_id INT UNIQUE NULL, -- Có thể NULL nếu bệnh nhân vãng lai chưa tạo tài khoản app
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    address TEXT,
    identity_card VARCHAR(20) UNIQUE, -- Số CCCD/VNeID
    insurance_number VARCHAR(20) UNIQUE, -- Số BHYT
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. BẢNG STAFF (Hồ sơ Nhân viên: Bác sĩ, Tiếp tân, KTV Lab, Admin)
-- -----------------------------------------------------------------------------
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    department_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(50), -- Vd: 'Thạc sĩ, Bác sĩ CKI', 'Kỹ thuật viên'
    license_number VARCHAR(50) UNIQUE, -- Số chứng chỉ hành nghề y tế
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_staff_department FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. BẢNG APPOINTMENTS (Lịch hẹn / Luồng Tiếp đón)
-- -----------------------------------------------------------------------------
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL, -- Trỏ tới staff_id của Bác sĩ
    receptionist_id INT NULL, -- Trỏ tới staff_id của Tiếp tân (NULL nếu đặt online)
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- Vd: '08:00 - 08:30'
    queue_number INT, -- Số thứ tự trong ngày
    status ENUM('PENDING', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(patient_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appointments_receptionist FOREIGN KEY (receptionist_id) 
        REFERENCES staff(staff_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. BẢNG MEDICAL_RECORDS (Bệnh án điện tử - EMR)
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
-- 7. BẢNG PRESCRIPTIONS (Đơn thuốc điện tử)
-- -----------------------------------------------------------------------------
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL UNIQUE,
    doctor_id INT NOT NULL,
    medication_details JSON NOT NULL, -- Lưu danh sách thuốc định dạng JSON: [{"name": "Paracetamol", "dosage": "500mg", "quantity": 10, "note": "Uống sau ăn"}]
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prescriptions_record FOREIGN KEY (record_id) 
        REFERENCES medical_records(record_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id) 
        REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. BẢNG LAB_REQUESTS (Yêu cầu Xét nghiệm / Cận lâm sàng)
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
-- 9. BẢNG LAB_RESULTS (Kết quả Xét nghiệm / PACS)
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

-- =============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION (Đã chỉnh sửa tối ưu cho MySQL)
-- =============================================================================

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patients_identity ON patients(identity_card);
CREATE INDEX idx_patients_insurance ON patients(insurance_number);

-- Lọc lịch hẹn theo ngày, bác sĩ và trạng thái
CREATE INDEX idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);

-- Tra cứu lịch sử bệnh án và chỉ định Lab theo bệnh nhân
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_lab_requests_status ON lab_requests(status);
CREATE INDEX idx_lab_requests_record ON lab_requests(record_id);