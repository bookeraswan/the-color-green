var password = document.getElementsByName("password")[0];
var passwordErrorMesage = document.querySelector(".password-err-msg");
var imageStatus = document.querySelector(".image-status");
var imageInput = document.querySelector(".file-input");

password.addEventListener('input', function(){
    if(this.value.length < 8){
        this.style.border = "2px dashed red";
        passwordErrorMesage.style.opacity = 1;
    }if(this.value.length >= 8 || this.value.length === 0){
        this.style.border = "2px solid black";
        passwordErrorMesage.style.opacity = 0;
    }
});

imageInput.addEventListener("input", function() {
      imageStatus.innerHTML = `Image Selected <br>` + imageInput.value;
});