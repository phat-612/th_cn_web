module.exports = {
  showGioiTinh: function (gioitinh) {
    if (gioitinh == 0) {
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
  checkCheckbox: (idStandard, user) => {
    const standard = user.find(
      (item) => item.idStandard.toString() == idStandard.toString()
    );
    if (standard) {
      return standard.check ? "checked" : "";
    }
    return "";
  },
};
