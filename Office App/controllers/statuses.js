const status = require("../pkg/statuses/statuses")

//....................................................................................

const create = async (req,res) => {
    try {
        if (req.file) {
            const filename = req.file.filename;
            req.body.image = filename;
        }
    const creating = await status.create(req.body);
    res.status(200).json({
        status: "Created",
        message: "Created new status",
        data: creating
        }) 
    } catch (err) {
    res.status(500).json({
        status:"Error creating",
        message: err
    });
  };
};
//....................................................................................

const getOne = async (req, res) => {
    try {
        const getting = await status.findById(req.params.id);
        res.status(200).json ({
            status: "Status found sucessfully",
            data: getting
        })
    } catch (err) {
        res.status(500).json ({
            status:"Error getting Status",
            message: err
        });
    };
};

//....................................................................................

const getAll = async (req,res) => {
    try {
        const query = { ...req.query };
        let queryString = JSON.stringify(query);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const parsed = JSON.parse(queryString);
        const allstatus = await status.find(parsed);
        const totalstatus = allstatus.length;
        res.status(200).json({
            status: "success",
            message: `${totalstatus} found successfully`,
            data: allstatus
        });
    } catch (err) {
        res.status(500).json({
            status: "Cannot get All status",
            message: err
        });
    };
};

//....................................................................................

const update = async (req,res) => {
    try {
        console.log("req.file", req.file);
        const updating = await status.findByIdAndUpdate(req.params.id, req.body);
        ({
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "Status Updated",
            message: "Status updated successfully",
            data: updating
        })
    } catch (err) {
        res.status(500).json({
        status: "Cannot update Status",
        message: err
    })
  }
}

//....................................................................................
    
const remove = async (req, res) => {
    try{
        const deleteStatus = await status.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "Success deleted",
            message: "Status is deleted successfully",
            data: deleteStatus
        });
    } catch (err) {
        res.status(500).json({
            status:"Failed to delete status",
            message: err
        });
    }
};

//....................................................................................

const createByUser = async (req, res) => {
    try {
        const userId = req.auth.id;
        const myStatuses = await status.create({
            user: req.body.user,
            content: req.body.content,
            author: userId
        })
        res.status(201).json({
            status: "success",
            message: "Status is created successfully by user",
            data: myStatuses
        }); 
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err
        });
    }
};

//....................................................................................

const getByUser = async (req, res) => {
    try {
        const allStatusesByUser = await status.find({ author: req.auth.id });
        const totalStatusesByUser = allStatusesByUser.length;
        res.status(201).json({
            status: "success",
            message: `${totalStatusesByUser} status by user found successfully`,
            data: allStatusesByUser
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err
        });
    }
};


module.exports = {
    create,
    getOne,
    getAll,
    update,
    remove,
    createByUser, 
    getByUser 
}