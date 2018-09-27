var mongoose = require("mongoose");


var postSchema = new mongoose.Schema({
    image: String,
    text: String,
    created: {type: Date, default: Date.now},
    owner: {
        username: String
    }
});


module.exports = mongoose.model("Post", postSchema);