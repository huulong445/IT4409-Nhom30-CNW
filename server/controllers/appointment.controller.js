const appointmentModel = require("../models/appointment.model");

const parseId = (value) => {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    !/^[1-9]\d*$/.test(String(value))
  ) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

const parseAppointmentDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed < today) {
    return null;
  }

  return value;
};

const parseAppointmentTime = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(value);
  return match ? `${match[1]}:${match[2]}:${match[3] || "00"}` : null;
};

const createAppointment = async (req, res) => {
  const body = req.body;
  const allowedFields = [
    "patient_id",
    "doctor_id",
    "room_id",
    "appointment_date",
    "appointment_time",
  ];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu đặt lịch không hợp lệ",
    });
  }

  const unsupportedFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field),
  );
  if (unsupportedFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Không hỗ trợ các trường: ${unsupportedFields.join(", ")}`,
    });
  }

  const patient_id = parseId(body.patient_id);
  const doctor_id = parseId(body.doctor_id);
  const room_id = parseId(body.room_id);
  const appointment_date = parseAppointmentDate(body.appointment_date);
  const appointment_time = parseAppointmentTime(body.appointment_time);

  if (!patient_id || !doctor_id || !room_id) {
    return res.status(400).json({
      success: false,
      message: "patient_id, doctor_id và room_id phải là số nguyên dương",
    });
  }

  if (!appointment_date) {
    return res.status(400).json({
      success: false,
      message: "Ngày khám không hợp lệ hoặc đã qua",
    });
  }

  if (!appointment_time) {
    return res.status(400).json({
      success: false,
      message: "Giờ khám phải có định dạng HH:mm hoặc HH:mm:ss",
    });
  }

  const requestedTime = new Date(`${appointment_date}T${appointment_time}`);
  if (requestedTime <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Giờ khám phải ở trong tương lai",
    });
  }

  try {
    const appointment = await appointmentModel.createAppointment({
      patient_id,
      user_id: req.user.user_id,
      doctor_id,
      room_id,
      appointment_date,
      appointment_time,
    });

    if (!appointment) {
      throw new Error("Appointment was inserted but could not be retrieved");
    }

    return res.status(201).json({
      success: true,
      message: "Đặt lịch khám thành công",
      data: appointment,
    });
  } catch (error) {
    if (error.code === "PATIENT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ bệnh nhân thuộc tài khoản này",
      });
    }

    if (error.code === "DOCTOR_SLOT_UNAVAILABLE") {
      return res.status(409).json({
        success: false,
        message: "Bác sĩ không trực tại phòng này vào thời gian đã chọn",
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Bác sĩ đã có lịch khám vào khung giờ này",
      });
    }

    console.error("createAppointment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đặt lịch khám",
    });
  }
};

const getAvailability = async (req, res) => {
  const appointment_date = parseAppointmentDate(req.query.date);

  if (!appointment_date) {
    return res.status(400).json({
      success: false,
      message: "Ngày khám không hợp lệ hoặc đã qua",
    });
  }

  try {
    const availability =
      await appointmentModel.getDoctorAvailabilityByDate(appointment_date);

    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error("getAvailability:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch trực bác sĩ",
    });
  }
};

module.exports = { createAppointment, getAvailability };
