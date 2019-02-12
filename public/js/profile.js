var body = document.querySelector("body");
var imageInput = document.querySelector(".image-input");
var img = document.querySelector(".img");
var formContainer = document.querySelector("#form-container");
var imageButton = document.querySelector(".image-input-button");
var postBtn = document.querySelector("#new-post-btn");
var exitBtn = document.querySelector("#exit");
var loader = document.querySelector("#loader-container");
var newPostForm = document.querySelector("#new-post-form");

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