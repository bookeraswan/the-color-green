var passwordErrorMesage = S(".password-err-msg"),
    username = S("#username"),
    password = S("#password");

    var notTaken;

S("#loader-container").style.visibility="hidden";

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

username.addEventListener("input", checkAvailability);

S("button").addEventListener("click", submit);

username.addEventListener("keypress", keySubmit);

password.addEventListener("keypress", keySubmit);

function keySubmit(event){
  console.log(event.key);
  if(event.key === "Enter"){
    submit();
  }
}

function submit(){
  if(checkAvailability()){
    if(username.value.length < 3){
      alert("username must be longer than two characters");
    }
    else if(password.value.length < 8){
      alert("password must be longer than eight characters");
    }
    else{
      var data = {
        username: username.value,
        password: password.value
      };
      var signup = JSON.stringify(data);
      Ajax("POST", "/api/signup", signup)
      .then(function(res){
        if(res.error){
          alert(res.error);
        }
        else{
          window.location = `/user/${res.id}`;
        }
      })
      .catch(function(err){
        alert(err);
      });
    }
  }
  else{
    alert("Username is not available");
  }
}

function checkAvailability(){
  var name = {
    "username": username.value
  };
  var nameToJson = JSON.stringify(name);
  Ajax("POST", "/api/checkusername", nameToJson)
  .then(function(isAvailable){
    if(!isAvailable){
      S(".username-taken-msg").style.opacity = 1;
      S(".username-taken-msg").textContent = `username ${username.value} is not aviailable.`;
      notTaken = false;
    }
    else{
      S(".username-taken-msg").style.opacity = 0;
      S(".username-taken-msg").textContent = ".";
      notTaken = true;
    }
  })
  .catch(function(err){
    alert(err);
    return false;
  });
  return notTaken;
}