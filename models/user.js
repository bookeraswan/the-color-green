var mongoose = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

    var userSchema = new mongoose.Schema({
       firstName: {type: String, default: " "},
       lastName: {type: String, default: " "},
       fullSizeImage: {type: String, default: "/images/avatars/avatar.png"},
       image: {type: String, default: "/images/avatars/avatar.png"},
       profileIconImage: {type: String, default: "/images/avatars/avatar.png"},
       imageId: String,
       username: String,
       bio: String,
       email: {type: String, default: "@"},
       birth: String,
       followers:[],
       following: [],
       posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ]
    });


userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema);
