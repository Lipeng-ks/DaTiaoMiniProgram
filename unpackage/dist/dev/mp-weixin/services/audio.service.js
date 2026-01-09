"use strict";
const common_vendor = require("../common/vendor.js");
let innerAudioContext = null;
let recorderManager = null;
function initAudioContext() {
  if (!innerAudioContext) {
    innerAudioContext = common_vendor.index.createInnerAudioContext();
    innerAudioContext.onError((err) => {
      common_vendor.index.__f__("error", "at services/audio.service.js:17", "Audio error:", err);
    });
  }
  return innerAudioContext;
}
function initRecorderManager() {
  if (!recorderManager) {
    recorderManager = common_vendor.index.getRecorderManager();
  }
  return recorderManager;
}
function playBgm(url) {
  const audio = initAudioContext();
  audio.src = url;
  audio.play();
}
function pause() {
  if (innerAudioContext) {
    innerAudioContext.pause();
  }
}
function stop() {
  if (innerAudioContext) {
    innerAudioContext.stop();
  }
}
function resume() {
  if (innerAudioContext) {
    innerAudioContext.play();
  }
}
function seek(position) {
  if (innerAudioContext) {
    innerAudioContext.seek(position);
  }
}
function getCurrentTime() {
  return innerAudioContext ? innerAudioContext.currentTime : 0;
}
function getDuration() {
  return innerAudioContext ? innerAudioContext.duration : 0;
}
function onAudioEvent(event, callback) {
  if (!innerAudioContext) {
    initAudioContext();
  }
  switch (event) {
    case "play":
      innerAudioContext.onPlay(callback);
      break;
    case "pause":
      innerAudioContext.onPause(callback);
      break;
    case "stop":
      innerAudioContext.onStop(callback);
      break;
    case "ended":
      innerAudioContext.onEnded(callback);
      break;
    case "timeUpdate":
      innerAudioContext.onTimeUpdate(callback);
      break;
    case "error":
      innerAudioContext.onError(callback);
      break;
  }
}
function startRecord() {
  return new Promise((resolve, reject) => {
    const recorder = initRecorderManager();
    recorder.onStart(() => {
      resolve();
    });
    recorder.onError((err) => {
      common_vendor.index.__f__("error", "at services/audio.service.js:141", "Recorder error:", err);
      reject(err);
    });
    recorder.start({
      duration: 6e5,
      // 最长10分钟
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 128e3,
      format: "mp3"
    });
  });
}
function stopRecord() {
  return new Promise((resolve, reject) => {
    const recorder = initRecorderManager();
    recorder.onStop((res) => {
      resolve({
        tempFilePath: res.tempFilePath,
        duration: Math.round(res.duration / 1e3)
        // 转换为秒
      });
    });
    recorder.onError((err) => {
      reject(err);
    });
    recorder.stop();
  });
}
function playRecord(path) {
  const audio = initAudioContext();
  audio.src = path;
  audio.play();
}
function onRecordEvent(event, callback) {
  const recorder = initRecorderManager();
  switch (event) {
    case "start":
      recorder.onStart(callback);
      break;
    case "stop":
      recorder.onStop(callback);
      break;
    case "pause":
      recorder.onPause(callback);
      break;
    case "resume":
      recorder.onResume(callback);
      break;
    case "error":
      recorder.onError(callback);
      break;
    case "frameRecorded":
      recorder.onFrameRecorded(callback);
      break;
  }
}
function destroy() {
  if (innerAudioContext) {
    innerAudioContext.destroy();
    innerAudioContext = null;
  }
}
const AudioService = {
  playBgm,
  pause,
  stop,
  resume,
  seek,
  getCurrentTime,
  getDuration,
  onAudioEvent,
  startRecord,
  stopRecord,
  playRecord,
  onRecordEvent,
  destroy
};
exports.AudioService = AudioService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/audio.service.js.map
