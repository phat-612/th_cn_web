const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const User = require("../model/User");
const Score = require("../model/Score");
const Standard = require("../model/Standard");
const { drive } = require("../../helper/db");

class UserController {
  showRegister(req, res) {
    res.render("register");
  }
  showLogin(req, res) {
    res.render("login");
  }
  showProfile(req, res) {
    if (req.session.role === 0) {
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
    } else {
      Score.findOne({ idUser: req.session.idUser })
        .populate({
          path: "idUser",
        })
        .then((score) => {
          if (!score) {
            return res.redirect("/logout");
          }
          res.render("profile", {
            user: {
              ...score.idUser.toObject(),
              password: "",
              repeatPassword: "",
              _id: undefined,
              username: "",
              userScore: score.userScore,
              adminScore: score.adminScore,
              status: score.status,
            },
            message: req.flash("message")[0],
          });
        });
    }
  }
  showEvaluate(req, res) {
    Promise.all([
      Standard.find(),
      Score.findOne({ idUser: req.session.idUser }),
    ]).then(([standards, score]) => {
      res.render("evaluate", {
        role: req.session.role,
        standards: standards.map((standard) => standard.toObject()),
        user: score.user.map((item) => item.toObject()),
      });
    });
  }
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
  storeUser(req, res) {
    const formData = req.body;
    if (formData.password !== formData.repeatPassword) {
      return res.render("register", {
        errorMessage: "Mật khẩu không khớp",
      });
    }
    User.findOne({ username: formData.username }).then((user) => {
      if (user) {
        return res.render("register", {
          errorMessage: "Tài khoản đã đã tồn tại",
          user: {
            ...formData,
            password: "",
            repeatPassword: "",
          },
        });
      }
      const saltRounds = 10;
      const hashPassword = bcrypt.hashSync(formData.password, saltRounds);
      formData.password = hashPassword;
      const newUser = new User(formData);
      newUser
        .save()
        .then((data) => {
          const idUser = data._id;
          if (formData.role != 0) {
            const newScore = new Score({ idUser });
            newScore.save();
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
  authLogin(req, res) {
    const formData = req.body;
    User.findOne({ username: formData.username }).then((user) => {
      if (!user) {
        return res.render("login", {
          errorMessage: "Thông tin đăng nhập không chính xác",
          username: formData.username,
        });
      }
      const isMatch = bcrypt.compareSync(formData.password, user.password);
      if (!isMatch) {
        return res.render("login", {
          errorMessage: "Thông tin đăng nhập không chính xác",
          username: formData.username,
        });
      }
      req.session.idUser = user._id;
      req.session.role = user.role;
      res.redirect("/profile");
    });
  }
  changePassword(req, res, next) {
    const formData = req.body;
    if (formData.newPassword !== formData.repeatNewPassword) {
      req.flash("message", {
        type: "danger",
        message: "Mật khẩu mới không khớp",
      });
      return res.redirect("/profile");
    }
    User.findOne({ _id: req.session.idUser }).then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      const isMatch = bcrypt.compareSync(formData.oldPassword, user.password);
      if (!isMatch) {
        req.flash("message", {
          type: "danger",
          message: "Mật khẩu cũ không chính xác",
        });
        return res.redirect("/profile");
      }
      const saltRounds = 10;
      const hashPassword = bcrypt.hashSync(formData.newPassword, saltRounds);
      User.updateOne(
        { _id: req.session.idUser },
        { password: hashPassword }
      ).then(() => {
        req.flash("message", {
          type: "success",
          message: "Đổi mật khẩu thành công",
        });
        res.redirect("/profile");
      });
    });
  }
  changeAvatar(req, res) {
    if (!req.fileId) {
      req.flash("message", {
        type: "danger",
        message: "Có lỗi xảy ra, vui lòng thử lại",
      });
      return res.redirect("/profile");
    }
    User.findOne({ _id: req.session.idUser })
      .then(async (user) => {
        if (user.avatar) {
          const idAvatar = user.avatar.split("id=")[1];
          if (idAvatar) {
            await drive().files.delete({ fileId: idAvatar });
          }
        }
      })
      .then(() => {
        User.updateOne(
          { _id: req.session.idUser },
          { avatar: `https://drive.google.com/thumbnail?id=${req.fileId}` }
        ).then(() => {
          req.flash("message", {
            type: "success",
            message: "Thay đổi ảnh đại diện thành công",
          });
          res.redirect("/profile");
        });
      });
  }
  updateProfile(req, res) {
    const formData = req.body;
    User.updateOne(
      { _id: req.session.idUser },
      {
        hoten: formData.hoten,
        gioitinh: formData.gioitinh,
        ngaysinh: formData.ngaysinh,
        quequan: formData.quequan,
      }
    ).then(() => {
      req.flash("message", {
        type: "success",
        message: "Cập nhật thông tin thành công",
      });
      res.redirect("/profile");
    });
  }
  updateEvaluate(req, res) {
    const formData = req.body;
    const idUser = req.session.idUser;
    const totalScore = formData.user.reduce(
      (total, item) => (item.check ? total + 10 : total),
      0
    );
    Score.updateOne(
      { idUser, status: false },
      { user: formData.user, userScore: totalScore }
    ).then((result) => {
      if (result.modifiedCount === 0) {
        req.flash("message", {
          type: "danger",
          message: "Đánh giá không thành công do đã được duyệt bởi admin",
        });
        return res.redirect("/profile");
      }
      req.flash("message", {
        type: "success",
        message: "Đánh giá thành công",
      });
      res.redirect("/profile");
    });
  }
}
module.exports = new UserController();
