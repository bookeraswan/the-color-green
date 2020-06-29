var iconOne = document.querySelector(".one");
var iconTwo = document.querySelector(".two");
var iconThree = document.querySelector(".three");

var inputBoxOne = document.querySelector(".open-input-box-one");
var inputBoxTwo = document.querySelector(".open-input-box-two");
var inputBoxThree = document.querySelector(".open-input-box-three");

var inputOne = document.querySelector(".open-input-box-one");
var inputTwo = document.querySelector(".open-input-box-two");
var inputThree = document.querySelector(".open-input-box-three");

var currentImg = document.querySelector(".img");
var currentEmail = document.querySelector(".email");
var currentBio = document.querySelector(".textarea");

var img = document.querySelector(".profile-image");

    iconOne.addEventListener("click", function(){
        if(inputBoxOne.style.display === "block"){
            inputBoxOne.style.display = "none";
            currentImg.textContent = inputOne.value;
        }
        else{
            inputBoxOne.style.display = "block";
        }
    });

    iconTwo.addEventListener("click", function(){
        if(inputBoxTwo.style.display === "block"){
            inputBoxTwo.style.display = "none";
        }
        else{
            inputBoxTwo.style.display = "block";
        }
    });

    iconThree.addEventListener("click", function(){
        if(inputBoxThree.style.display === "block"){
            console.log(inputBoxThree.textContent);
            currentBio.textContent = inputThree.textContent;
            inputBoxThree.style.display = "none";
        }
        else{
            inputBoxThree.style.display = "block";
        }
    });

    var imageInput = document.querySelector(".image-input");

    imageInput.addEventListener("change", function(){
        var reader = new FileReader();
        currentImg.file = this.files[0];
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(this.files[0]);
    });