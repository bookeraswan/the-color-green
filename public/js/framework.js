const S = select => {return document.querySelector(select)};
function Ajax(method, url, data) {
  var XHR = new XMLHttpRequest();

  var P = new Promise(function(resolve, reject){
    XHR.onreadystatechange = function(){
        if(XHR.readyState == 4){
          if(XHR.status == 200){
            resolve(JSON.parse(XHR.responseText));
          }
          else{
            reject(Error("There was an error"));
          }
        }
      }
  });
  XHR.open(method, url);
  XHR.setRequestHeader("content-type", "application/json");
  XHR.send(data);
  return P;
};
