var mongoose = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

    var userSchema = new mongoose.Schema({
       firstName: String,
       lastName: String,
       image: String,
       imageId: String,
       username: String,
       bio: String,
       email: String, // email: {type: String, unique: true, required: true},
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
