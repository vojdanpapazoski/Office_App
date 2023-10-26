// PACKAGES
const express = require("express");
const db = require("./pkg/db/index");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");

// IMPORTING ROUTES 
const { register, login, protect } = require("./controllers/auth");
const { create, getOne, getAll, update , remove, getByUser, createByUser} = require("./controllers/statuses");
const { getDefault, getRegister, getLogin, createStatus, statusViewHome, modifyStatus, removeStatus, getByUserMyProfile,} = require("./controllers/viewfrontend");
const { uploadPicture } = require("./controllers/multer");

// APP START
const app = express();

// MIDDLEWARES
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER PACKAGE
app.use(cookieParser());

// CONNECTING WITH DATABASE
db.init();

app.use(
  jwt
    .expressjwt({
      algorithms: ["HS256"],
      secret: process.env.JWT_SECRET,
      getToken: (req) => {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        }
        if (req.cookies.jwt) {
          return req.cookies.jwt;
        }
        return null;
      },
    })
    .unless({
      path: [
        "/",
       "/login", 
       "/register"
      ],
    })
);

// CONNECTING WITH FRONT-END  
app.use(express.static("public"));

// USER ROUTES 
app.post("/register", uploadPicture, register);
app.post("/login", login);

//POSTMAN ROUTES
app.post("/status", uploadPicture, create);
app.get("/status/:id", getOne );
app.get("/status", protect, getAll);
app.patch("/status/:id", update ); 
app.delete("/status/:id", remove );


// TWO FUNCTIONS FOR MYSELF
app.post("/createByUser", createByUser );
app.get("/me", getByUser);

// VIEW ROUTES 
app.get("/", getDefault);
app.get("/register", getRegister);
app.get("/login", getLogin);
app.post("/createStatus", createStatus);
app.get("/home", protect, statusViewHome);
app.post("/modifyStatus/:id", modifyStatus);
app.get("/removeStatus/:id", removeStatus);
// FUNCTION FOR MYSELF
app.get("/myProfile", protect, getByUserMyProfile)


// SERVER LISTEN APP
app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server started on port ${process.env.PORT}`);
});