S      = s => document.querySelector(s) ? document.querySelector(s) : new FakeElement();
const create = e => document.createElement(e);
Element.prototype.class = function(c) {this.classList.add(c); return this}
Element.prototype.link  = function(h) {this.href = h;         return this}
Element.prototype.txt   = function(t) {this.textContent = t;    return this}
Element.prototype.on    = function(e, cb){this.addEventListener(e, cb)}
Element.prototype.onif  = function(e, con, cb){if(con){this.addEventListener(e, cb)}}

let body              = S("body");
let imageInput        = S(".image-input");
let img               = S(".img");
let formContainer     = S("#form-container");
let imageButton       = S(".image-input-button");
let postBtn           = S("#new-post-btn");
let exitBtn           = S("#exit");
let loader            = S("#loader-container");
let newPostForm       = S("#new-post-form");
let followunfollowBtn = S("#follow_unfollow-btn");
let followStatus      = S("#follow-status");
let numFollowers      = S("#num-followers");

const limit = 10

if(postBtn){
  imageButton.onclick = () => imageInput.click();
  img.onclick = () => imageInput.click();
}

Ajax({
  method: "get",
  url: window.location.href + `/posts?limit=${limit}`
})
.then(posts => {
  let postsArr = JSON.parse(posts)
  if(!postsArr[0]){
    let p = create("p")
    p.textContent = "No posts yet :("
    p.class("noposts")
    S("#posts").append(p)
    S(".loadmore-btn").remove()
    S(".loadmore_loader").remove()
  }
  else postsArr.forEach(renderPost)

  if(postsArr.length < limit && postsArr.length > 0){
    let p = create("p")
    p.textContent = "No more posts..."
    p.class("noposts")
    S("#posts").append(p)
    S(".loadmore-btn").remove()
    S(".loadmore_loader").remove()
  }
})

S(".loadmore-btn").on("click", loadMore)

if(Global_Is_User){
  postBtn.onif("click", postBtn, function(){
    body.style.overflow = "hidden";
    formContainer.style.transform = "scale(1)";
  });
}


imageInput.onif("change", postBtn, function(){
  var reader = new FileReader();
  img.file = this.files[0];
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(this.files[0]);
});

exitBtn.onif("click", postBtn, function(){
  body.style.overflowY = "scroll";
  formContainer.style.transform = "scale(0)"
});

newPostForm.onif("submit", postBtn, function(e){
  formContainer.scrollTo(0, 0);
  formContainer.style.overflow = "hidden";
  loader.style.display = "block";
});

followunfollowBtn.onif("click", !postBtn, () => {
  followStatus.textContent = "↻↻↻↻↻";
  Ajax({
    method: "post",
    url: followunfollowBtn.dataset.url
  })
  .then(res =>{
    var followers = Number(numFollowers.textContent);
    var profile_id = /\/user\/(\w+)\/\w+/.exec(followunfollowBtn.dataset.url)[1];
    if(res == "true"){
      followunfollowBtn.classList.toggle("active")
      if(/unfollow/.test(followunfollowBtn.dataset.url)){
        followStatus.textContent = "follow"
        if(followers > 0) numFollowers.textContent = --followers;
        followunfollowBtn.dataset.url = `/user/${profile_id}/follow`
      }
      else {
        followStatus.textContent = "unfollow"
        numFollowers.textContent = ++followers;
        followunfollowBtn.dataset.url = `/user/${profile_id}/unfollow`
      }
      return
    }
    followunfollowBtn.innerHTML = res;
    followunfollowBtn.style.color = "#00a";
  })
  .catch(err => {
    followunfollowBtn.innerHTML = "something went wrong";
    followunfollowBtn.style.color = "#a00";
  })
})

function loadMore(){
  let offset = S("#posts").children.length
  this.classList.toggle("hidden");
  S(".loadmore_loader").classList.toggle("hidden");
  Ajax({
    method: "get",
    url: window.location.href + `/posts?limit=${limit}&offset=${offset}`
  })
  .then(posts => {
    let postsArr = JSON.parse(posts)
    postsArr.forEach(renderPost)
  })
  .then(posts => {
    if(posts > 0){
      this.classList.toggle("hidden");
    }
    else{
      let p = create("p")
      p.textContent = "No more posts..."
      p.class("noposts")
      S("#posts").append(p)
    }
    S(".loadmore_loader").classList.toggle("hidden");
  })
}

function renderPost(post){
  let postDiv = create("div").class("post"),
      comm_a  = create("a").link(`/post/${post._id}/comments`),
      h3      = create("h3"),
      em      = create("em").txt(post.owner.username),
      h5      = create("h5").class("created").txt(new Date(post.created).toString().substring(0, 15));
    comm_a.innerHTML = `<aside class="comments"><strong><i class="far fa-comment"></i> ${post.commentsLen}</strong></aside>`
  if(postBtn){
    let editCon = create("div").class("edit-post-icon"),
        a       = create("a").link(`/post/${post._id}/edit`),
        i       = create("i").class("fas").class("fa-cog")
      postDiv.append(editCon)
      editCon.append(a)
      a.append(i)
  }
  if(post.image){
    let imgDiv  = create("div").class("post-image-container"),
        img     = create("img").class("post-image");
    img.src = post.image
    imgDiv.append(img)
    postDiv.append(imgDiv)
  }
  postDiv.append(comm_a)
  postDiv.append(h3)
  h3.append(em)
  postDiv.append(h5)
  if(post.text){
    let p = create("p").txt(post.text.substring(0, 290) + "..."),
        a = create("a").link(`/post/${post._id}`).txt("read more")
    p.append(a)
    postDiv.append(p)
  }
  S("#posts").append(postDiv)
}

function Ajax(params){
  var XHR = new XMLHttpRequest();
  var promise = new Promise(function(resolve, reject){
     XHR.onreadystatechange = function(){
        if(XHR.readyState == 4){
           if(XHR.status == 200) resolve(XHR.responseText);
           else reject(XHR.responseText)
        }
     }
  })
  XHR.open(params.method, params.url)
  XHR.setRequestHeader("content-type", "application/json");
  XHR.send(JSON.stringify(params.body))
  return promise
}


function FakeElement(){
  this.__proto__ = Element.prototype
}