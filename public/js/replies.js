
var input = S(".comment-input");
const loadCount = 10
const loadRepliesUrl = `/api/comment/${GlobalcommentId}/replies?limit=${loadCount}`

if(input){
    input.addEventListener("keypress", function(key){
        console.log(key.key)
        if(key.key === "Enter"){
            if(input.value !== ""){
                Ajax("post", `/api/comment/${GlobalcommentId}/reply`, JSON.stringify({text: this.value}))
                    .then(res => {renderComment(res, 'prepend'); console.log(res)})
                input.value = "";
            }
        }
    })
}



function create(e, classId, appendTo, text, link){
    let element = document.createElement(e)
    if(classId) element.classList.add(classId)
    if(appendTo) appendTo.append(element)
    if(link) element.href = link
    element.textContent = text
    return element
}

S(".loadmore-btn").addEventListener("click", loadMore)

window.onload = () => {
    Ajax("GET", loadRepliesUrl)
        .then(renderComments)
        .then(() => {
            if(S("#comments").childElementCount === 0){
                S(".loadmore_loader").classList.toggle("hidden");
                create("p", "center", S("body"), "There are no replies yet :(")
            }else if(S("#comments").childElementCount < loadCount){
                S(".loadmore_loader").classList.toggle("hidden");
                create("p", "center", S("body"), "There are no more replies...")
            }else{
                S(".loadmore-btn").classList.toggle("hidden");
                S(".loadmore_loader").classList.toggle("hidden");
            }
        })
}

function renderComments(comments){
    console.log(comments)
    comments.forEach(comment => renderComment(comment, 'append'))
}

function renderComment(res, appOrPre){
    console.log(res)
    let comment = create("div", "comment")
    create("a", "uname", comment, res.owner.username,  `/user/${res.owner.id}`)
    create("p", "comment-body", comment, res.text)
    // create("a", "replies", comment, "0 replies", `/comment/${res._id}/replies`)
    let aside = create("aside", "right", comment)
    create("h3", null, aside, res.when)
    if(GlobalcurrentUserId && GlobalcurrentUserId === res.owner.id){
        create("button", "edit-btn", aside, "Edit")
    }
    S("#comments")[appOrPre](comment)
}

function loadMore(){
    let offset = S("#comments").childElementCount
    console.log(offset)
    S(".loadmore-btn").classList.toggle("hidden");
    S(".loadmore_loader").classList.toggle("hidden");
    Ajax("GET", `${loadRepliesUrl}&offset=${offset}`)
    .then(renderComments)
    .then(() => {
      if(S("#comments").childElementCount === offset){
        S(".loadmore_loader").classList.toggle("hidden");
        create("p", "center", S("body"), "There are no more replies...")
      }else{
        S(".loadmore-btn").classList.toggle("hidden");
        S(".loadmore_loader").classList.toggle("hidden");
      }
    })
  }