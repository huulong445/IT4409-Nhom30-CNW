const db = require("../../config/db.config");

// Thống kê lượt khám theo ngày hẹn khám (không phải ngày tạo lịch).
const buildDateConditions = (alias, { from, to }, prefix = "WHERE") => {
  const conditions = [];
  const params = [];
  if (from) {
    conditions.push(`${alias}.appointment_date >= ?`);
    params.push(from);
  }
  if (to) {
    conditions.push(`${alias}.appointment_date <= ?`);
    params.push(to);
  }
  return {
    sql: conditions.length ? ` ${prefix} ${conditions.join(" AND ")}` : "",
    params,
  };
};

const getVisitSummary = async (period) => {
  const filter = buildDateConditions("a", period);
  const [rows] = await db.query(
    `SELECT
       COUNT(*) AS total_appointments,
       COALESCE(SUM(a.status = 'COMPLETED'), 0) AS completed_visits,
       COALESCE(SUM(a.status = 'PENDING'), 0) AS pending,
       COALESCE(SUM(a.status = 'IN_PROGRESS'), 0) AS in_progress,
       COALESCE(SUM(a.status = 'CANCELLED'), 0) AS cancelled
     FROM appointments a${filter.sql}`,
    filter.params
  );
  const row = rows[0];
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, Number(value)]));
};

const getVisitsByDoctor = async (period) => {
  // Đặt bộ lọc ngày trong ON để bác sĩ chưa có lượt khám vẫn xuất hiện với số 0.
  const filter = buildDateConditions("a", period, "AND");
  const [rows] = await db.query(
    `SELECT s.staff_id AS doctor_id,
            s.full_name AS doctor_name,
            d.department_name,
            COUNT(a.appointment_id) AS total_appointments,
            COALESCE(SUM(a.status = 'COMPLETED'), 0) AS completed_visits
     FROM staff s
     JOIN users u ON u.user_id = s.user_id AND u.role = 'DOCTOR'
     JOIN departments d ON d.department_id = s.department_id
     LEFT JOIN appointments a ON a.doctor_id = s.staff_id${filter.sql}
     GROUP BY s.staff_id, s.full_name, d.department_name
     ORDER BY completed_visits DESC, s.staff_id ASC`,
    filter.params
  );
  return rows.map((row) => ({
    ...row,
    total_appointments: Number(row.total_appointments),
    completed_visits: Number(row.completed_visits),
  }));
};

const getStaffSummary = async () => {
  const [[totalRows], [roleRows], [departmentRows]] = await Promise.all([
    db.query("SELECT COUNT(*) AS total FROM staff"),
    db.query(
      `SELECT u.role, COUNT(*) AS total
       FROM staff s JOIN users u ON u.user_id = s.user_id
       GROUP BY u.role ORDER BY u.role`
    ),
    db.query(
      `SELECT d.department_id, d.department_name, COUNT(s.staff_id) AS total
       FROM departments d
       LEFT JOIN staff s ON s.department_id = d.department_id
       GROUP BY d.department_id, d.department_name
       ORDER BY d.department_id`
    ),
  ]);
  return {
    total: Number(totalRows[0].total),
    by_role: roleRows.map((row) => ({ ...row, total: Number(row.total) })),
    by_department: departmentRows.map((row) => ({ ...row, total: Number(row.total) })),
  };
};

// schema_new.sql chưa có định mức riêng cho từng thuốc: tạm dùng ngưỡng chung.
const getMedicineSummary = async (threshold) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(quantity < ?), 0) AS low_stock,
            COALESCE(SUM(quantity = 0), 0) AS out_of_stock
     FROM medicine`,
    [threshold]
  );
  return {
    total: Number(rows[0].total),
    low_stock: Number(rows[0].low_stock),
    out_of_stock: Number(rows[0].out_of_stock),
    threshold,
  };
};

const getLowStockMedicines = async (threshold) => {
  const [rows] = await db.query(
    `SELECT med_id, name, unit, unit_price, quantity,
            (? - quantity) AS shortage,
            CASE WHEN quantity = 0 THEN 'OUT_OF_STOCK' ELSE 'LOW_STOCK' END AS stock_status
     FROM medicine
     WHERE quantity < ?
     ORDER BY quantity ASC, med_id ASC`,
    [threshold, threshold]
  );
  return rows.map((row) => ({ ...row, shortage: Number(row.shortage) }));
};

module.exports = {
  getVisitSummary,
  getVisitsByDoctor,
  getStaffSummary,
  getMedicineSummary,
  getLowStockMedicines,
};
