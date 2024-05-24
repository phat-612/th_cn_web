const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const User = require("../model/User");
const Standard = require("../model/Standard");
const { query } = require("express");
const Review = require("../model/Review");

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
  showReview(req, res) {
    const idReview = req.params.idReview;
    let reviewPromise;
    if (!idReview) {
      reviewPromise = Review.findOne({}).sort({ _id: -1 });
    } else {
      reviewPromise = Review.findOne({ _id: idReview });
    }
    Promise.all([
      reviewPromise,
      Review.find(
        {},
        {
          name: 1,
          status: 1,
        }
      ),
      User.find({}),
    ]).then(([curReview, reviews, users]) => {
      if (!curReview) {
        return res.render("admin/showReviewUser", {
          users: [],
          reviews: [],
          curReview: [],
        });
      }
      let outputData = [];
      users.forEach((user) => {
        let userReview = curReview.reviews.find(
          (review) => review.idUser.toString() == user._id.toString()
        );
        if (!userReview) {
          return outputData.push({
            idUser: user._id,
            username: user.username,
            name: user.name,
            gender: user.gender,
            birthday: user.birthday,
            total: false,
            status: false,
          });
        }
        return outputData.push({
          idUser: user._id,
          username: user.username,
          name: user.name,
          gender: user.gender,
          birthday: user.birthday,
          total: userReview.total,
          status: userReview.status,
          idUserReview: userReview._id,
        });
      });
      res.render("admin/showReviewUser", {
        js: "admin/showReview",
        users: outputData,
        reviews: reviews.map((review) => review.toObject()),
        curReview: curReview.toObject(),
        message: req.flash("message")[0],
      });
    });
  }
  showReviewStandard(req, res) {
    const idReview = req.params.idReview;
    Review.findOne({ _id: idReview }).then((review) => {
      res.render("admin/showReviewStandard", {
        review: review.toObject(),
      });
    });
  }
  detailUserReview(req, res) {
    const idUserReview = req.params.idUserReview;
    Review.findOne({ "reviews._id": idUserReview })
      .populate("reviews.idUser")
      .then((review) => {
        const userReview = review.reviews.find(
          (item) => item._id.toString() == idUserReview
        );
        let user = userReview.idUser.toObject();
        user.total = userReview.total;
        const outputData = review.standards.map((standard, indStandard) => {
          return {
            name: standard.name,
            criterias: standard.criterias.map((criteria, indCriteria) => {
              return {
                name: criteria.name,
                score: criteria.score,
                status: userReview.details[indStandard][indCriteria],
              };
            }),
          };
        });
        return res.render("admin/detailUserReview", {
          user: user,
          detailReview: outputData,
          idUserReview,
          status: userReview.status,
        });
      });
  }
}
module.exports = new AdminController();
