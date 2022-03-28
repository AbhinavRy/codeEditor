const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getUser = async(req,res) => {
    try {
        await User.find().then((result, err) => {
            if(err) {
                return res.status(500).json(err.message);
            }
            return res.status(200).json(result);
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

exports.createUser = async(req, res) => {
    const bodyData = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        bodyData["password"] = await bcrypt.hash(bodyData.password, salt);;
        const userData = new User({...bodyData});
        userData.save((err,result)=>{
            if(err){
                return res.status(500).json(err.message);
            }
            return res.status(200).json(result);
        })
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

exports.authUser = async(req, res) => {
    const bodyData = req.body;
    try {
        let user = await User.findOne({ email:bodyData.email,  }).populate("project");
        if(!user){
            return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
        }
        const isMatch = await bcrypt.compare(bodyData.password, user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
        }
        return res.status(200).json({msg:"matched", userId:user._id, projects:user.projects});
    } catch (error) {
        return res.status(500).json(error.message);
    }
}