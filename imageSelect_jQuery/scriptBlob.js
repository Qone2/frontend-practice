let imagesBlob = [];

$('#imageInput').on('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const selectedIndex = $('#imageSelector').prop('selectedIndex');
      // 이미지의 Blob URL을 저장
      imagesBlob[selectedIndex] = URL.createObjectURL(file);
      displaySelectedImage();
    }
    reader.readAsDataURL(file);
  }
});

$('#imageSelector').on('change', displaySelectedImage);

function displaySelectedImage() {
  const selectedIndex = $('#imageSelector').prop('selectedIndex');
  if (imagesBlob[selectedIndex]) {
    $('#displayImage').attr('src', imagesBlob[selectedIndex]).show();
  } else {
    $('#displayImage').hide();
  }
}
