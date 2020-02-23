const create = e => document.createElement(e);
Element.prototype.class = function(c) {this.classList.add(c); return this}
Element.prototype.link  = function(h) {this.href = h;         return this}
Element.prototype.txt  = function(t) {this.textContent = t;    return this}

S(".loadmore-btn").addEventListener("click", function () {
  this.classList.toggle("hidden");
  S(".loadmore_loader").classList.toggle("hidden");
  let offset = S(".posts").children.length
  Ajax("Get", `/?json=true&offset=${offset}`, "")
      .then(posts => posts.forEach(post => render(post)))
      .then(() => {
        this.classList.toggle("hidden");
        S(".loadmore_loader").classList.toggle("hidden");
      })
})

function render(post){
  let postDiv     = create("div").class("post"),
      img         = create("img"),
      comments_a  = create("a").link(`/post/${post._id}/comments`),
      uname_h2    = create("h2"),
      uname_a2    = create("a").link(`/user/${post.owner.id}`).txt(post.owner.username),
      h3          = create("h3").txt(new Date(post.created).toString().substring(0, 15)),
      p           = create("p").txt(post.text.substring(0, 290)),
      span        = create("span").class("readmore").txt("..."),
      a3          = create("a").link(`/post/${post._id}`).txt("read more");
      uname_h2   .append(uname_a2)
      span       .append(a3)
      p          .append(span)
      postDiv    .append(img)
      postDiv    .append(comments_a)
      postDiv    .append(uname_h2)
      postDiv    .append(h3)
      postDiv    .append(p)
      S(".posts").append(postDiv)
      img.src = post.image
      comments_a.innerHTML = `<aside class="comments"><strong><i class="far fa-comment"></i> ${post.comments.length}</strong></aside>`
}

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