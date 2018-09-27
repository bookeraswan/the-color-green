var mongoose = require("mongoose");


    var userSchema = new mongoose.Schema({
       firstName: String, 
       lastName: String, 
       image: String,
       username: String, 
       email: String,
       birth: String,
       posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }   
        ]
    });
    

module.exports = mongoose.model("User", userSchema);