$(document).ready(function() {
  let currentRecorder = null;

  $('.recorder').each(function() {
    const $recorder = $(this);
    const $recordButton = $recorder.find('.recordButton');
    const $playButton = $recorder.find('.playButton');
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    $recordButton.on('click', function() {
      if (currentRecorder && currentRecorder !== $recorder[0]) {
        const currentMediaRecorder = currentRecorder.mediaRecorder;
        if (currentMediaRecorder && currentMediaRecorder.state === "recording") {
          $(currentRecorder).find('.recordButton').click();
        }
      }
      currentRecorder = $recorder[0];

      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            $recorder[0].mediaRecorder = mediaRecorder;
            mediaRecorder.ondataavailable = event => {
              audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
              audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
              audioChunks = [];
              stream.getTracks().forEach(track => track.stop());
              updateUIForStoppedRecording();
            };

            mediaRecorder.start();
            updateUIForRecording();
          }).catch(err => {
          console.error("Error:", err);
        });
      }
    });

    $playButton.on('click', function() {
      if (audioBlob) {
        let audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
        $recordButton.prop('disabled', true);
        audio.onended = () => {
          $recordButton.prop('disabled', false);
        };
      }
    });

    function updateUIForRecording() {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        $recordButton.text("⏹️");
        $playButton.prop('disabled', true);
      }
    }

    function updateUIForStoppedRecording() {
      $recordButton.text("🎤");
      $playButton.prop('disabled', false);
    }
  });
});
