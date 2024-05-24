const User = require("../model/User");
const Standard = require("../model/Standard");
const Review = require("../model/Review");

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
  sendReview(req, res) {
    Review.findOne({ status: true }).then((review) => {
      if (!review) {
        return res.redirect("/profile");
      }
      res.render("sendReview", {
        review: review.toObject(),
      });
    });
  }
  historyReview(req, res) {
    const idUser = req.session.idUser;
    const idReview = req.params.idReview;
    console.log(idReview);
    let reviewPromise;
    if (idReview) {
      reviewPromise = Review.findOne({ _id: idReview });
    } else {
      reviewPromise = Review.findOne({ "reviews.idUser": idUser }).sort({
        createdAt: -1,
      });
    }
    Promise.all([
      reviewPromise,
      Review.find({ "reviews.idUser": idUser }, { name: 1, status: 1 }),
    ]).then(([curReview, reviews]) => {
      if (reviews.length == 0) {
        return res.redirect("/profile");
      }
      console.log(curReview.name, reviews);
      // return res.send({ curReview, reviews });
      let userReview = curReview.reviews.find(
        (review) => review.idUser.toString() == idUser.toString()
      );
      const outputData = curReview.standards.map((standard, indStandard) => {
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
      // return res.send({ curReview, reviews, outputData });
      res.render("historyReview", {
        reviews: reviews.map((review) => review.toObject()),
        details: outputData,
        curReview: curReview.toObject(),
        status: userReview.status,
      });
    });
  }
}
module.exports = new UserController();
