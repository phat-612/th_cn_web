const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const User = require("../model/User");
const Standard = require("../model/Standard");
const { query } = require("express");

class AdminController {
  showStandard(req, res) {
    Standard.find({}).then((standards) => {
      res.render("admin/standard", {
        js: "admin/standard",
        standards: standards.map((standard) => standard.toObject()),
        message: req.flash("message")[0],
      });
    });
  }
  showUser(req, res) {
    User.find({}).then((users) => {
      res.render("admin/member", {
        js: "admin/member",
        users: users.map((user) => user.toObject()),
        message: req.flash("message")[0],
      });
    });
  }
}
module.exports = new AdminController();
