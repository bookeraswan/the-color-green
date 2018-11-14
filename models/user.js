var mongoose = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

    var userSchema = new mongoose.Schema({
       firstName: String, 
       lastName: String, 
       image: String,
       username: String,
       bio: String,
       email: String,
       birth: String,
       followers:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }     
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            } 
        ],
       posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }   
        ]
    });
    
    
userSchema.plugin(passportLocalMongoose);
    

module.exports = mongoose.model("User", userSchema);