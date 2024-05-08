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
  checkCheckbox: function (value) {
    return !!value ? "checked" : "";
  },
  selectedSelect: function (value, check) {
    return value == check ? "selected" : "";
  },
  compare: (a, b) => a == b,
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
  // end view Standard
  consoleHandlebars: (value) => {
    console.log(value);
  },
};
