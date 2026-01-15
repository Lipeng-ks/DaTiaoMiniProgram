<template>
  <view class="home-container">
    <!-- 顶部标题区 -->
    <view class="header-section" :style="{ paddingTop: (statusBarHeight + 10) + 'px' }">
      <view class="header-icon">
        <svg viewBox="0 0 24 24" fill="none" class="leaf-icon" stroke="#4caf50" stroke-width="2">
          <path d="M12 2C7.5 2 4 5.5 4 10c0 4.5 4.5 9 10 12 4.5-3 8-7.5 8-12 0-3.5-2.5-7-7-9z" fill="none"/>
          <path d="M12 22C12 22 12 12 12 6" stroke="#4caf50" stroke-linecap="round"/>
          <path d="M12 14C12 14 15 12 17 10" stroke="#4caf50" stroke-linecap="round"/>
          <path d="M12 10C12 10 9 9 7 8" stroke="#4caf50" stroke-linecap="round"/>
        </svg>
      </view>
      <text class="main-title">壮乡文化疗愈</text>
      <text class="sub-title">探索四大疗愈之旅</text>
      <view class="title-underline"></view>
    </view>
    
    <!-- 内容卡片列表 -->
    <view class="card-list">
      <view 
        v-for="card in healingCards" 
        :key="card.id" 
        class="feature-card"
        :class="card.id"
        :style="{ backgroundImage: card.bgImage ? 'url(' + card.bgImage + ')' : '' }"
        @click="navigateTo(card)"
      >
        <!-- 背景图层 (使用渐变模拟) -->
        <view class="card-bg-overlay"></view>
        
        <!-- 玻璃拟态内容框 -->
        <view class="glass-panel">
          <view class="panel-left">
            <view class="icon-box">
               <view class="icon-svg" v-html="card.svgIcon"></view>
            </view>
            <view class="text-content">
              <text class="card-name">{{ card.title }}</text>
              <text class="card-slogan">{{ card.description }}</text>
            </view>
          </view>
          <view class="arrow-btn">
            <view class="arrow-icon">→</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 (装饰用) - 已移除 -->
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
          // 简化的白色SVG
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
          path: '/pages/sound-healing/sound-healing',
          enabled: true,
          bgImage: '/static/Voicehealing.png'
        },
        {
          id: 'art-healing',
          title: '艺愈',
          description: '艺术滋养身心',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
          path: '/pages/art-healing/art-healing',
          enabled: true,
          bgImage: '/static/ArtHealing.png'
        },
        {
          id: 'food-healing',
          title: '食愈',
          description: '美食疗愈味蕾',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>',
          path: '/pages/food-healing/food-healing',
          enabled: true,
          bgImage: '/static/Foodhealing.png'
        },
        {
          id: 'aroma-healing',
          title: '香愈',
          description: '香气舒缓情绪',
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 22c4.97 0 9-2.69 9-6v-2c0-3.31-4.03-6-9-6s-9 2.69-9 6v2c0 3.31 4.03 6 9 6z"/><path d="M12 8V2"/><path d="M8 4l4-2 4 2"/></svg>',
          path: '/pages/aroma-healing/aroma-healing',
          enabled: true,
          bgImage: '/static/Aromatherapy.png'
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
  background: linear-gradient(180deg, #f0f7f4 0%, #fdfbf7 100%);
  padding-bottom: 100rpx; /* 为底部导航留出空间 */
  display: flex;
  flex-direction: column;
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40rpx;
}

.header-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}
.leaf-icon {
  width: 100%;
  height: 100%;
}

.main-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #1a3c34;
  letter-spacing: 2rpx;
  margin-bottom: 8rpx;
  font-family: serif; /* 尝试使用衬线体风格 */
}

.sub-title {
  font-size: 24rpx;
  color: #6d7d75;
  margin-bottom: 12rpx;
  letter-spacing: 4rpx;
}

.title-underline {
  width: 80rpx;
  height: 4rpx;
  background-color: #a5d6a7;
  border-radius: 2rpx;
}

.card-list {
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.feature-card {
  height: 340rpx;
  border-radius: 40rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0,0,0,0.08);
  background: #ccc; 
  background-size: 100% 100% !important;
  background-position: center;
  transition: transform 0.2s;
}

.feature-card:active {
  transform: scale(0.98);
}

/* 模拟背景图 - 实际上应该使用 assets 中的图片 */
.sound-healing {
  /* 森林深绿 */
  background: linear-gradient(160deg, #2d5a4c 0%, #1b3a31 100%);
}
.art-healing {
  /* 木纹金棕 */
  background: linear-gradient(160deg, #8d6e53 0%, #5d4037 100%);
}
.aroma-healing {
  /* 花卉柔粉/深红 */
  background: linear-gradient(160deg, #88394e 0%, #581d2a 100%);
}
.food-healing {
  /* 茶韵深褐 */
  background: linear-gradient(160deg, #5d4037 0%, #3e2723 100%);
}

.card-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 添加纹理叠加效果 */
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1) 0%, transparent 20%);
}

.glass-panel {
  position: absolute;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  height: 140rpx;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border-radius: 30rpx;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.panel-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.icon-box {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 48rpx;
  height: 48rpx;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.card-name {
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
}

.card-slogan {
  color: rgba(255,255,255,0.85);
  font-size: 22rpx;
}

.arrow-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
}

.arrow-icon {
  color: #333;
  font-size: 28rpx;
  font-weight: bold;
}


</style>
