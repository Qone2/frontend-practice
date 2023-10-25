let images = [];

$('#imageInput').on('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const selectedIndex = $('#imageSelector').prop('selectedIndex');
      images[selectedIndex] = e.target.result;
      displaySelectedImage();
    }
    reader.readAsDataURL(file);
  }
});

$('#imageSelector').on('change', displaySelectedImage);

function displaySelectedImage() {
  const selectedIndex = $('#imageSelector').prop('selectedIndex');
  if (images[selectedIndex]) {
    $('#displayImage').attr('src', images[selectedIndex]);
    $('#displayImage').css("display", "block");
  } else {
    $('#displayImage').hide();
  }
}
