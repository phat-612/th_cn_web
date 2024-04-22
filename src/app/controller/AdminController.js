const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const User = require("../model/User");
const Score = require("../model/Score");
const Standard = require("../model/Standard");
const { query } = require("express");

class AdminController {
  showMember(req, res) {
    // User.find({ role: 1 }).then((members) => {

    //   res.render("member", {
    //     members: members.map((user) => user.toObject()),
    //   });
    // });
    Score.find()
      .populate({
        path: "idUser",
        match: { role: 1 },
        select: "hoten _id",
      })
      .exec()
      .then((scores) => {
        const members = scores.map((score) => ({
          userScore: score.userScore,
          adminScore: score.adminScore,
          hoten: score.idUser.hoten,
          _id: score.idUser._id,
        }));
        res.render("member", {
          members,
          message: req.flash("message")[0],
        });
      });
  }
  showEvaluate(req, res) {
    const idUser = req.query.id;
    Promise.all([
      Standard.find(),
      Score.findOne({ idUser }).populate({
        path: "idUser",
        select: "hoten",
      }),
    ]).then(([standards, score]) => {
      res.render("evaluate", {
        idUser,
        hoten: score.idUser.hoten,
        role: req.session.role,
        standards: standards.map((standard) => standard.toObject()),
        user: score.user.map((item) => item.toObject()),
        admin: score.admin.map((item) => item.toObject()),
      });
    });
  }
  addStandard(req, res) {
    const dataForm = req.body;
    const standards = dataForm.standards.map((standard) => ({
      ten: standard,
    }));

    Standard.insertMany(standards).then(() => {
      res.send("Thêm thành công");
    });
  }
  updateEvaluate(req, res) {
    const formData = req.body;
    const totalScore = formData.admin.reduce(
      (total, item) => (item.check ? total + 10 : total),
      0
    );
    Score.updateOne(
      { idUser: formData.idUser },
      {
        admin: formData.admin,
        adminScore: totalScore,
        status: true,
      }
    ).then(() => {
      req.flash("message", {
        type: "success",
        message: "Đánh giá thành công",
      });
      res.redirect("/admin/member");
    });
  }
  allowEvaluate(req, res) {
    if (req.session.role !== 0) {
      req.flash("message", {
        type: "danger",
        message: "Bạn không có quyền truy cập",
      });
      return res.redirect("/admin/member");
    }
    Score.updateMany(
      { status: true },
      { status: false, user: [], admin: [], userScore: 0, adminScore: 0 }
    ).then(() => {
      req.flash("message", {
        type: "success",
        message: "Đã cho phép hội viên đánh giá",
      });
      res.redirect("/admin/member");
    });
  }
}
module.exports = new AdminController();
