var mongoose = require("mongoose");


var commentSchema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
   },
   replies: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reply"
      }
   ]
});


module.exports = mongoose.model("Comment", commentSchema);