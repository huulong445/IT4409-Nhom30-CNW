const express = require("express");
const patientController = require("../controllers/patient.controller");
const appointmentController = require("../controllers/appointment.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorization } = require("../middlewares/rbac.middleware");
const { ROLES } = require("../config/roles");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorization(ROLES.PATIENT),
  patientController.getOwnPatients,
);
router.get(
  "/availability",
  authenticate,
  authorization(ROLES.PATIENT),
  appointmentController.getAvailability,
);
router.post(
  "/",
  authenticate,
  authorization(ROLES.PATIENT),
  patientController.createPatient,
);
router.post(
  "/appointments",
  authenticate,
  authorization(ROLES.PATIENT),
  appointmentController.createAppointment,
);

module.exports = router;