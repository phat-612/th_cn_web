const checkLoginUser = (req, res, next) => {
  if (req.session && req.session.idUser && req.session.role === 1) {
    next();
  } else {
    res.redirect("/login");
  }
};
const checkLoginAdmin = (req, res, next) => {
  if (req.session && req.session.idUser && req.session.role === 0) {
    next();
  } else {
    res.redirect("/login");
  }
};
const checkLogin = (req, res, next) => {
  if (req.session && req.session.idUser) {
    next();
  } else {
    res.redirect("/login");
  }
};
const isLoggedIn = (req, res, next) => {
  if (req.session.idUser) {
    return res.redirect("/profile");
  }
  next();
};

module.exports = { checkLoginUser, checkLoginAdmin, isLoggedIn, checkLogin };
