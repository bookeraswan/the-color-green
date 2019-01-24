var input = S(".comment-input");
if(input){
    input.addEventListener("keypress", function(event){
        var comment = JSON.stringify({text: input.value});
        if(event.key === "Enter"){
            if(input.value !== ""){
                input.value = "";
                Ajax("POST", `/api/post/${S("#data").textContent}/comment`, comment)
                .then(function(res){
                    var comment = document.createElement("div");
                    var user = document.createElement("strong");
                    var profileLink = document.createElement("a");
                    var created = document.createElement("span");
                    var commentBody = document.createElement("div");
                    var commentText = document.createElement("p");
                    profileLink.href = `/user/${res.owner.id}`;
                    profileLink.textContent = res.owner.username;
                    user.append(profileLink);
                    created.textContent = "just now";
                    commentText.textContent = res.text;
                    commentBody.classList.add("comment-body");
                    commentBody.append(commentText);
                    comment.classList.add("comment");
                    comment.classList.add("owner");
                    comment.append(user);
                    comment.append(created);
                    comment.append(commentBody);
                    S("#comments").prepend(comment);
                });
            }
        }
    });
}