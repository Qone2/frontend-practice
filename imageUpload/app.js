function showAndConvertToBlob() {
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      // Show image preview
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';

      // Convert the image to blob
      fetch(e.target.result)
        .then(res => res.blob())
        .then(blob => {
          console.log(blob);
          // 'blob' is the image in blob format, you can use or save it as required
        });
    }

    reader.readAsDataURL(fileInput.files[0]);
  }
}
