var loginContainer = document.querySelector(".login-container");
var form = document.querySelector(".login-form");
var input1 = document.querySelector(".login-form input[type=text]");
var input2 = document.querySelector(".login-form input[type=password]");
var x = document.querySelector(".x");
var theColorGreen = document.querySelector(".thecolorgreen");


form.addEventListener("input", function() {
    loginContainer.style.width = "100vw";
    loginContainer.style.height = "100vh";
    input1.style.display = "block";
    x.textContent = "x";
    x.classList.add("x-after");
    input1.style.margin = "100px 0";
    input1.style.animation = "grow-input 1s forwards";
    input2.style.animation = "grow-input 1s .1s forwards";

});
