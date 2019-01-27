var mongoose = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

    var userSchema = new mongoose.Schema({
       firstName: {type: String, default: " "},
       lastName: {type: String, default: " "},
       image: {type: String, default: "/images/avatars/avatar.png"},
       imageId: String,
       username: String,
       bio: String,
       email: {type: String, default: "@"},
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
