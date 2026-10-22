import { getWaitingPatientsByDoctorAndDate } from "../../models/doctor_model/WaitingPatients.model";
// GET /api/doctor/appointments?doctor_id=1&date=2026-06-06
export const GetWaitingPatients = async (req, res) => {
    try {
        const { doctor_id, date } = req.query;
        
        if (!doctor_id || !date) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng cung cấp đầy đủ doctor_id và date" 
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