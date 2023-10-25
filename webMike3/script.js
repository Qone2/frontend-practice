let mediaRecorder;
let audioChunks = [];
let audioBlob;
const recordButton = document.getElementById('recordButton');
const playButton = document.getElementById('playButton');

recordButton.addEventListener('click', function () {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    updateUIForStoppedRecording();
  } else {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
          audioChunks = [];
          // 녹음 중지 후 MediaStream의 모든 트랙 종료
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        updateUIForRecording();
      }).catch(err => {
      console.error("Error:", err);
    });
  }
});

playButton.addEventListener('click', function () {
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
