var body = document.querySelector("body");
var imageInput = document.querySelector(".image-input");
var img = document.querySelector(".img");
var formContainer = document.querySelector("#form-container");
var imageButton = document.querySelector(".image-input-button");
var postBtn = document.querySelector("#new-post-btn");
var exitBtn = document.querySelector("#exit");
var loader = document.querySelector("#loader-container");
var newPostForm = document.querySelector("#new-post-form");
var followunfollowBtn = document.querySelector("#follow_unfollow-btn");
var followStatus = document.querySelector("#follow-status");
var numFollowers = document.querySelector("#num-followers");

if(postBtn){
  postBtn.addEventListener("click", function(){
    body.style.overflow = "hidden";
    formContainer.style.transform = "scale(1)";
  });
  imageButton.onclick = clickInput;
  img.onclick = clickInput;
  function clickInput(){
    imageInput.click();
  }
  imageInput.addEventListener("change", function(){
      var reader = new FileReader();
      img.file = this.files[0];
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(this.files[0]);
  });
  exitBtn.addEventListener("click", function(){
    body.style.overflowY = "scroll";
    formContainer.style.transform = "scale(0)"
  });
  newPostForm.addEventListener("submit", function(e){
    formContainer.scrollTo(0, 0);
    formContainer.style.overflow = "hidden";
    loader.style.display = "block";
  });
}

if(followunfollowBtn){
  followunfollowBtn.addEventListener("click", () => {
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