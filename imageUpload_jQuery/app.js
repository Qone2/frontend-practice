$(document).ready(function() {
  $('#fileInput').on('change', function() {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        // Show image preview
        $('#imagePreview').attr('src', e.target.result).show();

        // Convert the image to blob
        fetch(e.target.result)
          .then(res => res.blob())
          .then(blob => {
            console.log(blob);
            // 'blob' is the image in blob format, you can use or save it as required
          });
      }

      reader.readAsDataURL(file);
    }
  });
});
