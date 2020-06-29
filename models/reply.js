var mongoose = require("mongoose");


var replySchema = new mongoose.Schema({
   text: String,
   created: {type: Date, default: Date.now},
   owner: {
      username: String,
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
   },
   parent: {
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
   }
});


module.exports = mongoose.model("Reply", replySchema);