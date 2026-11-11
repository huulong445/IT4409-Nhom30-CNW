// Dữ liệu mẫu chuẩn hóa cho Hệ thống HIS BỆNH VIỆN BÁCH KHOA (BKH)

export const MOCK_USERS_LIST = [
  // --- BÁC SĨ LÂM SÀNG THEO CHUYÊN KHOA ---
  {
    id: 101,
    username: "bs_trung",
    password: "123",
    fullName: "PGS.TS.BS Nguyễn Văn Trung",
    role: "DOCTOR",
    departmentId: 1,
    departmentName: "Khoa Khám bệnh - Nội Tim Mạch",
    room: "Phòng 204 - Nhà A2",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "CCHN-001289/BYT",
    specialty: "Nội Tim Mạch & Tăng Huyết Áp",
    doctorType: "CLINICAL",
    allowedCategories: []
  },
  {
    id: 102,
    username: "bs_lanhuong",
    password: "123",
    fullName: "TS.BS Lê Lan Hương",
    role: "DOCTOR",
    departmentId: 3,
    departmentName: "Khoa Tiêu Hóa - Gan Mật",
    room: "Phòng 305 - Nhà A1",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "CCHN-003412/BYT",
    specialty: "Tiêu Hóa - Gan Mật & Nội Soi",
    doctorType: "CLINICAL",
    allowedCategories: []
  },
  {
    id: 103,
    username: "bs_tuananh",
    password: "123",
    fullName: "BSCKII. Trần Tuấn Anh",
    role: "DOCTOR",
    departmentId: 4,
    departmentName: "Khoa Cơ Xương Khớp",
    room: "Phòng 102 - Nhà B",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "CCHN-004561/BYT",
    specialty: "Cơ Xương Khớp & Chấn Thương Chỉnh Hình",
    doctorType: "CLINICAL",
    allowedCategories: []
  },

  // --- BÁC SĨ CẬN LÂM SÀNG THEO PHÒNG CHUYÊN MÔN KỸ THUẬT (KHÔNG LÀM CHÉO) ---
  // 1. Chuyên khoa Xét nghiệm: Chỉ phụ trách Huyết học & Sinh hóa
  {
    id: 201,
    username: "bs_xetnghiem",
    password: "123",
    fullName: "BS CKI. Lê Thị Hải Hà",
    role: "PARACLINICAL",
    departmentId: 6,
    departmentName: "Trung tâm Xét nghiệm Y học Bách Khoa",
    room: "Phòng Kỹ thuật Sinh hóa & Huyết học - Tầng 1, Tòa C",
    avatar: "https://images.unsplash.com/photo-1594824813637-657152ce8a13?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "CCHN-008921/BYT",
    specialty: "Xét nghiệm Y học (Huyết học & Sinh hóa)",
    paraclinicalScope: "XÉT NGHIỆM (Huyết học & Sinh hóa)",
    doctorType: "PARACLINICAL",
    allowedCategories: ["HEMATOLOGY", "BIOCHEMISTRY"]
  },
  // 2. Chuyên khoa Chẩn đoán hình ảnh: Chỉ phụ trách X-Quang, CT Scanner, MRI
  {
    id: 202,
    username: "bs_cdha",
    password: "123",
    fullName: "ThS.BS Đỗ Thị Thu Hiền",
    role: "PARACLINICAL",
    departmentId: 7,
    departmentName: "Khoa Chẩn đoán hình ảnh Bách Khoa",
    room: "Phòng Đọc phim CT-Scanner & MRI - Tầng B1, Tòa A2",
    avatar: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "CCHN-009142/BYT",
    specialty: "Chẩn đoán hình ảnh (X-Quang, CT-Scanner, MRI)",
    paraclinicalScope: "CHẨN ĐOÁN HÌNH ẢNH (X-Quang, CT, MRI)",
    doctorType: "PARACLINICAL",
    allowedCategories: ["IMAGING"]
  },
  // 3. Chuyên khoa Thăm dò chức năng: Chỉ phụ trách Siêu âm & Điện tim ECG
  {
    id: 203,
    username: "bs_thamdo",
    password: "123",
    fullName: "BS CKI. Vũ Tiến Đạt",
    role: "PARACLINICAL",
    departmentId: 8,
    departmentName: "Khoa Thăm dò chức năng Bách Khoa",
    room: "Phòng Siêu âm Doppler & Điện tâm đồ ECG - Tầng 2, Tòa C",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
    licenseNumber: "CCHN-007733/BYT",
    specialty: "Thăm dò chức năng (Siêu âm & Điện tim ECG)",
    paraclinicalScope: "THĂM DÒ CHỨC NĂNG (Siêu âm & ECG)",
    doctorType: "PARACLINICAL",
    allowedCategories: ["FUNCTIONAL"]
  },

  // --- QUẢN TRỊ VIÊN ---
  {
    id: 1,
    username: "admin_bv",
    password: "123",
    fullName: "ThS. Trần Thị Kim Cương",
    role: "ADMIN",
    departmentId: 0,
    departmentName: "Phòng Kế hoạch Tổng hợp & CNTT Bách Khoa",
    room: "Phòng Quản trị Điều hành - Tầng 3, Nhà A1",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    specialty: "Quản trị Bệnh viện & Hệ thống HIS/LIS/PACS",
    doctorType: "ADMIN",
    allowedCategories: []
  }
];

export const MOCK_CURRENT_USER = MOCK_USERS_LIST[0];
export const MOCK_ADMIN_USER = MOCK_USERS_LIST[6];
export const MOCK_PARACLINICAL_USER = MOCK_USERS_LIST[3];

export const MOCK_DEPARTMENTS = [
  { id: 1, code: "KKB", name: "Khoa Khám bệnh", location: "Tòa A2 - Tầng 1, 2", activeDoctors: 24, totalPatientsToday: 342 },
  { id: 2, code: "TM", name: "Khoa Tim mạch", location: "Tòa A1 - Tầng 3", activeDoctors: 12, totalPatientsToday: 118 },
  { id: 3, code: "TH", name: "Khoa Tiêu hóa - Gan mật", location: "Tòa A1 - Tầng 4", activeDoctors: 10, totalPatientsToday: 95 },
  { id: 4, code: "CXK", name: "Khoa Cơ xương khớp", location: "Tòa B - Tầng 2", activeDoctors: 8, totalPatientsToday: 76 },
  { id: 5, code: "HH", name: "Khoa Hô hấp & Dị ứng", location: "Tòa B - Tầng 3", activeDoctors: 9, totalPatientsToday: 84 },
  { id: 6, code: "XN", name: "Trung tâm Xét nghiệm", location: "Tòa C - Tầng 1", activeDoctors: 15, totalPatientsToday: 410 },
  { id: 7, code: "CDHA", name: "Khoa Chẩn đoán hình ảnh", location: "Tòa A2 - Tầng B1", activeDoctors: 11, totalPatientsToday: 290 },
];

export const MOCK_QUEUE = [
  // --- BỆNH NHÂN ƯU TIÊN (Đặt trước qua App, Dịch vụ VIP, Người cao tuổi, Cấp cứu) ---
  {
    appointmentId: 101,
    queueNumber: "UT-01",
    patientType: "PRIORITY",
    priorityReason: "Đặt trước qua App (08:00 - 08:30)",
    patientId: "BN-2024-0089",
    fullName: "Nguyễn Thị Mai Lan",
    gender: "Nữ",
    age: 48,
    dob: "1978-05-14",
    phone: "0912 345 678",
    insuranceNumber: "DN4010123894712",
    hasInsurance: true,
    address: "Số 15 phố Chùa Bộc, Đống Đa, Hà Nội",
    timeSlot: "08:00 - 08:30",
    checkinTime: "07:45",
    status: "IN_PROGRESS", // Đang khám
    priority: "HIGH",
    reason: "Đau tức ngực trái khi gắng sức, hồi hộp trống ngực 3 ngày nay",
    allergies: "Dị ứng Penicillin, Paracetamol",
    medicalHistory: "Tăng huyết áp 5 năm, Đái tháo đường Type 2"
  },
  {
    appointmentId: 104,
    queueNumber: "UT-02",
    patientType: "PRIORITY",
    priorityReason: "Khám dịch vụ chuyên gia VIP",
    patientId: "BN-2024-0158",
    fullName: "Vũ Thị Hương",
    gender: "Nữ",
    age: 71,
    dob: "1955-08-25",
    phone: "0977 445 566",
    insuranceNumber: "GD4010582910482",
    hasInsurance: true,
    address: "Thanh Xuân Bắc, Thanh Xuân, Hà Nội",
    timeSlot: "08:30 - 09:00",
    checkinTime: "08:15",
    status: "WAITING",
    priority: "HIGH",
    reason: "Khó thở về đêm, phù nhẹ 2 chi dưới, ho khan",
    allergies: "Không rõ",
    medicalHistory: "Suy tim độ II, THA kháng trị"
  },
  {
    appointmentId: 106,
    queueNumber: "UT-03",
    patientType: "PRIORITY",
    priorityReason: "Đặt trước qua App (09:00 - 09:30)",
    patientId: "BN-2024-0188",
    fullName: "Đỗ Thị Kim Oanh",
    gender: "Nữ",
    age: 38,
    dob: "1988-06-12",
    phone: "0915 223 344",
    insuranceNumber: "DN4010998877665",
    hasInsurance: true,
    address: "Quận Ba Đình, Hà Nội",
    timeSlot: "09:00 - 09:30",
    checkinTime: "08:50",
    status: "WAITING",
    priority: "NORMAL",
    reason: "Hồi hộp, run tay khi căng thẳng, sụt cân không rõ nguyên nhân",
    allergies: "Không có",
    medicalHistory: "Nghi ngờ cường giáp Basedow"
  },
  {
    appointmentId: 107,
    queueNumber: "UT-04",
    patientType: "PRIORITY",
    priorityReason: "Người cao tuổi (> 75 tuổi)",
    patientId: "BN-2024-0199",
    fullName: "Nguyễn Văn Hùng",
    gender: "Nam",
    age: 82,
    dob: "1944-01-10",
    phone: "0903 556 677",
    insuranceNumber: "HT3010112233445",
    hasInsurance: true,
    address: "Quận Hoàn Kiếm, Hà Nội",
    timeSlot: "09:30 - 10:00",
    checkinTime: "09:10",
    status: "WAITING",
    priority: "HIGH",
    reason: "Đau khớp gối 2 bên đi lại khó khăn, tiền sử tăng huyết áp",
    allergies: "Không có",
    medicalHistory: "Thoái hóa khớp gối nặng, Tăng huyết áp độ 2"
  },

  // --- BỆNH NHÂN TỰ DO (Walk-in, Lấy số tại Kiosk hoặc Quầy tiếp đón) ---
  {
    appointmentId: 102,
    queueNumber: "TD-01",
    patientType: "WALK_IN",
    walkinSource: "Lấy số tại Kiosk sảnh A2 (08:10)",
    patientId: "BN-2024-0102",
    fullName: "Trần Đình Trọng",
    gender: "Nam",
    age: 62,
    dob: "1964-11-20",
    phone: "0983 112 233",
    insuranceNumber: "HT3010992837119",
    hasInsurance: true,
    address: "Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    timeSlot: "Khám trong buổi sáng",
    checkinTime: "08:10",
    status: "LAB_READY", // Đã có đầy đủ kết quả xét nghiệm, quay về phòng khám kết luận
    priority: "NORMAL",
    reason: "Tái khám định kỳ tăng huyết áp & rối loạn lipid máu",
    allergies: "Không có",
    medicalHistory: "Rối loạn mỡ máu, tiền sử đột quỵ nhẹ năm 2021",
    labProgress: {
      total: 3,
      completed: 3,
      summary: "3/3 kết quả (Bộ mỡ máu toàn phần, Glucose máu, Điện tâm đồ ECG)",
      completedAt: "09:10"
    }
  },
  {
    appointmentId: 109,
    queueNumber: "UT-05",
    patientType: "PRIORITY",
    priorityReason: "Đặt trước qua App (08:30)",
    patientId: "BN-2024-0231",
    fullName: "Vũ Thị Ngọc Lan",
    gender: "Nữ",
    age: 56,
    dob: "1970-04-12",
    phone: "0918 334 556",
    insuranceNumber: "DN4010334455667",
    hasInsurance: true,
    address: "Quận Hai Bà Trưng, Hà Nội",
    timeSlot: "08:30 - 09:00",
    checkinTime: "08:20",
    status: "LAB_READY", // Đã có đủ kết quả CLS
    priority: "HIGH",
    reason: "Đau thắt ngực khi gắng sức, hồi hộp",
    allergies: "Không có",
    medicalHistory: "Tăng huyết áp độ 1",
    labProgress: {
      total: 2,
      completed: 2,
      summary: "2/2 kết quả (Siêu âm tim Doppler, X-Quang ngực thẳng)",
      completedAt: "09:25"
    }
  },
  {
    appointmentId: 110,
    queueNumber: "TD-05",
    patientType: "WALK_IN",
    walkinSource: "Quầy tiếp đón sảnh A2 (08:30)",
    patientId: "BN-2024-0245",
    fullName: "Đặng Văn Minh",
    gender: "Nam",
    age: 41,
    dob: "1985-07-22",
    phone: "0972 119 883",
    insuranceNumber: "DN4010667788990",
    hasInsurance: true,
    address: "Hoàng Mai, Hà Nội",
    timeSlot: "Khám trong buổi sáng",
    checkinTime: "08:30",
    status: "WAITING_LAB", // Đang thực hiện cận lâm sàng, chưa đủ kết quả
    priority: "NORMAL",
    reason: "Đau tức hạ sườn phải âm ỉ, đầy bụng khó tiêu",
    allergies: "Không có",
    medicalHistory: "Gan nhiễm mỡ độ 1",
    labProgress: {
      total: 3,
      completed: 1,
      summary: "1/3 kết quả (Đã có: Siêu âm bụng; Đang chờ: Men gan AST/ALT, Tổng phân tích máu)",
      orderedAt: "08:45"
    }
  },
  {
    appointmentId: 103,
    queueNumber: "TD-02",
    patientType: "WALK_IN",
    walkinSource: "Đăng ký tại Quầy tiếp đón số 3 (08:40)",
    patientId: "BN-2024-0145",
    fullName: "Lê Hoàng Phúc",
    gender: "Nam",
    age: 29,
    dob: "1997-03-08",
    phone: "0904 889 900",
    insuranceNumber: "",
    hasInsurance: false,
    address: "Quận Hai Bà Trưng, Hà Nội",
    timeSlot: "Khám trong buổi sáng",
    checkinTime: "08:40",
    status: "WAITING", // Đang chờ khám ban đầu
    priority: "NORMAL",
    reason: "Chóng mặt, choáng váng khi thay đổi tư thế, mệt mỏi kéo dài",
    allergies: "Dị ứng hải sản",
    medicalHistory: "Không có tiền sử bệnh lý mạn tính"
  },
  {
    appointmentId: 108,
    queueNumber: "TD-03",
    patientType: "WALK_IN",
    walkinSource: "Lấy số tại Kiosk sảnh A2 (08:55)",
    patientId: "BN-2024-0210",
    fullName: "Hoàng Minh Tuấn",
    gender: "Nam",
    age: 45,
    dob: "1981-09-18",
    phone: "0934 667 889",
    insuranceNumber: "DN4010776655443",
    hasInsurance: true,
    address: "Thanh Trì, Hà Nội",
    timeSlot: "Khám trong buổi sáng",
    checkinTime: "08:55",
    status: "WAITING",
    priority: "NORMAL",
    reason: "Đau âm ỉ vùng thượng vị sau ăn, ợ hơi ợ chua",
    allergies: "Không có",
    medicalHistory: "Viêm dạ dày trào ngược"
  },
  {
    appointmentId: 105,
    queueNumber: "TD-04",
    patientType: "WALK_IN",
    walkinSource: "Đăng ký tại Quầy tiếp đón số 1 (07:20)",
    patientId: "BN-2024-0062",
    fullName: "Phạm Văn Đức",
    gender: "Nam",
    age: 53,
    dob: "1973-12-01",
    phone: "0936 998 877",
    insuranceNumber: "DN4010882736192",
    hasInsurance: true,
    address: "Phường Hàng Bài, Hoàn Kiếm, Hà Nội",
    timeSlot: "07:30 - 08:00",
    checkinTime: "07:20",
    status: "COMPLETED", // Đã hoàn thành
    priority: "NORMAL",
    reason: "Khám sức khỏe tổng quát theo dõi sau điều trị viêm dạ dày",
    allergies: "Không có",
    medicalHistory: "Viêm loét dạ dày tá tràng Hp (+)"
  }
];

export const MOCK_ICD10_LIST = [
  { code: "I10", name: "Bệnh tăng huyết áp vô căn (nguyên phát)" },
  { code: "I20.0", name: "Cơn đau thắt ngực không ổn định" },
  { code: "I25.1", name: "Bệnh tim do xơ vữa động mạch" },
  { code: "E11.9", name: "Đái tháo đường type 2 không có biến chứng" },
  { code: "E78.0", name: "Tăng cholesterol máu thuần túy" },
  { code: "K29.7", name: "Viêm dạ dày, không đặc hiệu" },
  { code: "J00", name: "Viêm mũi họng cấp (Cảm thường)" },
  { code: "J45.9", name: "Hen phế quản, không xác định" },
  { code: "M54.5", name: "Đau thắt lưng dưới" },
  { code: "R42", name: "Chóng mặt và hoa mắt" }
];

export const MOCK_COMMON_MEDICATIONS = [
  { id: 1, name: "Amlodipine 5mg", unit: "Viên", defaultUsage: "Uống 1 viên vào buổi sáng sau ăn", stock: 1200 },
  { id: 2, name: "Losartan Potassium 50mg", unit: "Viên", defaultUsage: "Uống 1 viên vào 08h sáng", stock: 850 },
  { id: 3, name: "Atorvastatin 20mg", unit: "Viên", defaultUsage: "Uống 1 viên trước khi đi ngủ", stock: 640 },
  { id: 4, name: "Metformin HCl 850mg", unit: "Viên", defaultUsage: "Uống 1 viên x 2 lần/ngày sau bữa ăn chính", stock: 920 },
  { id: 5, name: "Aspirin 81mg (Enteric coated)", unit: "Viên", defaultUsage: "Uống 1 viên vào buổi trưa sau ăn no", stock: 1500 },
  { id: 6, name: "Esomeprazole 40mg", unit: "Viên", defaultUsage: "Uống 1 viên trước ăn sáng 30 phút", stock: 780 },
  { id: 7, name: "Clopidogrel 75mg", unit: "Viên", defaultUsage: "Uống 1 viên/ngày vào buổi sáng", stock: 430 },
  { id: 8, name: "Bisoprolol 2.5mg", unit: "Viên", defaultUsage: "Uống 1 viên vào buổi sáng", stock: 560 }
];

export const MOCK_LAB_TESTS = [
  { id: 1, category: "Xét nghiệm Huyết học", name: "Tổng phân tích tế bào máu ngoại vi (24 thông số)", price: 95000, code: "XN-HH-01" },
  { id: 2, category: "Xét nghiệm Sinh hóa", name: "Định lượng Glucose máu", price: 45000, code: "XN-SH-01" },
  { id: 3, category: "Xét nghiệm Sinh hóa", name: "Đo hoạt độ men gan (AST/ALT)", price: 70000, code: "XN-SH-02" },
  { id: 4, category: "Xét nghiệm Sinh hóa", name: "Bộ mỡ máu toàn phần (Cholesterol, Triglycerid, HDL-C, LDL-C)", price: 160000, code: "XN-SH-03" },
  { id: 5, category: "Xét nghiệm Sinh hóa", name: "Định lượng Ure, Creatinin máu (Đánh giá chức năng thận)", price: 80000, code: "XN-SH-04" },
  { id: 6, category: "Chẩn đoán hình ảnh", name: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)", price: 80000, code: "CDHA-ECG" },
  { id: 7, category: "Chẩn đoán hình ảnh", name: "Siêu âm Doppler Tim qua thành ngực", price: 350000, code: "CDHA-SATM" },
  { id: 8, category: "Chẩn đoán hình ảnh", name: "Chụp X-quang ngực thẳng kỹ thuật số (CR/DR)", price: 130000, code: "CDHA-XQN" },
];

export const MOCK_LAB_RESULTS_DETAILS = {
  "XN-HH-01": {
    testName: "TỔNG PHÂN TÍCH TẾ BÀO MÁU NGOẠI VI (24 THÔNG SỐ)",
    dept: "TRUNG TÂM XÉT NGHIỆM - BỆNH VIỆN BÁCH KHOA",
    sampleType: "Máu toàn phần (EDTA)",
    sampleTime: "07:50 - 20/10/2026",
    resultTime: "08:20 - 20/10/2026",
    techName: "KTV. Phạm Anh Tuấn",
    approvedBy: "TS.BS. Lê Hoàng Long",
    type: "TABLE",
    parameters: [
      { name: "WBC (Số lượng bạch cầu)", value: "7.2", unit: "G/L", ref: "4.0 - 10.0", status: "NORMAL" },
      { name: "NEUT% (Tỷ lệ bạch cầu trung tính)", value: "62.4", unit: "%", ref: "40.0 - 74.0", status: "NORMAL" },
      { name: "LYMPH% (Tỷ lệ bạch cầu Lympho)", value: "28.5", unit: "%", ref: "20.0 - 40.0", status: "NORMAL" },
      { name: "MONO% (Tỷ lệ bạch cầu Mono)", value: "6.1", unit: "%", ref: "3.0 - 9.0", status: "NORMAL" },
      { name: "EO% (Tỷ lệ bạch cầu ái toan)", value: "2.5", unit: "%", ref: "0.5 - 7.0", status: "NORMAL" },
      { name: "RBC (Số lượng hồng cầu)", value: "4.65", unit: "T/L", ref: "3.80 - 5.50", status: "NORMAL" },
      { name: "HGB (Huyết sắc tố)", value: "138", unit: "g/L", ref: "120 - 165", status: "NORMAL" },
      { name: "HCT (Dung tích hồng cầu)", value: "0.41", unit: "L/L", ref: "0.35 - 0.48", status: "NORMAL" },
      { name: "MCV (Thể tích trung bình HC)", value: "88.2", unit: "fL", ref: "80.0 - 100.0", status: "NORMAL" },
      { name: "MCH (Lượng HST trung bình HC)", value: "29.7", unit: "pg", ref: "27.0 - 32.0", status: "NORMAL" },
      { name: "MCHC (Nồng độ HST trung bình HC)", value: "336", unit: "g/L", ref: "320 - 360", status: "NORMAL" },
      { name: "PLT (Số lượng tiểu cầu)", value: "245", unit: "G/L", ref: "150 - 450", status: "NORMAL" }
    ],
    conclusion: "Công thức máu trong giới hạn bình thường. Không có tình trạng thiếu máu hay nhiễm trùng cấp."
  },
  "XN-SH-03": {
    testName: "BỘ MỠ MÁU TOÀN PHẦN (LIPID PROFILE)",
    dept: "KHOA SINH HÓA LÂM SÀNG",
    sampleType: "Huyết thanh",
    sampleTime: "07:50 - 20/10/2026",
    resultTime: "08:35 - 20/10/2026",
    techName: "KTV. Phạm Anh Tuấn",
    approvedBy: "TS.BS. Lê Hoàng Long",
    type: "TABLE",
    parameters: [
      { name: "Cholesterol toàn phần", value: "6.24", unit: "mmol/L", ref: "3.90 - 5.20", status: "HIGH", alert: "Tăng cao" },
      { name: "Triglycerid", value: "2.85", unit: "mmol/L", ref: "0.46 - 1.88", status: "HIGH", alert: "Tăng cao" },
      { name: "HDL - Cholesterol (Mỡ tốt)", value: "1.08", unit: "mmol/L", ref: "> 1.03", status: "NORMAL" },
      { name: "LDL - Cholesterol (Mỡ xấu)", value: "3.86", unit: "mmol/L", ref: "< 3.40", status: "HIGH", alert: "Tăng" }
    ],
    conclusion: "Rối loạn lipid máu hỗn hợp (Tăng Cholesterol và Triglycerid). Khuyến nghị điều chỉnh lối sống và dùng nhóm Statin theo phác đồ."
  },
  "XN-SH-01": {
    testName: "ĐỊNH LƯỢNG GLUCOSE MÁU TĨNH MẠCH",
    dept: "KHOA SINH HÓA LÂM SÀNG",
    sampleType: "Huyết tương (Sodium Fluoride)",
    sampleTime: "07:50 - 20/10/2026",
    resultTime: "08:25 - 20/10/2026",
    techName: "KTV. Hoàng Thị Yến",
    approvedBy: "TS.BS. Lê Hoàng Long",
    type: "TABLE",
    parameters: [
      { name: "Glucose máu lúc đói", value: "6.85", unit: "mmol/L", ref: "3.90 - 6.40", status: "HIGH", alert: "Tăng nhẹ" },
      { name: "HbA1c (Định lượng glycohemoglobin)", value: "6.6", unit: "%", ref: "4.0 - 6.0", status: "HIGH", alert: "Tiền ĐTĐ" }
    ],
    conclusion: "Đường huyết đói tăng nhẹ trên ngưỡng bình thường. Cần theo dõi đường huyết sau ăn và duy trì chế độ giảm đường bột."
  },
  "XN-SH-02": {
    testName: "ĐO HOẠT ĐỘ MEN GAN (AST/ALT/GGT)",
    dept: "KHOA SINH HÓA LÂM SÀNG",
    sampleType: "Huyết thanh",
    sampleTime: "07:50 - 20/10/2026",
    resultTime: "08:30 - 20/10/2026",
    techName: "KTV. Phạm Anh Tuấn",
    approvedBy: "TS.BS. Lê Hoàng Long",
    type: "TABLE",
    parameters: [
      { name: "AST (SGOT)", value: "28.4", unit: "U/L", ref: "< 37.0", status: "NORMAL" },
      { name: "ALT (SGPT)", value: "32.1", unit: "U/L", ref: "< 40.0", status: "NORMAL" },
      { name: "GGT (Gamma GT)", value: "36.5", unit: "U/L", ref: "< 50.0", status: "NORMAL" }
    ],
    conclusion: "Chức năng men gan trong giới hạn bình thường. Tế bào gan không bị tổn thương hoại tử cấp."
  },
  "XN-SH-04": {
    testName: "ĐỊNH LƯỢNG URE & CREATININ (ĐÁNH GIÁ CHỨC NĂNG THẬN)",
    dept: "KHOA SINH HÓA LÂM SÀNG",
    sampleType: "Huyết thanh",
    sampleTime: "07:50 - 20/10/2026",
    resultTime: "08:30 - 20/10/2026",
    techName: "KTV. Hoàng Thị Yến",
    approvedBy: "TS.BS. Lê Hoàng Long",
    type: "TABLE",
    parameters: [
      { name: "Ure máu", value: "5.6", unit: "mmol/L", ref: "2.5 - 7.5", status: "NORMAL" },
      { name: "Creatinin huyết thanh", value: "74.2", unit: "µmol/L", ref: "53.0 - 106.0", status: "NORMAL" },
      { name: "eGFR (Mức lọc cầu thận ước tính)", value: "93.5", unit: "mL/phút/1.73m²", ref: "> 90.0", status: "NORMAL" }
    ],
    conclusion: "Chức năng lọc của cầu thận bình thường (Giai đoạn 1 - eGFR > 90)."
  },
  "CDHA-ECG": {
    testName: "PHIẾU GHI ĐIỆN TÂM ĐỒ 12 CHUYỂN ĐẠO (ECG)",
    dept: "KHOA THĂM DÒ CHỨC NĂNG & TIM MẠCH",
    sampleType: "Điện sinh lý tim (12 Leaded)",
    sampleTime: "07:55 - 20/10/2026",
    resultTime: "08:15 - 20/10/2026",
    techName: "KTV. Nguyễn Thu Trang",
    approvedBy: "PGS.TS. Đinh Công Hải",
    type: "IMAGING",
    findings: [
      { title: "Tần số tim (Ventricular Rate)", detail: "78 nhịp/phút (chu kỳ đều)" },
      { title: "Nhịp tim (Rhythm)", detail: "Nhịp xoang (Sinus rhythm)" },
      { title: "Trục điện tim (Axis)", detail: "Trục trung gian (Góc alpha = +52 độ)" },
      { title: "Sóng P", detail: "Thời gian 0.08s, biên độ 1.2mm, chuyển đạo DII dương rõ" },
      { title: "Khoảng PR (PR Interval)", detail: "0.15 giây (Bình thường: 0.12 - 0.20s)" },
      { title: "Phức bộ QRS (QRS Duration)", detail: "0.08 giây, không có dạng block nhánh" },
      { title: "Đoạn ST - Sóng T", detail: "Đoạn ST đẳng điện, sóng T dương ở DI, DII, V4-V6. Không phát hiện biến đổi thiếu máu cơ tim cấp" }
    ],
    conclusion: "Điện tâm đồ nhịp xoang đều tần số 78 chu kỳ/phút. Hiện tại chưa thấy rối loạn dẫn truyền hoặc hình ảnh thiếu máu cơ tim cục bộ cấp tính."
  },
  "CDHA-SATM": {
    testName: "PHIẾU KẾT QUẢ SIÊU ÂM DOPPLER TIM",
    dept: "KHOA THĂM DÒ CHỨC NĂNG - BUỒNG SIÊU ÂM TIM",
    sampleType: "Siêu âm qua thành ngực (TTE)",
    sampleTime: "08:10 - 20/10/2026",
    resultTime: "08:45 - 20/10/2026",
    techName: "ThS.BS. Vũ Thị Hồng Hạnh",
    approvedBy: "PGS.TS. Đinh Công Hải",
    type: "IMAGING",
    findings: [
      { title: "Kích thước các buồng tim", detail: "Đường kính thất trái tâm trương (Dd) = 46 mm; tâm thu (Ds) = 28 mm; Nhĩ trái (LA) = 33 mm; Thất phải (RVD) = 19 mm" },
      { title: "Chức năng tâm thu thất trái", detail: "Phân suất tống máu EF = 64% (Teichholz), phân suất co rút FS = 36%" },
      { title: "Vận động vùng thành tim", detail: "Vách liên thất và thành sau thất trái vận động đồng bộ, không giảm động vùng" },
      { title: "Hệ thống van tim", detail: "Van 2 lá mềm mại, hở nhẹ 1/4 cơ năng; Van ĐMC 3 lá van đóng kín tốt; Không hẹp van" },
      { title: "Áp lực động mạch phổi", detail: "PAPs ước tính = 24 mmHg (Không tăng áp lực ĐMP)" },
      { title: "Màng ngoài tim", detail: "Khoang màng ngoài tim không có dịch" }
    ],
    conclusion: "Chức năng tâm thu thất trái bảo tồn (EF = 64%). Hở van hai lá nhẹ 1/4 sinh lý. Không tăng áp lực động mạch phổi."
  },
  "CDHA-XQN": {
    testName: "PHIẾU KẾT QUẢ CHỤP X-QUANG NGỰC THẲNG (CR/DR)",
    dept: "KHOA CHẨN ĐOÁN HÌNH ẢNH (TÒA A2 - TẦNG B1)",
    sampleType: "Phim kỹ thuật số DR liều thấp",
    sampleTime: "08:00 - 20/10/2026",
    resultTime: "08:30 - 20/10/2026",
    techName: "KTV. Hoàng Thị Yến",
    approvedBy: "BS.CKII. Trần Quang Hưng",
    type: "IMAGING",
    findings: [
      { title: "Trường phổi hai bên", detail: "Hai phế trường sáng đều, rốn phổi hai bên đậm vừa, không thấy hình mờ thâm nhiễm hay nốt tổn thương khu trú" },
      { title: "Bóng tim & Trung thất", detail: "Chỉ số tim/lồng ngực trong giới hạn bình thường (CTR < 0.50). Trung thất không giãn" },
      { title: "Quai động mạch chủ", detail: "Động mạch chủ ngực bình thường, không thấy vôi hóa quai" },
      { title: "Góc sườn hoành", detail: "Hai góc sườn hoành hai bên sáng nhọn, vòm hoành đều" },
      { title: "Khung xương lồng ngực", detail: "Các cung sườn liên tục, không thấy gãy xương hay tổn thương hủy xương" }
    ],
    conclusion: "Hình ảnh tim phổi trên phim chụp X-quang hiện tại trong giới hạn bình thường."
  }
};

export const MOCK_PARACLINICAL_REQUESTS = [
  {
    reqId: "REQ-2026-001",
    patientId: "BN-2024-0245",
    patientName: "Đặng Văn Minh",
    gender: "Nam",
    age: 41,
    phone: "0972 119 883",
    testCode: "XN-SH-04",
    testName: "Bộ men gan AST/ALT & GGT",
    category: "BIOCHEMISTRY",
    orderRoom: "Phòng 204 - PGS.TS Nguyễn Văn Trung",
    orderedAt: "08:45 - 20/10/2026",
    status: "IN_PROGRESS", // Đang chạy máy
    priority: "NORMAL",
    hasInsurance: true,
    insuranceNumber: "DN4010667788990",
    sampleTakenTime: "08:55",
    note: "Nghi ngờ tổn thương tế bào gan do rượu/mỡ máu"
  },
  {
    reqId: "REQ-2026-002",
    patientId: "BN-2024-0245",
    patientName: "Đặng Văn Minh",
    gender: "Nam",
    age: 41,
    phone: "0972 119 883",
    testCode: "XN-HH-01",
    testName: "Tổng phân tích tế bào máu ngoại vi (24 thông số)",
    category: "HEMATOLOGY",
    orderRoom: "Phòng 204 - PGS.TS Nguyễn Văn Trung",
    orderedAt: "08:45 - 20/10/2026",
    status: "PENDING", // Chờ tiếp nhận / Lấy mẫu máu
    priority: "NORMAL",
    hasInsurance: true,
    insuranceNumber: "DN4010667788990",
    sampleTakenTime: null,
    note: "Kiểm tra chỉ số dòng hồng cầu & bạch cầu"
  },
  {
    reqId: "REQ-2026-003",
    patientId: "BN-2024-0102",
    patientName: "Trần Đình Trọng",
    gender: "Nam",
    age: 62,
    phone: "0983 112 233",
    testCode: "XN-SH-03",
    testName: "Bộ mỡ máu toàn phần (Lipid profile)",
    category: "BIOCHEMISTRY",
    orderRoom: "Phòng 204 - PGS.TS Nguyễn Văn Trung",
    orderedAt: "08:20 - 20/10/2026",
    status: "COMPLETED", // Đã duyệt & trả kết quả về phòng 204
    priority: "NORMAL",
    hasInsurance: true,
    insuranceNumber: "HT3010992837119",
    sampleTakenTime: "08:30",
    completedAt: "09:05",
    approvedBy: "BS CKI. Lê Thị Hải Hà",
    resultSummary: "Triglyceride tăng 2.85 mmol/L, Cholesterol TP 6.2 mmol/L"
  },
  {
    reqId: "REQ-2026-004",
    patientId: "BN-2024-0102",
    patientName: "Trần Đình Trọng",
    gender: "Nam",
    age: 62,
    phone: "0983 112 233",
    testCode: "CDHA-ECG",
    testName: "Điện tâm đồ thông thường (ECG 12 chuyển đạo)",
    category: "FUNCTIONAL",
    orderRoom: "Phòng 204 - PGS.TS Nguyễn Văn Trung",
    orderedAt: "08:20 - 20/10/2026",
    status: "COMPLETED",
    priority: "NORMAL",
    hasInsurance: true,
    insuranceNumber: "HT3010992837119",
    sampleTakenTime: "08:25",
    completedAt: "08:50",
    approvedBy: "BS CKI. Lê Thị Hải Hà",
    resultSummary: "Nhịp xoang 78 chu kỳ/phút, trục trung gian"
  },
  {
    reqId: "REQ-2026-005",
    patientId: "BN-2024-0231",
    patientName: "Vũ Thị Ngọc Lan",
    gender: "Nữ",
    age: 56,
    phone: "0918 334 556",
    testCode: "CDHA-XQN",
    testName: "Chụp X-quang ngực thẳng kỹ thuật số (CR/DR)",
    category: "IMAGING",
    orderRoom: "Phòng 204 - PGS.TS Nguyễn Văn Trung",
    orderedAt: "08:35 - 20/10/2026",
    status: "COMPLETED",
    priority: "HIGH",
    hasInsurance: true,
    insuranceNumber: "DN4010334455667",
    sampleTakenTime: "08:45",
    completedAt: "09:15",
    approvedBy: "BS CKI. Lê Thị Hải Hà",
    resultSummary: "Bóng tim không to, trường phổi sáng đều"
  },
  {
    reqId: "REQ-2026-006",
    patientId: "BN-2024-0145",
    patientName: "Lê Hoàng Phúc",
    gender: "Nam",
    age: 29,
    phone: "0904 889 900",
    testCode: "CDHA-SATM",
    testName: "Siêu âm Doppler Tim qua thành ngực",
    category: "IMAGING",
    orderRoom: "Phòng 204 - PGS.TS Nguyễn Văn Trung",
    orderedAt: "09:00 - 20/10/2026",
    status: "PENDING", // Chờ bệnh nhân vào phòng siêu âm
    priority: "NORMAL",
    hasInsurance: false,
    insuranceNumber: "",
    sampleTakenTime: null,
    note: "Kiểm tra cấu trúc buồng tim & van tim"
  },
  {
    reqId: "REQ-2026-007",
    patientId: "BN-2024-0158",
    patientName: "Vũ Thị Hương",
    gender: "Nữ",
    age: 71,
    phone: "0977 445 566",
    testCode: "CDHA-XQN",
    testName: "Chụp X-quang khớp gối 2 bên thẳng nghiêng",
    category: "IMAGING",
    orderRoom: "Phòng 205 - ThS.BS Trần Văn An",
    orderedAt: "09:10 - 20/10/2026",
    status: "IN_PROGRESS", // Đang chụp trong phòng X-quang
    priority: "HIGH",
    hasInsurance: true,
    insuranceNumber: "GD4010582910482",
    sampleTakenTime: "09:15",
    note: "Thoái hóa khớp gối nặng, gai xương"
  }
];


