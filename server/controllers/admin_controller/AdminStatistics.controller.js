const statisticsModel = require("../../models/admin_model/AdminStatistics.model");

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const getPeriod = (query) => {
  const { from, to } = query;
  if ((from !== undefined && !isValidDate(from)) ||
      (to !== undefined && !isValidDate(to))) {
    return { error: "from/to phải là ngày hợp lệ theo định dạng YYYY-MM-DD" };
  }
  if (from && to && from > to) {
    return { error: "from không được sau to" };
  }
  return { period: { from, to } };
};

const getThreshold = (query) => {
  const raw = query.threshold === undefined ? "100" : query.threshold;
  if (typeof raw !== "string" || !/^(0|[1-9]\d*)$/.test(raw) ||
      Number(raw) > 2147483647) {
    return { error: "threshold phải là số nguyên không âm" };
  }
  return { threshold: Number(raw) };
};

const handleError = (res, error) => {
  console.error("AdminStatistics:", error.message);
  return fail(res, 500, "Lỗi server khi lấy số liệu thống kê");
};

// GET /api/v1/admin/statistics/overview?from=2026-10-01&to=2026-10-31
const getOverview = async (req, res) => {
  const { period, error } = getPeriod(req.query);
  if (error) return fail(res, 400, error);
  const { threshold, error: thresholdError } = getThreshold(req.query);
  if (thresholdError) return fail(res, 400, thresholdError);
  try {
    const [visits, staff, medicines] = await Promise.all([
      statisticsModel.getVisitSummary(period),
      statisticsModel.getStaffSummary(),
      statisticsModel.getMedicineSummary(threshold),
    ]);
    return res.json({ success: true, data: {
      period: { from: period.from || null, to: period.to || null },
      visits,
      staff,
      medicines,
    }});
  } catch (err) { return handleError(res, err); }
};

// GET /api/v1/admin/statistics/doctors?from=2026-10-01&to=2026-10-31
const getDoctorStatistics = async (req, res) => {
  const { period, error } = getPeriod(req.query);
  if (error) return fail(res, 400, error);
  try {
    const data = await statisticsModel.getVisitsByDoctor(period);
    return res.json({ success: true, data });
  } catch (err) { return handleError(res, err); }
};

// GET /api/v1/admin/statistics/staff
const getStaffStatistics = async (_req, res) => {
  try {
    return res.json({ success: true, data: await statisticsModel.getStaffSummary() });
  } catch (err) { return handleError(res, err); }
};

// GET /api/v1/admin/statistics/low-stock?threshold=100
const getLowStock = async (req, res) => {
  const { threshold, error } = getThreshold(req.query);
  if (error) return fail(res, 400, error);
  try {
    const data = await statisticsModel.getLowStockMedicines(threshold);
    return res.json({ success: true, threshold, total: data.length, data });
  } catch (err) { return handleError(res, err); }
};

module.exports = {
  getOverview,
  getDoctorStatistics,
  getStaffStatistics,
  getLowStock,
};
