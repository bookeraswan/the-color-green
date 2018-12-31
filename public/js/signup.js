var password = document.getElementsByName("password")[0];
var passwordErrorMesage = document.querySelector(".password-err-msg");
var imageStatus = document.querySelector(".image-status");
var imageInput = document.querySelector(".file-input");
var submitBtn = document.querySelector("button");
var adminBtn = document.querySelector("#admin-btn");
var admin = document.querySelector("#admin");

var username = document.querySelector("#username");
var password = document.querySelector("#password");
var firstName = document.querySelector("#firstName");
var lastName = document.querySelector("#lastName");
var birth = document.querySelector("#birth");
var email = document.querySelector("#email");

document.getElementById('loader-container').style.visibility="hidden";

password.addEventListener('input', function(){
    if(this.value.length < 8){
        this.style.borderBottom = "5px dashed red";
        this.style.borderTop = "5px dashed red";
        passwordErrorMesage.style.opacity = 1;
    }if(this.value.length >= 8 || this.value.length === 0){
        this.style.borderBottom = "5px solid black";
        this.style.borderTop = "none";
        passwordErrorMesage.style.opacity = 0;
    }
});

imageInput.addEventListener("input", function() {
      imageStatus.innerHTML = `Image Selected <br>` + imageInput.value;
});

adminBtn.addEventListener("click", function() {
  admin.style.opacity = 1;
});

submitBtn.addEventListener("click", function() {
  console.log(password.value.length);
  if(username.value.length > 2 && password.value.length > 7 && imageInput.value && firstName.value && lastName.value && birth.value && validateEmail(email.value)){
    setTimeout(function() {
      document.getElementById('loader-container').style.visibility="visible";
    }, 1000);
  }
  else {
    console.log("something is not filled in");
  }
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
