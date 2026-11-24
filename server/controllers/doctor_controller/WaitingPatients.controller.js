const { getWaitingPatientsByDoctorAndDate } = require("../../models/doctor_model/WaitingPatients.model.js");

exports.GetWaitingPatients = async (req, res) => {
    try {
        const { date } = req.query;
        const doctor_id = req.user.staff_id;
        const parsedDate =
            typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
                ? new Date(`${date}T00:00:00.000Z`)
                : null;
        
        if (!doctor_id) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản bác sĩ chưa được liên kết với hồ sơ nhân viên",
            });
        }

        if (
            !parsedDate ||
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== date
        ) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng cung cấp date hợp lệ theo định dạng YYYY-MM-DD",
            });
        }

        const patients = await getWaitingPatientsByDoctorAndDate(doctor_id, date);

        return res.status(200).json({
            success: true,
            data: patients
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};