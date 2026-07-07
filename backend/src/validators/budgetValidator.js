const validBudget = (type, category, amount, date) => {
  if (type !== "income" && type !== "expense") {
    return { success: false, msg: "It should be expense or income" };
  }
  if (category.length < 3 || category.length > 20) {
    return { success: false, msg: "Enter the correct format" };
  }
  if (!parseFloat(amount)) {
    return { success: false, msg: "It must be integer or float" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { success: false, msg: "Correct should be format YYYY-MM-DD" };
  }

  const dateint = date.replace(/-/g, "");
  let year = dateint.slice(0, 4);
  let month = dateint.slice(4, 6);
  let day = dateint.slice(6);
  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);
  const currentYear = new Date().getFullYear();
  if (
    year < 2020 ||
    year > currentYear ||
    month < 0 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return { success: false, msg: "Correct should be format YYYY-MM-DD" };
  }

  return { success: true, msg: "All data is valid" };
};

module.exports = validBudget;
