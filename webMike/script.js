const startRecordingButton = document.getElementById("startRecording");
const pauseRecordingButton = document.getElementById("pauseRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const playRecordingButton = document.getElementById("playRecording");
const pausePlaybackButton = document.getElementById("pausePlayback");
const stopPlaybackButton = document.getElementById("stopPlayback");
const audioPlayback = document.getElementById("audioPlayback");

let mediaRecorder;
let audioChunks = [];
let audioContext;
let audioSource;
let isRecording = false;
let isPaused = false;
let isPlaying = false;

// 녹음 시작 버튼 클릭 이벤트 핸들러
startRecordingButton.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayback.src = audioUrl;
      audioPlayback.style.display = "block";
      audioChunks = [];
      playRecordingButton.disabled = false;
    };

    startRecordingButton.disabled = true;
    pauseRecordingButton.disabled = false;
    stopRecordingButton.disabled = false;
    mediaRecorder.start();
    isRecording = true;
  } catch (error) {
    console.error("녹음을 시작하는 중에 오류가 발생했습니다:", error);
  }
});

// 녹음 일시정지 버튼 클릭 이벤트 핸들러
pauseRecordingButton.addEventListener("click", () => {
  if (isRecording) {
    if (!isPaused) {
      mediaRecorder.pause();
      pauseRecordingButton.textContent = "녹음 재개";
      isPaused = true;
    } else {
      mediaRecorder.resume();
      pauseRecordingButton.textContent = "녹음 일시정지";
      isPaused = false;
    }
  }
});

// 녹음 정지 버튼 클릭 이벤트 핸들러
stopRecordingButton.addEventListener("click", () => {
  if (isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop()); // 미디어 요청 해제
    mediaRecorder = null; // MediaRecorder 객체 해제
    isRecording = false;
    startRecordingButton.disabled = false;
    pauseRecordingButton.disabled = true;
    stopRecordingButton.disabled = true;
    playRecordingButton.disabled = false;
  }
});

// 녹음 재생 버튼 클릭 이벤트 핸들러
playRecordingButton.addEventListener("click", () => {
  if (audioPlayback.src && !isRecording) {
    if (!isPlaying) {
      audioPlayback.play();
      playRecordingButton.textContent = "일시정지";
      pausePlaybackButton.disabled = false;
      stopPlaybackButton.disabled = false;
      isPlaying = true;
    } else {
      audioPlayback.pause();
      playRecordingButton.textContent = "재생";
      isPlaying = false;
    }
  }
});

// 일시정지 버튼 클릭 이벤트 핸들러 (재생 중에 사용)
pausePlaybackButton.addEventListener("click", () => {
  if (isPlaying) {
    if (audioPlayback.paused) {
      audioPlayback.play();
      pausePlaybackButton.textContent = "일시정지";
    } else {
      audioPlayback.pause();
      pausePlaybackButton.textContent = "재생 재개";
    }
  }
});

// 중지 버튼 클릭 이벤트 핸들러 (재생 중에 사용)
stopPlaybackButton.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayback.pause();
    audioPlayback.currentTime = 0;
    playRecordingButton.textContent = "녹음 재생";
    pausePlaybackButton.disabled = true;
    stopPlaybackButton.disabled = true;
    isPlaying = false;
  }
});
