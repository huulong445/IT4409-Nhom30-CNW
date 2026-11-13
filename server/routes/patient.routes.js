const express = require("express");
const patientController = require("../controllers/patient.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorization } = require("../middlewares/rbac.middleware");
const { ROLES } = require("../config/roles");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorization(ROLES.PATIENT),
  patientController.createPatient,
);

module.exports = router;