Luồng nghiệp vụ:
1. Danh sách bênh nhân chờ khám
- Gọi API: GET /api/v1/doctor/appointments
- Với input ở query: {
                doctor_id: doctorId,
                date: date // Định dạng chuỗi 'YYYY-MM-DD', ví dụ: '2026-11-07'
            }
- Kết quả trả về sẽ có dạng: 
{"success": true,
    "data": [
        {
            "appointment_id": 1,
            "appointment_date": "2026-10-04T17:00:00.000Z",
            "appointment_time": "08:00:00",
            "status": "COMPLETED",
            "room_id": 1,
            "created_at": "2026-10-03T13:15:00.000Z",
            "patient_id": 1,
            "full_name": "Nguyễn Văn An",
            "dob": "1985-03-11T17:00:00.000Z",
            "gender": "MALE",
            "insurance_number": "HN4010100000001"
        },....]
}

2. - **Khám bệnh & Lập Bệnh án điện tử (EMR):**
a, Tra cứu lịch sử khám/tiền sử bệnh của bệnh nhân:
- GỌI API: GET /api/v1/doctor/medical-records/patient
- input: patient_id ở query
- Ví dụ: /api/v1/doctor/medical-records/patient/2
- Kết quả trả về có dạng: 
{
    "success": true,
    "count": 1,
    "data": [
        {
            "record_id": 2,
            "appointment_id": 2,
            "patient_id": 2,
            "doctor_id": 2,
            "symptoms": "Đau thượng vị âm ỉ, ợ chua, buồn nôn sau ăn khoảng 2 tuần.",
            "diagnosis_icd10": "K29.7",
            "notes": "Viêm dạ dày. Kiêng đồ cay, rượu bia, cà phê. Ăn đúng giờ.",
            "created_at": "2026-10-05T01:40:00.000Z"
        }
    ]
}
LƯU Ý: Ở ĐÂY HIỆN TẠI ĐÃ LẤY HẾT THÔNG TIN LỊCH SỬ KHÁM LUÔN. HƯỚNG THIẾT KẾ SAU NÀY KHI LẤY LỊCH SỬ KHÁM CỦA BỆNH NHÂN SẼ CHỈ LẤY 1 VÀI THÔNG TIN NHƯ CHUẨN ĐOÁN,.. . SAU ĐÓ KHI CHỌN CHI TIẾT 1 BỆNH ÁN THÌ MỚI HIỆN ĐẦY ĐỦ HẾT THÔNG TIN VỀ LỊCH SỬ KHÁM ĐÓ

b, Lấy thông tin lịch sử khám chi tiết từng lần
-GỌI API: GET /api/v1/doctor/medical-records
- Input: record_id ở query
- Kết quả trả về có dạng: 
{
    "success": true,
    "data": {
        "record_id": 2,
        "appointment_id": 2,
        "patient_id": 2,
        "doctor_id": 2,
        "symptoms": "Đau thượng vị âm ỉ, ợ chua, buồn nôn sau ăn khoảng 2 tuần.",
        "diagnosis_icd10": "K29.7",
        "notes": "Viêm dạ dày. Kiêng đồ cay, rượu bia, cà phê. Ăn đúng giờ.",
        "created_at": "2026-10-05T01:40:00.000Z"
    }
}

c, Nhập chẩn đoán lâm sàng (mã ICD-10/11), triệu chứng, diễn biến bệnh.
- GỌI API: POST /api/v1/doctor/medical-records
- Input: {appointment_id, patient_id, doctor_id, symptoms, diagnosis_icd10, notes} ở request body

d, Xóa chấn đoán
- API: DELETE/api/v1/doctor/medical-records
- Input: record_id ở request query

e, Update chấn đoán
- API: PUT /api/v1/doctor/medical-records
- Input: record_id ở query và {symptoms, diagnosis_icd10, notes} ở request body

3. Chỉ định cận lâm sàng
a, Tạo chỉ định
- API: POST /api/v1/doctor/lab-requests/
- Input: {record_id,patient_id,doctor_id,test_type} ở request body

b, Lấy chỉ định
- API: GET /api/v1/doctor/lab-requests/
- Input: record_id hoặc patient_id ở request query 

c, Update chỉ định
- API: PUT /api/v1/doctor/lab-requests/
- Input: lab_request_id ở query và {test_type,status} ở request body

d, Xóa chỉ định
- API: DELETE /api/v1/doctor/lab-requests/
- Input: lab_request_id ở query

4. Kê đơn thuốc
a, Tạo đơn thuốc
- API: /api/v1/doctor/prescriptions
- Input: {record_id, doctor_id, medication_details} ở request body

b, Xem đơn thuốc
- API: /api/v1/doctor/prescriptions : Input: record_id
- hoặc API /api/v1/doctor/prescriptions/patient : Input patient_id ở request query 
- Trả về có dạng:
{
    "success": true,
    "count": 1,
    "data": [
        {
            "prescription_id": 2,
            "record_id": 2,
            "doctor_id": 2,
            "created_at": "2026-10-05T01:55:00.000Z",
            "details": [
                {
                    "note": "Trước ăn 30 phút, trong 4 tuần",
                    "dosage": "1 viên buổi sáng",
                    "med_id": 4,
                    "med_name": "Omeprazole 20mg",
                    "quantity": 28,
                    "detail_id": 4,
                    "unit_price": 1500
                },
                {
                    "note": "Uống trước ăn 1 giờ",
                    "dosage": "1 gói x 2 lần/ngày",
                    "med_id": 5,
                    "med_name": "Sucralfate 1g",
                    "quantity": 28,
                    "detail_id": 5,
                    "unit_price": 3500
                }
            ]
        }
    ]
}

c, Tạo đơn thuốc
- API: POST /api/v1/doctor/prescriptions
- input: 
Input 1: record_id, doctor_id — Vị trí: req.body
Input 2: medication_details (Mảng chứa các đối tượng: med_id, quantity, unit_price, dosage, note) — Vị trí: req.body
- Ví dụ: 
{
  "record_id": 13,
  "doctor_id": 2,
  "medication_details": [
    {
      "med_id": 1,
      "quantity": 15,
      "unit_price": 800,
      "dosage": "1 viên khi sốt trên 38.5 độ C",
      "note": "Cách nhau tối thiểu 6 giờ"
    },
    {
      "med_id": 3,
      "quantity": 10,
      "unit_price": 1200,
      "dosage": "Sáng 1 viên, Tối 1 viên",
      "note": "Uống sau khi ăn"
    }
  ]
}

5. Lấy kết quả LabResults
- API: GET /api/v1/doctor/lab-results
- Input: lab_request_id , ở query

