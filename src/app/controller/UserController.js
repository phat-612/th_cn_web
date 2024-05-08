const User = require("../model/User");
const Standard = require("../model/Standard");

class UserController {
  showRegister(req, res) {
    res.render("register");
  }
  showLogin(req, res) {
    res.render("login");
  }
  showProfile(req, res) {
    User.findOne({ _id: req.session.idUser }).then((user) => {
      if (!user) {
        return res.redirect("/logout");
      }
      res.render("profile", {
        user: {
          ...user.toObject(),
          password: "",
          repeatPassword: "",
          _id: undefined,
          username: "",
        },
        message: req.flash("message")[0],
      });
    });
  }
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
}
module.exports = new UserController();
