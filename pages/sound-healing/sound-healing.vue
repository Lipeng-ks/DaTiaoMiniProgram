<template>
  <view class="sound-healing-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-glow"></view>
      <view class="navbar-ribbon"></view>
      <view class="navbar-pattern"></view>
      <view class="navbar-curve"></view>
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <view class="back-btn">
            <text class="back-icon">‹</text>
          </view>
        </view>
        <view class="navbar-center">
          <text class="navbar-title">声愈</text>
          <text class="navbar-subtitle">用歌声疗愈心灵</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content-area" :style="{ paddingTop: (statusBarHeight + 110) + 'px' }">
      <view class="entries">
        <view 
          v-for="entry in entries" 
          :key="entry.id" 
          class="entry-card"
          @click="navigateTo(entry.path)"
        >
          <view class="entry-icon">
            <view class="entry-icon-inner" v-html="entry.svgIcon"></view>
          </view>
          <view class="entry-info">
            <text class="entry-title">{{ entry.title }}</text>
            <text class="entry-desc">{{ entry.description }}</text>
          </view>
          <view class="arrow-icon">
            <text class="arrow">›</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      entries: [
        {
          id: 'online-duet',
          title: '线上山歌对唱',
          description: '选择喜爱的山歌，录制你的歌声',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
          path: '/pages/sound-healing/online-duet'
        },
        {
          id: 'offline-booking',
          title: '线下山歌挑战预约',
          description: '预约线下山歌活动，体验壮乡文化',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
          path: '/pages/sound-healing/offline-booking'
        }
      ]
    }
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    navigateTo(path) {
      uni.navigateTo({ url: path })
    }
  }
}
</script>

<style scoped>
.sound-healing-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #e8f5e9 0%, #ffffff 50%);
}

.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  overflow: hidden;
  background: linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%);
  box-shadow: 0 20rpx 44rpx rgba(46, 125, 50, 0.25);
  border-bottom-left-radius: 28rpx;
  border-bottom-right-radius: 28rpx;
  padding-bottom: 12rpx;
}

/* 装饰层不阻挡点击 */
.navbar-glow,
.navbar-ribbon,
.navbar-pattern,
.navbar-curve {
  pointer-events: none;
}

.custom-navbar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 35%, rgba(255, 255, 255, 0.12) 70%, rgba(255, 255, 255, 0.04) 100%);
  opacity: 0.6;
  mix-blend-mode: screen;
  pointer-events: none;
}

.navbar-glow {
  position: absolute;
  width: 320rpx;
  height: 320rpx;
  top: -140rpx;
  right: -120rpx;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.5), transparent 55%);
  filter: blur(28rpx);
  opacity: 0.72;
}

.navbar-ribbon {
  position: absolute;
  left: -30rpx;
  right: -30rpx;
  bottom: -32rpx;
  height: 96rpx;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.12), rgba(181, 255, 201, 0.26));
  transform: skewY(-4deg);
}

.navbar-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.14) 0, rgba(255, 255, 255, 0) 24%),
    radial-gradient(circle at 80% 18%, rgba(255, 255, 255, 0.1) 0, rgba(255, 255, 255, 0) 22%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent);
  background-size: 100% 100%, 100% 100%, 42rpx 42rpx;
  opacity: 0.95;
}

.navbar-curve {
  position: absolute;
  left: -60rpx;
  right: -60rpx;
  bottom: -46rpx;
  height: 120rpx;
  background: radial-gradient(120rpx 80rpx at 50% 0, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0));
  transform: translateY(8rpx);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 22rpx 14rpx;
}

.navbar-left {
  width: 88rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.back-icon {
  font-size: 44rpx;
  color: #ffffff;
  font-weight: 500;
  margin-left: -4rpx;
  line-height: 64rpx;
  height: 64rpx;
  text-align: center;
}

.navbar-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  font-size: 38rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 2rpx;
  text-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.2);
}

.navbar-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
  margin-top: 6rpx;
  letter-spacing: 1rpx;
}

.navbar-right {
  width: 88rpx;
}

.content-area {
  padding: 24rpx 30rpx;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.entry-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 36rpx;
  box-shadow: 0 8rpx 30rpx rgba(46, 125, 50, 0.1);
}

.entry-card:active {
  opacity: 0.9;
}

.entry-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  flex-shrink: 0;
}

.entry-icon-inner {
  width: 48rpx;
  height: 48rpx;
  color: #2e7d32;
}

.entry-icon-inner svg {
  width: 100%;
  height: 100%;
}

.entry-info {
  flex: 1;
  min-width: 0;
}

.entry-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
}

.entry-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.arrow-icon {
  width: 48rpx;
  height: 48rpx;
  background: #e8f5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arrow {
  font-size: 32rpx;
  color: #2e7d32;
  line-height: 1;
}
</style>
