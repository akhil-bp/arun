var mongoose = require('mongoose');//here is db
var mongoosePaginate = require('mongoose-paginate');//pagination

var userSchema = mongoose.Schema({
    name : { type: String, default: "" },
    email : { type: String, default: "" },
    date : { type: Date },
    status : { type: Number, default: 1 },
    role : { type: Number, default: 0 },
    profilePic: { type: String, default: ""},
    profilePicFile:{ type: String, default: ""},
    password:{ type: String, default: ""}
    
},
{
    timestamps: true //return the created and updated dates
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);//userSchema---->User  ie..go to user.service folder
