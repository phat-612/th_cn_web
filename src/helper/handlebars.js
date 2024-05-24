const moment = require("moment");
module.exports = {
  showGioiTinh: function (gioitinh) {
    if (gioitinh == 0 || !gioitinh) {
      return "Nam";
    }
    return "Nữ";
  },
  showRole: function (role) {
    switch (parseInt(role)) {
      case 0:
        return "Admin";
      case 1:
        return "Hội viên";
      default:
        return "Hội viên";
    }
  },
  showSTT: function (value) {
    return value + 1;
  },
  showTotalScore: (total) => {
    if (total) {
      return total;
    }
    return "Chưa đánh giá";
  },
  checkCheckbox: function (value) {
    return !!value ? "checked" : "";
  },
  selectedSelect: function (value, check) {
    return value == check ? "selected" : "";
  },
  compare: (a, b) => a == b,
  negate: function (value) {
    return !value;
  },
  statusToast: (type) => {
    if (type == "success") {
      return "bg-success";
    }
    return "bg-danger";
  },
  selectGioiTinh: (gioitinh, value) => {
    if (gioitinh == value) {
      return "selected";
    }
    return "";
  },
  selectedOption: (value, check) => {
    if (typeof value != "string" || typeof value != "number") {
      value = value.toString();
    }
    if (typeof check != "string" || typeof check != "number") {
      check = check.toString();
    }
    return value == check ? "selected" : "";
  },
  selectedOptionId: (value, check) => {
    return value.toString() == check.toString() ? "selected" : "";
  },
  actionEvaluate: (role) =>
    role == 0
      ? "/admin/evaluate?_method=PATCH"
      : "/user/evaluate?_method=PATCH",

  formatDate: function (date, format) {
    const dateMoment = moment(date);
    return dateMoment.format(format);
  },
  // view Standard
  getTotalScore: (criterias) => {
    return criterias.reduce((total, criteria) => total + criteria.score, 0);
  },
  getGender: (gender) => {
    return gender ? "Nữ" : "Nam";
  },
  getStatusReviewUser: (status) => {
    if (status) {
      return "Đã duyệt";
    }
    return "Chưa duyệt";
  },
  getStatusReview: (status) => {
    console.log(status);
    if (status) {
      return "Đang diễn ra";
    }
    return "Đã kết thúc";
  },
  // end view Standard
  consoleHbs: (value) => {
    console.log(value);
  },
};
