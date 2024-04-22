const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const methodOverride = require("method-override");
const flash = require("connect-flash");
const path = require("path");

// tự viết
const db = require("./helper/db");

const app = express();
db.connect();
// Configure Handlebars as the template engine
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "handlebars",
  engine({
    helpers: require("./helper/handlebars"),
  })
);
app.set("view engine", "handlebars");

app.use(methodOverride("_method"));

// Configure session middleware
app.use(
  session({
    secret: "10diemthuchanh",
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
      uri: "mongodb+srv://nguyenphatssj0612:s8xZNFRib12rM7kj@csdlthktcnweb.z79w7bu.mongodb.net/?retryWrites=true&w=majority&appName=csdlthktcnweb",
    }),
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Define your routes and middleware here
app.use(require("./routes"));
// Start the server
app.listen(3001, () => {
  console.log("Server started on port 3001:", "http://localhost:3001/login");
});
