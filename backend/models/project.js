const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    data:{
        html:{ type: String },
        css:{ type: String },
        javascript:{ type: String }
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Project =mongoose.model('project', ProjectSchema);