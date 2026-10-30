const ROLES = Object.freeze({
  PATIENT: "PATIENT",
  DOCTOR: "DOCTOR",
  RECEPTIONIST: "RECEPTIONIST",
  LAB_TECH: "LAB_TECH",
  ADMIN: "ADMIN",
});

const ALLOWED_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALLOWED_ROLES };