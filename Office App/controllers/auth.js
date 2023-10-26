const User = require("../pkg/users/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { crypto } = require("crypto");
const { promisify } = require("util");
const { sendEmail } = require("./mailtrap");

//.....................................................................

const register = async (req,res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({
        name,
        email,
        password,
        image: req.file ? req.file.filename : "default-image.png"
    });
    await sendingEmail(email);
    
    const token = jwt.sign(
        { id: newUser._id, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: parseInt(process.env.JWT_EXPIRES) }
    ); 
    
    res.cookie("jwt", token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: true,
      });


      res.status(201).json({
        status: "success",
        data: newUser
      });
} catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("This user with this email doesn't exist in database");
    }

    const isPasswordValid = bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password or email");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: true
    });

    res.status(200).json({
      status: "success",
      token
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err
    });
  }
};

const protect = async (req, res, next) => {
  try {
    // TAKING TOKEN AND CHECKING DOES IT EXISTS
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(500).send("You are not logged in! Please log in");
    }

    // VERIFYING THE TOKEN
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // CHECKING DOES USER EXISTS
    const userTrue = await User.findById(decoded.id);
    if (!userTrue) {
      return res.status(401).send("User doesn't exist anymore");
    }

    // GIVING PERMISSION FOR PROTECTED ROUTE
    req.auth = userTrue;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
    register,
    login,
    protect,
  };