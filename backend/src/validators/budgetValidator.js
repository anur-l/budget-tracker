const ALLOWED_CATEGORIES = [
  "rent",
  "food",
  "transport",
  "utilities",
  "entertainment",
  "shopping",
  "health",
  "education",
  "other",
];

const validBudget = (type, category, amount, date, isUpdate = false) => {
  if (type !== undefined) {
    if (type !== "income" && type !== "expense") {
      return { success: false, msg: "Type must be income or expense" };
    }
  } else if (!isUpdate) {
    return { success: false, msg: "Type is required" };
  }

  if (category !== undefined) {
    if (!ALLOWED_CATEGORIES.includes(category.toLowerCase())) {
      return { success: false, msg: "Invalid category selection" };
    }
  } else if (!isUpdate) {
    return { success: false, msg: "Category is required" };
  }

  if (amount !== undefined) {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      return { success: false, msg: "Amount must be a positive number" };
    }
  } else if (!isUpdate) {
    return { success: false, msg: "Amount is required" };
  }

  if (date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { success: false, msg: "Use YYYY-MM-DD format" };
    }

    const parts = date.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return { success: false, msg: "Invalid date values" };
    }
    if (month < 1 || month > 12) {
      return { success: false, msg: "Month must be between 1 and 12" };
    }
    if (day < 1 || day > 31) {
      return { success: false, msg: "Invalid day value" };
    }
    if (!isUpdate) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (year !== currentYear || month !== currentMonth) {
        return {
          success: false,
          msg: `Transactions can only be added for ${currentYear}-${String(currentMonth).padStart(2, "0")} (current month)`,
        };
      }
    }
  } else if (!isUpdate) {
    return { success: false, msg: "Date is required" };
  }

  return { success: true, msg: "Valid" };
};

module.exports = validBudget;
