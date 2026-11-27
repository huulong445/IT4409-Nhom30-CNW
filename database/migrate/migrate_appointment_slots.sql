USE hospital_db;

ALTER TABLE appointments
    DROP INDEX uq_appointments_doctor_slot,
    ADD CONSTRAINT uq_appointments_patient_doctor_slot
        UNIQUE (patient_id, doctor_id, appointment_date, appointment_time),
    ADD INDEX idx_appointments_doctor_slot
        (doctor_id, appointment_date, appointment_time);