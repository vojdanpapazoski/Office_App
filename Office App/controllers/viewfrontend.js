const view = require("../pkg/statuses/statuses")
//....................................................................................


const getDefault = async (req, res) => {
    try {
        res.render("default", {
            title: "Welcome to the Office Chat App"    
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

//....................................................................................

const getRegister = async (req, res) => {
    try {
        res.render("register", {
            title: "Register",
            subtitle: "The Office Chat App"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
  }
};

//....................................................................................

const getLogin = async (req, res) => {
    try {
      res.render("login", {
        title: "The Office Chat App",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err)
    }
  };

//....................................................................................

const statusViewHome = async (req, res) => {
    try {
        const user = req.auth.name;
        const image = req.auth.image;
        const statusView = await view.find();
        res.render("home", {
            title: "The Office Chat App",
            subtitle: "Welcome to news feed",
            statusView,
            user,
            image
        });
    } catch (err) {
        res.status(500).send(err);
    }
};

//....................................................................................

const createStatus = async (req, res) => {
    try {
        const userId = req.auth.id;
        await view.create({
            user: req.auth.name,
            content: req.body.content,
            author: userId,
            time: req.body.time
        });
        res.redirect("/home");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const getByUserMyProfile = async (req, res) => {
    try {
        const user = req.auth.name;
        const userId = req.auth.id;
        const image = req.auth.image;
        const myStatuses = await view.find({ author: userId });
        res.render("myprofile", {
            title: "My Profile",
            subtitle: "My statuses",
            user,
            myStatuses,
            image
        });
    } catch (err) {
        res.status(500).json({
            status: "Failed to display My statuses",
            message: err,
        });
    }
};

//....................................................................................

const modifyStatus = async (req,res) => {
    try {
        const statusId = req.params.id;
        const updatedContent = req.body.content;
        await view.findByIdAndUpdate(statusId, { content: updatedContent });
        res.redirect('/myprofile');
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

//....................................................................................

const removeStatus = async (req,res) => {
    try {
        await view.findByIdAndDelete(req.params.id);
        res.redirect("/myprofile");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

//....................................................................................



module.exports = {
    getLogin,
    getRegister,
    getDefault,
    statusViewHome,
    createStatus,
    modifyStatus,
    removeStatus,
    getByUserMyProfile,
};
