<template>
  <view class="online-duet-container" :style="{ paddingTop: navPaddingTop + 'px' }">
    <custom-nav-bar
      title="线上山歌对唱"
      gradient="linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)"
    />
    
    <!-- 分类选择 -->
    <view class="categories">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <text>{{ category.name }}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 歌曲列表 -->
    <view class="song-list">
      <view 
        v-for="song in filteredSongs" 
        :key="song.id"
        class="song-item"
        :class="{ selected: selectedSong && selectedSong.id === song.id }"
        @click="selectSong(song)"
      >
        <image :src="song.coverImage" class="song-cover" mode="aspectFill"></image>
        <view class="song-info">
          <text class="song-title">{{ song.title }}</text>
          <text class="song-artist">{{ song.artist }}</text>
        </view>
        <text class="song-duration">{{ formatDuration(song.duration) }}</text>
      </view>
    </view>
    
    <!-- 播放控制和录音面板 -->
    <view class="control-panel" v-if="selectedSong">
      <view class="now-playing">
        <text class="playing-title">{{ selectedSong.title }}</text>
        <view class="play-controls">
          <button class="control-btn" @click="togglePlay">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
        </view>
      </view>
      
      <!-- 歌词显示区域 -->
      <view class="lyrics-area" v-if="selectedSong.lyrics && selectedSong.lyrics.length">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: playProgress + '%' }"></view>
        </view>
        <text class="current-lyric">{{ currentLyric || '♪ 准备播放 ♪' }}</text>
        <text class="play-time">{{ formatDuration(Math.floor(currentPlayTime)) }} / {{ formatDuration(selectedSong.duration) }}</text>
      </view>
      
      <!-- 录音控制 -->
      <view class="record-panel">
        <view class="record-status" v-if="isRecording">
          <text class="recording-indicator">● 录音中</text>
          <text class="recording-duration">{{ formatDuration(recordingDuration) }}</text>
        </view>
        
        <view class="record-buttons">
          <button 
            class="record-btn" 
            :class="{ recording: isRecording }"
            @click="toggleRecording"
          >
            {{ isRecording ? '停止录音' : '开始录音' }}
          </button>
          
          <button 
            v-if="recordingPath" 
            class="preview-btn"
            @click="previewRecording"
          >
            预览录音
          </button>
          
          <button 
            v-if="recordingPath" 
            class="rerecord-btn"
            @click="reRecord"
          >
            重录
          </button>
          
          <button 
            v-if="recordingPath" 
            class="submit-btn"
            @click="submitRecording"
          >
            提交作品
          </button>
        </view>
      </view>
    </view>
    
    <!-- 未选择歌曲提示 -->
    <view class="empty-tip" v-else>
      <text>请选择一首歌曲开始对唱</text>
    </view>
  </view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue'
import AudioService from '@/services/audio.service.js'
import { categories, sampleSongs, filterSongsByCategory, validateRecordingSubmission } from '@/services/song.service.js'

export default {
  components: { CustomNavBar },
  data() {
    return {
      statusBarHeight: 20,
      navPaddingTop: 140,
      categories: categories,
      selectedCategory: 'love',
      songs: sampleSongs,
      selectedSong: null,
      isPlaying: false,
      isRecording: false,
      recordingPath: '',
      recordingDuration: 0,
      currentLyric: '',
      currentLyricIndex: -1,
      recordingTimer: null,
      currentPlayTime: 0
    }
  },
  computed: {
    filteredSongs() {
      return filterSongsByCategory(this.songs, this.selectedCategory)
    },
    playProgress() {
      if (!this.selectedSong || !this.selectedSong.duration) return 0
      return (this.currentPlayTime / this.selectedSong.duration) * 100
    }
  },
  onLoad() {
    const info = uni.getSystemInfoSync()
    const sbh = info.statusBarHeight || 20
    this.statusBarHeight = sbh
    // 导航栏高度: 状态栏 + 96rpx内容 + 12rpx底部padding + 14rpx底部内边距 ≈ 状态栏 + 75px
    this.navPaddingTop = sbh + 75
    this.setupAudioListeners()
  },
  onUnload() {
    this.cleanup()
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
      // Reset selected song when category changes
      this.selectedSong = null
      this.isPlaying = false
      this.currentLyric = ''
    },
    selectSong(song) {
      // Stop current playback if any
      if (this.isPlaying) {
        AudioService.stop()
      }
      this.selectedSong = song
      this.isPlaying = false
      this.recordingPath = ''
      this.recordingDuration = 0
      this.currentLyric = ''
      this.currentLyricIndex = -1
      this.currentPlayTime = 0
    },
    setupAudioListeners() {
      AudioService.onAudioEvent('timeUpdate', () => {
        this.updateLyric()
      })
      
      AudioService.onAudioEvent('ended', () => {
        this.isPlaying = false
        this.currentLyric = ''
        this.currentLyricIndex = -1
      })
      
      AudioService.onAudioEvent('error', (err) => {
        console.error('Audio playback error:', err)
        this.isPlaying = false
        uni.showToast({
          title: '音频加载失败，请重试',
          icon: 'none'
        })
      })
    },
    togglePlay() {
      if (!this.selectedSong) return
      
      if (this.isPlaying) {
        AudioService.pause()
        this.isPlaying = false
      } else {
        AudioService.playBgm(this.selectedSong.bgmUrl)
        this.isPlaying = true
      }
    },
    updateLyric() {
      if (!this.selectedSong || !this.selectedSong.lyrics) return
      
      const currentTime = AudioService.getCurrentTime() * 1000 // Convert to ms
      this.currentPlayTime = AudioService.getCurrentTime() // Update play time in seconds
      const lyrics = this.selectedSong.lyrics
      
      // Find the current lyric based on time
      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
          if (this.currentLyricIndex !== i) {
            this.currentLyricIndex = i
            this.currentLyric = lyrics[i].text
          }
          break
        }
      }
    },
    async toggleRecording() {
      if (this.isRecording) {
        await this.stopRecordingHandler()
      } else {
        await this.startRecordingHandler()
      }
    },
    async startRecordingHandler() {
      try {
        await AudioService.startRecord()
        this.isRecording = true
        this.recordingDuration = 0
        this.recordingPath = ''
        
        // Start duration timer
        this.recordingTimer = setInterval(() => {
          this.recordingDuration++
        }, 1000)
      } catch (err) {
        console.error('Failed to start recording:', err)
        uni.showToast({
          title: '录音启动失败，请检查麦克风权限',
          icon: 'none'
        })
      }
    },
    async stopRecordingHandler() {
      try {
        // Clear timer
        if (this.recordingTimer) {
          clearInterval(this.recordingTimer)
          this.recordingTimer = null
        }
        
        const result = await AudioService.stopRecord()
        this.isRecording = false
        this.recordingPath = result.tempFilePath
        this.recordingDuration = result.duration
        
        uni.showToast({
          title: '录音完成',
          icon: 'success'
        })
      } catch (err) {
        console.error('Failed to stop recording:', err)
        this.isRecording = false
        uni.showToast({
          title: '录音保存失败',
          icon: 'none'
        })
      }
    },
    previewRecording() {
      if (!this.recordingPath) {
        uni.showToast({
          title: '没有可预览的录音',
          icon: 'none'
        })
        return
      }
      AudioService.playRecord(this.recordingPath)
    },
    reRecord() {
      this.recordingPath = ''
      this.recordingDuration = 0
    },
    submitRecording() {
      // Use validation function from song service
      const validation = validateRecordingSubmission(this.selectedSong, this.recordingPath)
      
      if (!validation.valid) {
        uni.showToast({
          title: validation.message,
          icon: 'none'
        })
        return { success: false, message: validation.message }
      }
      
      // Submit success
      uni.showToast({
        title: '提交成功',
        icon: 'success'
      })
      
      // Reset recording state
      this.recordingPath = ''
      this.recordingDuration = 0
      
      return { success: true, message: '提交成功' }
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    cleanup() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer)
        this.recordingTimer = null
      }
      AudioService.stop()
      AudioService.destroy()
    }
  }
}
</script>

<style scoped>
.online-duet-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #4caf50 100%);
  padding: 48rpx 40rpx;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200rpx;
  height: 200rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 150rpx;
  height: 150rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.title {
  font-size: 38rpx;
  font-weight: 700;
  color: #ffffff;
  position: relative;
  z-index: 1;
  letter-spacing: 2rpx;
}

.categories {
  background: #ffffff;
  padding: 20rpx 0;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 16rpx 32rpx;
  margin-right: 20rpx;
  border-radius: 30rpx;
  background: #f0f0f0;
  font-size: 28rpx;
  color: #666;
}

.category-item.active {
  background: #2e7d32;
  color: #ffffff;
}

.song-list {
  padding: 20rpx;
}

.song-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.song-item.selected {
  border: 2rpx solid #2e7d32;
}

.song-cover {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.song-info {
  flex: 1;
}

.song-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.song-artist {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.song-duration {
  font-size: 24rpx;
  color: #999;
}

.control-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  padding: 30rpx;
}

.now-playing {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.playing-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.control-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #2e7d32;
  color: #ffffff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lyrics-area {
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8rpx;
  background: #e0e0e0;
  border-radius: 4rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2e7d32, #4caf50);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.current-lyric {
  font-size: 32rpx;
  color: #2e7d32;
  display: block;
  margin-bottom: 10rpx;
}

.play-time {
  font-size: 24rpx;
  color: #999;
}

.record-panel {
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.record-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.recording-indicator {
  color: #f44336;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.recording-duration {
  font-size: 28rpx;
  color: #666;
}

.record-buttons {
  display: flex;
  gap: 20rpx;
}

.record-btn {
  flex: 1;
  background: #2e7d32;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.record-btn.recording {
  background: #f44336;
}

.preview-btn, .submit-btn, .rerecord-btn {
  flex: 1;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.preview-btn {
  background: #ff9800;
  color: #ffffff;
}

.rerecord-btn {
  background: #9e9e9e;
  color: #ffffff;
}

.submit-btn {
  background: #4caf50;
  color: #ffffff;
}

.empty-tip {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 40rpx;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style>
