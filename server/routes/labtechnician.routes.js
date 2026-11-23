
const express = require('express');
const router = express.Router();

const LabProcessController = require('../controllers/labtechnician_controller/LabProcess.controller');

// Nhập kết quả xét nghiệm
router.post(
    '/lab/process',
    LabProcessController.CreateLabResult
);

// Xem kết quả xét nghiệm
router.get(
    '/lab/process',
    LabProcessController.GetLabResult
);

// Cập nhật kết quả xét nghiệm
router.put(
    '/lab/process',
    LabProcessController.UpdateLabResult
);

router.put(
    '/lab/status',
    LabProcessController.updateStatusToProcessing
);

module.exports = router;
