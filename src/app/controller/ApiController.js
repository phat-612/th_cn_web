const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const { drive } = require("../../helper/db");

const Standard = require("../model/Standard");
const User = require("../model/User");
const Session = require("../model/Session111");
const { default: mongoose } = require("mongoose");
class ApiController {
  // api user
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
      if (!user.active) {
        return res.render("login", {
          errorMessage: "Tài khoản chưa được kích hoạt",
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
        name: formData.name,
        gender: formData.gender,
        birthday: formData.birthday,
        hometown: formData.hometown,
      }
    ).then(() => {
      req.flash("message", {
        type: "success",
        message: "Cập nhật thông tin thành công",
      });
      res.redirect("/profile");
    });
  }
  updateActive(req, res) {
    User.updateOne(
      { _id: req.query.idUser },
      { active: req.query.checked }
    ).then(() => {
      res.json({ message: "success" });
    });
  }
  updateRole(req, res) {
    Session.findOne({ idUser: req.query.idUser }).then((session) => {
      console.log(session);
    });
    User.updateOne({ _id: req.query.idUser }, { role: req.query.role }).then(
      () => {
        res.json({ message: "success" });
      }
    );
  }
  // end api user
  // api admin
  // api standard
  storeStandard(req, res) {
    const formData = req.body;
    const newStandard = new Standard(formData);
    newStandard
      .save()
      .then(() => {
        res.redirect("/admin/standard");
      })
      .catch((err) => {
        console.error(err);
      });
  }
  updateStandard(req, res) {
    const formData = req.body;
    Standard.updateOne({ _id: req.query.idStandard }, formData).then(() => {
      res.redirect("/admin/standard");
    });
  }
  deleteStandard(req, res) {
    Standard.deleteOne({ _id: req.query.idStandard }).then(() => {
      res.redirect("/admin/standard");
    });
  }
  storeCriteria(req, res) {
    const formData = req.body;
    Standard.updateOne(
      { _id: req.body.idStandard },
      { $push: { criterias: formData.criterias } }
    ).then(() => {
      res.redirect("/admin/standard");
    });
  }
  updateCriteria(req, res) {
    const formData = req.body;
    Standard.updateOne(
      { "criterias._id": req.query.idCriteria },
      { $set: { "criterias.$": formData.criterias[0] } }
    ).then(() => {
      res.redirect("/admin/standard");
    });
  }
  deleteCriteria(req, res) {
    Standard.updateOne(
      { "criterias._id": req.query.idCriteria },
      { $pull: { criterias: { _id: req.query.idCriteria } } }
    ).then(() => {
      res.redirect("/admin/standard");
    });
  }
  //   test
  themDLTieuChuan(req, res) {
    const tieuChuans = req.body.tieuChuan;
    tieuChuans.forEach((tieuChuan) => {
      const newStandard = new Standard(tieuChuan);
      newStandard.save().catch((err) => {
        console.error(err);
      });
    });
    res.send("ok");
  }
}
module.exports = new ApiController();
