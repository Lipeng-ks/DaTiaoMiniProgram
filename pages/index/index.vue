<template>
  <view class="home-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="navbar-glow"></view>
      <view class="navbar-ribbon"></view>
      <view class="navbar-pattern"></view>
      <view class="navbar-curve"></view>
      <view class="navbar-content">
        <view class="navbar-left"></view>
        <view class="navbar-center">
          <text class="navbar-title">壮乡文化疗愈</text>
          <text class="navbar-subtitle">探索四大疗愈之旅</text>
        </view>
        <view class="navbar-right"></view>
      </view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content-area" :style="{ paddingTop: (statusBarHeight + 110) + 'px' }">
      <view class="healing-grid">
        <view 
          v-for="card in healingCards" 
          :key="card.id" 
          class="healing-card"
          :class="card.id"
          @click="navigateTo(card)"
        >
          <view class="card-icon" :class="card.id + '-icon'">
            <view class="icon-inner" v-html="card.svgIcon"></view>
          </view>
          <text class="card-title">{{ card.title }}</text>
          <text class="card-desc">{{ card.description }}</text>
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
      healingCards: [
        {
          id: 'sound-healing',
          title: '声愈',
          description: '山歌疗愈心灵',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
          path: '/pages/sound-healing/sound-healing',
          enabled: true
        },
        {
          id: 'art-healing',
          title: '艺愈',
          description: '艺术滋养身心',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
          path: '/pages/art-healing/art-healing',
          enabled: true
        },
        {
          id: 'aroma-healing',
          title: '香愈',
          description: '香气舒缓情绪',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c4.97 0 9-2.69 9-6v-2c0-3.31-4.03-6-9-6s-9 2.69-9 6v2c0 3.31 4.03 6 9 6z"/><path d="M12 8V2"/><path d="M8 4l4-2 4 2"/></svg>',
          path: '/pages/aroma-healing/aroma-healing',
          enabled: true
        },
        {
          id: 'food-healing',
          title: '食愈',
          description: '美食疗愈味蕾',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
          path: '/pages/food-healing/food-healing',
          enabled: true
        }
      ]
    }
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
  },
  methods: {
    navigateTo(card) {
      if (card.enabled && card.path) {
        uni.navigateTo({ url: card.path })
      } else {
        uni.showToast({ title: '功能开发中', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.home-container {
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

.healing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.healing-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 24rpx 36rpx;
  border-radius: 28rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
}

.healing-card:active {
  opacity: 0.9;
}

/* 声愈 - 绿色 */
.sound-healing {
  background: linear-gradient(145deg, #e8f5e9 0%, #c8e6c9 100%);
}
.sound-healing-icon {
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  color: #2e7d32;
}

/* 艺愈 - 橙色 */
.art-healing {
  background: linear-gradient(145deg, #fff3e0 0%, #ffe0b2 100%);
}
.art-healing-icon {
  background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
  color: #e65100;
}

/* 香愈 - 粉色 */
.aroma-healing {
  background: linear-gradient(145deg, #fce4ec 0%, #f8bbd0 100%);
}
.aroma-healing-icon {
  background: linear-gradient(135deg, #f8bbd0 0%, #f48fb1 100%);
  color: #c2185b;
}

/* 食愈 - 黄色 */
.food-healing {
  background: linear-gradient(145deg, #fff8e1 0%, #ffecb3 100%);
}
.food-healing-icon {
  background: linear-gradient(135deg, #ffecb3 0%, #ffe082 100%);
  color: #e65100;
}

.card-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.icon-inner {
  width: 48rpx;
  height: 48rpx;
}

.icon-inner svg {
  width: 100%;
  height: 100%;
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
}

.card-desc {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}
</style>
