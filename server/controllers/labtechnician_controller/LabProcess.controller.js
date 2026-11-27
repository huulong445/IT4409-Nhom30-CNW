
const LabProcessModel = require('../../models/labtechnician_model/LabProcess.model.js');

const LabProcessController = {
    // POST /api/lab/process
    // Nhập kết quả xét nghiệm
    CreateLabResult: async (req, res) => {
        try {
            const {
                lab_request_id,
                lab_tech_id,
                result_data,
                attachment_url
            } = req.body;

            if (
                !lab_request_id ||
                !lab_tech_id ||
                result_data === undefined ||
                result_data === null
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp lab_request_id, lab_tech_id và result_data'
                });
            }

            if (
                typeof result_data !== 'object' ||
                Array.isArray(result_data)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'result_data phải là một JSON object'
                });
            }

            const result = await LabProcessModel.create({
                lab_request_id,
                lab_tech_id,
                result_data,
                attachment_url
            });

            return res.status(201).json({
                success: true,
                message: 'Nhập kết quả xét nghiệm thành công',
                result_id: result.insertId
            });

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // GET /api/lab/process?lab_request_id=1
    // Xem kết quả xét nghiệm
    GetLabResult: async (req, res) => {
        try {
            const { lab_request_id } = req.query;

            if (!lab_request_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp lab_request_id'
                });
            }

            const data = await LabProcessModel.getByRequestId(
                lab_request_id
            );

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'Chưa có kết quả xét nghiệm cho chỉ định này'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Lấy kết quả xét nghiệm thành công',
                data
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // PUT /api/lab/process?result_id=1
    // Cập nhật kết quả xét nghiệm
    UpdateLabResult: async (req, res) => {
        try {
            const { result_id } = req.query;
            const {
                result_data,
                attachment_url
            } = req.body;

            if (!result_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp result_id'
                });
            }

            if (
                result_data === undefined ||
                result_data === null ||
                typeof result_data !== 'object' ||
                Array.isArray(result_data)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'result_data phải là một JSON object'
                });
            }

            const result = await LabProcessModel.update(
                result_id,
                {
                    result_data,
                    attachment_url
                }
            );

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy kết quả xét nghiệm'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cập nhật kết quả xét nghiệm thành công'
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }, 

    updateStatusToProcessing: async (req, res) => {
        try {
            const { lab_request_id } = req.body;

            // Kiểm tra input
            if (!lab_request_id) {
                return res.status(400).json({
                    success: false,
                    message: 'lab_request_id là bắt buộc'
                });
            }

            // Gọi Model cập nhật trạng thái
            const result = await LabProcessModel.updateStatusToProcessing(
                lab_request_id
            );

            return res.status(200).json({
                success: true,
                message: 'Chuyển trạng thái chỉ định sang PROCESSING thành công',
                data: {
                    lab_request_id,
                    status: 'PROCESSING'
                }
            });

        } catch (error) {
            console.error('Update lab request status error:', error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = LabProcessController;
