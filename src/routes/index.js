const express = require("express");
const multer = require("multer");

const UserController = require("../app/controller/UserController");
const AdminController = require("../app/controller/AdminController");

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
router.get("/evaluate", checkLoginUser, UserController.showEvaluate);
// get admin
router.get("/admin/member", checkLoginAdmin, AdminController.showMember);
router.get("/admin/evaluate", checkLoginAdmin, AdminController.showEvaluate);
// post
router.post("/register", UserController.storeUser);
router.post("/login", UserController.authLogin);
// post admin
router.post("/admin/standard", AdminController.addStandard);
router.post(
  "/admin/allowEvaluate",
  checkLoginAdmin,
  AdminController.allowEvaluate
);

// patch
router.patch("/password", checkLogin, UserController.changePassword);
router.patch(
  "/avatar",
  upload.single("avatar"),
  uploadFile,
  UserController.changeAvatar
);
router.patch("/profile", checkLogin, UserController.updateProfile);
router.patch("/user/evaluate", checkLoginUser, UserController.updateEvaluate);
router.patch(
  "/admin/evaluate",
  checkLoginAdmin,
  AdminController.updateEvaluate
);

// test
router.post("/test", (req, res) => {
  console.log("---------------------------");
  res.send(req.body);
  console.log("---------------------------");
});
// Export the router
module.exports = router;
