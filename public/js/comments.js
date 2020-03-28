var input = S(".comment-input");
const loadCommentsUrl = `/api/post/${GlobalpostId}/comments?limit=10`
if(input){
    input.addEventListener("keypress", function(event){
        var comment = JSON.stringify({text: input.value});
        if(event.key === "Enter"){
            if(input.value !== ""){
                input.value = "";
                Ajax("POST", `/api/post/${S("#data").textContent}/comment`, comment)
                .then(res => renderComment(res, 'prepend'));
            }
        }
    });
}

S(".loadmore-btn").addEventListener("click", loadMore)

window.onload = () => {
    Ajax("GET", loadCommentsUrl)
        .then(renderComments)
        .then(() => {
            S(".loadmore-btn").classList.toggle("hidden");
            S(".loadmore_loader").classList.toggle("hidden");
        })
}

function renderComments(comments){
    comments.forEach(comment => renderComment(comment, 'append'))
}

function renderComment(res, appOrPre){
    let comment = create("div", "comment")
    create("a", "uname", comment, res.owner.username,  `/user/${res.owner.id}`)
    create("p", "comment-body", comment, res.text)
    create("a", "replies", comment, "0 replies", "/")
    let aside = create("aside", "right", comment)
    create("h3", null, aside, res.when)
    if(GlobalcurrentUserId && GlobalcurrentUserId === res.owner.id){
        create("button", "edit-btn", aside, "Edit")
    }
    S("#comments")[appOrPre](comment)
}

function create(e, classId, appendTo, text, link){
    let element = document.createElement(e)
    if(classId) element.classList.add(classId)
    if(appendTo) appendTo.append(element)
    if(link) element.href = link
    element.textContent = text
    return element
}

function loadMore(){
    let offset = S("#comments").childElementCount
    console.log(offset)
    S(".loadmore-btn").classList.toggle("hidden");
    S(".loadmore_loader").classList.toggle("hidden");
    Ajax("GET", `${loadCommentsUrl}&offset=${offset}`)
    .then(renderComments)
    .then(() => {
      if(S("#comments").childElementCount === offset){
        S(".loadmore_loader").classList.toggle("hidden");
        create("p", "center", S("body"), "There are no more comments...")
      }else{
        S(".loadmore-btn").classList.toggle("hidden");
        S(".loadmore_loader").classList.toggle("hidden");
      }
    })
  }