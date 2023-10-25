// 필요한 변수 초기화
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const waveformElement = document.getElementById('waveform');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
let mediaRecorder;
let audioChunks = [];
let mediaStream;

// 녹음을 시작하는 함수
async function startRecording() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
        drawWaveform(audioChunks);
      }
    };

    mediaRecorder.start();
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
  } catch (error) {
    console.error('녹음을 시작하는 동안 오류 발생:', error);
  }
}

// 녹음을 중지하고 오디오를 재생하는 함수
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaStream.getTracks().forEach((track) => track.stop());
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
  }
}

// 파형을 그리는 함수
function drawWaveform(chunks) {
  const audioBlob = new Blob(chunks, { type: 'audio/wav' });

  const audioURL = URL.createObjectURL(audioBlob);

  const audioElement = new Audio(audioURL);
  audioElement.controls = true;
  waveformElement.innerHTML = '';
  waveformElement.appendChild(audioElement);
}

// 버튼 클릭 이벤트 핸들러 연결
startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);
