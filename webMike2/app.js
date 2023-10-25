let chunks = [];
let recorder, mediaStream;

const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');

let isRecording = false;

recordButton.addEventListener('click', function() {

  if (!isRecording) { // Start recording
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        mediaStream = stream;

        // Create a MediaRecorder instance
        recorder = new MediaRecorder(stream);

        // Start recording
        recorder.start();

        // Listen to dataavailable event
        recorder.ondataavailable = function(e) {
          chunks.push(e.data);

          if(recorder.state == 'inactive'){
            let blob = new Blob(chunks, { type : 'audio/mp3' });
            createAudioElement(URL.createObjectURL(blob));
          }
        };

      }).catch(function(err) {
      console.log('The following error occurred: ' + err);
    });

    recordButton.innerHTML = '&#9632;'; // Change button to square symbol

    isRecording = true;
  } else { // Stop recording

    if (recorder && recorder.state == 'recording') {
      recorder.stop();
      mediaStream.getTracks().forEach(track => track.stop());
    }

    recordButton.innerHTML = '&#9679;'; // Change button back to circle symbol

    isRecording= false;
  }
});

function createAudioElement(blobUrl){
  const downloadElm = document.createElement("a");
  downloadElm.href = blobUrl;
  downloadElm.download ='audio.mp3';
  downloadElm.innerHTML ='Download the audio file.';
  document.body.appendChild(downloadElm);
}
