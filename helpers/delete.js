const User                = require("../models/user"),
      Post                = require("../models/post"),
      Comment             = require("../models/comment"),
      upload              = require("../middlewear/upload");



exports.post = function(post){
    Post.findById(post._id).populate("comments").exec( async function(err, foundPost) {
        if(err || !foundPost) return console.log(err);
        if(foundPost.imageId){
            await upload.cloudinary().v2.uploader.destroy(foundPost.imageId, function(err){
                if(err) console.log(err);
            });
        }
        post.comments.forEach(function(comment){
            Comment.findByIdAndRemove(comment._id, function(err){
                if(err){
                    console.log(err);
                    console.log("comment remove ERROR");
                }
                else{
                    console.log("comment removed");
                }
            });
        });
        Post.findByIdAndRemove(post._id, function(err){
            if(err){
                    console.log(err);
                    console.log("post remove ERROR");
            }
            else{
                console.log("post removed");
                console.log("________________________________________");
            }
        });
    });
}

exports.removeFollowers  = function(follower, foundUser){
    User.findById(follower, function(err, foundfollower){
    if(err){
        console.log(err);
        console.log("remove follower ERROR");
    }
    else{
        var index = foundfollower.following.indexOf(foundUser._id);
        if(index > -1){
            foundfollower.following.splice(index, 1);
            foundfollower.save();
        }
    }
});
}

exports.removeFollowing = function(following, foundUser){
    User.findById(following, function(err, foundperson){
        if(err || !foundperson){
            console.log(err);
            console.log("remove person ERROR");
        }
        else{
            var index = foundperson.followers.indexOf(foundUser._id);
            if(index > -1){
                foundperson.followers.splice(index, 1);
                foundperson.save();
            }
        }
    });
}