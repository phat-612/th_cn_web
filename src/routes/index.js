const express = require("express");
const multer = require("multer");

const UserController = require("../app/controller/UserController");
const AdminController = require("../app/controller/AdminController");
const ApiController = require("../app/controller/ApiController");

const {
  checkLoginAdmin,
  checkLoginUser,
  checkLogin,
  isLoggedIn,
} = require("../app/middleware/authLogin");
const { uploadFile } = require("../app/middleware/uploadFile");

const router = express.Router();
const upload = multer({ dest: "public/uploads" });

// get
router.get("/register", isLoggedIn, UserController.showRegister);
router.get("/login", isLoggedIn, UserController.showLogin);
router.get("/logout", UserController.logout);
router.get("/profile", checkLogin, UserController.showProfile);
router.get("/sendReview", checkLogin, UserController.sendReview);
router.get(
  "/historyReview/:idReview?",
  checkLogin,
  UserController.historyReview
);
// get admin
router.get("/admin/standard", checkLoginAdmin, AdminController.showStandard);
router.get("/admin/member", checkLoginAdmin, AdminController.showUser);
router.get(
  "/admin/showReview/:idReview?",
  checkLoginAdmin,
  AdminController.showReview
);
router.get(
  "/detailUserReview/:idUserReview",
  checkLoginAdmin,
  AdminController.detailUserReview
);
router.get(
  "/admin/showReviewStandard/:idReview",
  AdminController.showReviewStandard
);
// post
router.post("/api/register", ApiController.storeUser);
router.post("/api/login", ApiController.authLogin);
router.post("/api/sendReview", checkLogin, ApiController.sendReview);
// post admin
router.post("/api/standard", checkLoginAdmin, ApiController.storeStandard);
router.post("/api/criteria", checkLoginAdmin, ApiController.storeCriteria);
router.post("/api/createReview", checkLoginAdmin, ApiController.createReview);
router.post("/api/endReview", checkLoginAdmin, ApiController.endReview);
router.post("/api/trueReview", checkLoginAdmin, ApiController.trueReview);
// patch
router.patch("/api/password", checkLogin, ApiController.changePassword);
router.patch(
  "/api/avatar",
  upload.single("avatar"),
  uploadFile,
  ApiController.changeAvatar
);
router.patch("/api/profile", checkLogin, ApiController.updateProfile);
router.patch("/api/active", checkLogin, ApiController.updateActive);
router.patch("/api/role", checkLogin, ApiController.updateRole);
router.patch("/api/standard", checkLoginAdmin, ApiController.updateStandard);
router.patch("/api/criteria", checkLoginAdmin, ApiController.updateCriteria);

// delete
router.delete("/api/standard", checkLoginAdmin, ApiController.deleteStandard);
router.delete("/api/criteria", checkLoginAdmin, ApiController.deleteCriteria);
// test
router.post("/test/themDLTieuChuan", ApiController.themDLTieuChuan);
router.post("/api/showData", (req, res) => {
  console.log("---------------------------");
  res.send(req.body);
  console.log("---------------------------");
});
// Export the router
module.exports = router;
