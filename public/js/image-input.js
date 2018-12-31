var imageInput = document.querySelector(".image-input");
var imageBtn = document.querySelector(".image-input-status-text");
  imageInput.addEventListener("input", function() {
    imageBtn.innerHTML = `Image Selected`;
  });
