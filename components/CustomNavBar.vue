<template>
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px', background: gradient }">
    <view class="nav-overlay"></view>
    <view class="nav-inner">
      <view class="nav-left" @click="showBack && handleBack()">
        <view v-if="showBack" class="back-btn">
          <text class="back-icon">‹</text>
        </view>
      </view>
      <view class="nav-center">
        <text class="nav-title">{{ title }}</text>
        <text v-if="subtitle" class="nav-subtitle">{{ subtitle }}</text>
      </view>
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomNavBar',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    gradient: { type: String, default: 'linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)' },
    showBack: { type: Boolean, default: true }
  },
  data() {
    return {
      statusBarHeight: 20
    }
  },
  created() {
    const info = uni.getSystemInfoSync()
    this.statusBarHeight = info.statusBarHeight || 20
  },
  methods: {
    handleBack() {
      this.$emit('back')
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding-bottom: 12rpx;
  overflow: hidden;
  border-bottom-left-radius: 28rpx;
  border-bottom-right-radius: 28rpx;
  box-shadow: 0 20rpx 44rpx rgba(0, 0, 0, 0.18);
}

.nav-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 35%, rgba(255, 255, 255, 0.12) 70%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0.7;
  mix-blend-mode: screen;
  pointer-events: none;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
  padding: 0 24rpx 14rpx;
  position: relative;
  z-index: 1;
}

.nav-left {
  min-width: 88rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.22);
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

.nav-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 38rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 2rpx;
  text-shadow: 0 6rpx 14rpx rgba(0, 0, 0, 0.2);
}

.nav-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
  margin-top: 6rpx;
  letter-spacing: 1rpx;
}

.nav-right {
  min-width: 88rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
