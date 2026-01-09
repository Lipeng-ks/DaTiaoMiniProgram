/**
 * AudioService - 音频服务
 * 负责音频播放和录音功能
 */

let innerAudioContext = null
let recorderManager = null

/**
 * 初始化音频上下文
 */
function initAudioContext() {
  if (!innerAudioContext) {
    innerAudioContext = uni.createInnerAudioContext()
    
    innerAudioContext.onError((err) => {
      console.error('Audio error:', err)
    })
  }
  return innerAudioContext
}

/**
 * 初始化录音管理器
 */
function initRecorderManager() {
  if (!recorderManager) {
    recorderManager = uni.getRecorderManager()
  }
  return recorderManager
}

/**
 * 播放背景音乐
 * @param {string} url - 音频URL
 */
export function playBgm(url) {
  const audio = initAudioContext()
  audio.src = url
  audio.play()
}

/**
 * 暂停播放
 */
export function pause() {
  if (innerAudioContext) {
    innerAudioContext.pause()
  }
}

/**
 * 停止播放
 */
export function stop() {
  if (innerAudioContext) {
    innerAudioContext.stop()
  }
}

/**
 * 恢复播放
 */
export function resume() {
  if (innerAudioContext) {
    innerAudioContext.play()
  }
}

/**
 * 设置播放进度
 * @param {number} position - 播放位置（秒）
 */
export function seek(position) {
  if (innerAudioContext) {
    innerAudioContext.seek(position)
  }
}

/**
 * 获取当前播放时间
 * @returns {number}
 */
export function getCurrentTime() {
  return innerAudioContext ? innerAudioContext.currentTime : 0
}

/**
 * 获取音频总时长
 * @returns {number}
 */
export function getDuration() {
  return innerAudioContext ? innerAudioContext.duration : 0
}

/**
 * 监听播放事件
 * @param {string} event - 事件名称
 * @param {Function} callback - 回调函数
 */
export function onAudioEvent(event, callback) {
  if (!innerAudioContext) {
    initAudioContext()
  }
  
  switch (event) {
    case 'play':
      innerAudioContext.onPlay(callback)
      break
    case 'pause':
      innerAudioContext.onPause(callback)
      break
    case 'stop':
      innerAudioContext.onStop(callback)
      break
    case 'ended':
      innerAudioContext.onEnded(callback)
      break
    case 'timeUpdate':
      innerAudioContext.onTimeUpdate(callback)
      break
    case 'error':
      innerAudioContext.onError(callback)
      break
  }
}

/**
 * 开始录音
 * @returns {Promise<void>}
 */
export function startRecord() {
  return new Promise((resolve, reject) => {
    const recorder = initRecorderManager()
    
    recorder.onStart(() => {
      resolve()
    })
    
    recorder.onError((err) => {
      console.error('Recorder error:', err)
      reject(err)
    })
    
    recorder.start({
      duration: 600000, // 最长10分钟
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 128000,
      format: 'mp3'
    })
  })
}

/**
 * 停止录音
 * @returns {Promise<Object>} RecordResult
 */
export function stopRecord() {
  return new Promise((resolve, reject) => {
    const recorder = initRecorderManager()
    
    recorder.onStop((res) => {
      resolve({
        tempFilePath: res.tempFilePath,
        duration: Math.round(res.duration / 1000) // 转换为秒
      })
    })
    
    recorder.onError((err) => {
      reject(err)
    })
    
    recorder.stop()
  })
}

/**
 * 播放录音
 * @param {string} path - 录音文件路径
 */
export function playRecord(path) {
  const audio = initAudioContext()
  audio.src = path
  audio.play()
}

/**
 * 监听录音事件
 * @param {string} event - 事件名称
 * @param {Function} callback - 回调函数
 */
export function onRecordEvent(event, callback) {
  const recorder = initRecorderManager()
  
  switch (event) {
    case 'start':
      recorder.onStart(callback)
      break
    case 'stop':
      recorder.onStop(callback)
      break
    case 'pause':
      recorder.onPause(callback)
      break
    case 'resume':
      recorder.onResume(callback)
      break
    case 'error':
      recorder.onError(callback)
      break
    case 'frameRecorded':
      recorder.onFrameRecorded(callback)
      break
  }
}

/**
 * 销毁音频上下文
 */
export function destroy() {
  if (innerAudioContext) {
    innerAudioContext.destroy()
    innerAudioContext = null
  }
}

export default {
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
}
