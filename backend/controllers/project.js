const Project = require('../models/project');
const User = require('../models/user');

exports.getProject = async (req, res) => {
    try {
        await Project.find().then((result, err) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.createProject = async (req, res) => {
    const bodyData = req.body;
    try {
        // let user = await Project.findOne({ bodyData.email });
        // if(user){
        //     return res.status(400).json({errors:[{ msg:'Buyer already exists' }]});
        // }
        const userData = new Project({ ...bodyData });
        userData.save(async (err, result) => {
            if (err) {
                return res.status(500).json(err.message);
            }
            const projectId = result._id;
            await User.findOneAndUpdate(
                { _id: bodyData.userId },
                { $push: { projects: projectId } },
                { new: true },
                (err, result) => {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                }
            );
            return res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.updateProject = async (req, res) => {
    const bodyData = req.body;
    try {
        if (
            bodyData._id &&
            bodyData._id !== undefined &&
            bodyData._id !== null
        ) {
            await Project.findOneAndUpdate(
                { _id: bodyData._id },
                { ...bodyData },
                { new: true },
                (err, result) => {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json(result);
                }
            );
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

exports.deleteProject = async (req, res) => {
    const bodyData = req.body;
    try {
        if (
            bodyData._id &&
            bodyData._id !== undefined &&
            bodyData._id !== null
        ) {
            await Project.deleteOne({ _id: bodyData._id })
                .then(async () => {
                    await User.findOneAndUpdate(
                        { _id: bodyData.userId },
                        { $pull: { projects: bodyData._id } },
                        { new: true, rawResult: true }
                    );
                    return res
                        .status(200)
                        .json({ msg: 'Delete successfully.' });
                })
                .catch((err) => {
                    return res.status(500).json({ msg: err.message });
                });
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
