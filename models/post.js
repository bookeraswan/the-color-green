var mongoose = require("mongoose");


var postSchema = new mongoose.Schema({
    image: String,
    imageId: String,
    ownerId: String,
    text: String,
    created: {type: Date, default: Date.now},
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


module.exports = mongoose.model("Post", postSchema);
