document.addEventListener('DOMContentLoaded', function() {
  const recorders = document.querySelectorAll('.recorder');
  let currentRecorder = null;

  recorders.forEach(recorder => {
    const recordButton = recorder.querySelector('.recordButton');
    const playButton = recorder.querySelector('.playButton');
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    recordButton.addEventListener('click', function() {
      if (currentRecorder && currentRecorder !== recorder) {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          currentRecorder.querySelector('.recordButton').click();
        }
      }
      currentRecorder = recorder;

      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
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

    playButton.addEventListener('click', function() {
      if (audioBlob) {
        let audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
        recordButton.setAttribute('disabled', 'disabled');
        audio.onended = () => {
          recordButton.removeAttribute('disabled');
        };
      }
    });

    function updateUIForRecording() {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        recordButton.textContent = "⏹️";
        playButton.setAttribute('disabled', 'disabled');
      }
    }

    function updateUIForStoppedRecording() {
      recordButton.textContent = "🎤";
      playButton.removeAttribute('disabled');
    }
  });
});
