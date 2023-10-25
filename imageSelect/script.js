const imageInput = document.getElementById('imageInput');
const imageSelector = document.getElementById('imageSelector');
const displayImage = document.getElementById('displayImage');

let images = [];

imageInput.addEventListener('change', function() {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const selectedIndex = imageSelector.selectedIndex;
      images[selectedIndex] = e.target.result;
      displaySelectedImage();
    }
    reader.readAsDataURL(file);
  }
});

imageSelector.addEventListener('change', displaySelectedImage);

function displaySelectedImage() {
  const selectedIndex = imageSelector.selectedIndex;
  if (images[selectedIndex]) {
    displayImage.src = images[selectedIndex];
    displayImage.style.display = 'block';
  } else {
    displayImage.style.display = 'none';
  }
}
