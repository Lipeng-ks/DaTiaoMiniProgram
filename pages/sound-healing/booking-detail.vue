<template>
  <view class="booking-detail-container">
    <view class="header">
      <text class="title">预约详情</text>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <!-- 预约详情 -->
    <view class="detail-content" v-else-if="booking">
      <!-- 状态卡片 -->
      <view class="status-card" :class="getStatusClass(booking.status)">
        <text class="status-icon">{{ getStatusIcon(booking.status) }}</text>
        <text class="status-text">{{ getStatusText(booking.status) }}</text>
      </view>
      
      <!-- 活动信息 -->
      <view class="info-section">
        <text class="section-title">活动信息</text>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">活动名称</text>
            <text class="info-value">{{ booking.eventTitle }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">活动日期</text>
            <text class="info-value">{{ booking.eventDate }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">活动时间</text>
            <text class="info-value">{{ booking.eventTime }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">活动地点</text>
            <text class="info-value">{{ booking.eventLocation }}</text>
          </view>
        </view>
      </view>
      
      <!-- 预约人信息 -->
      <view class="info-section">
        <text class="section-title">预约人信息</text>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">姓名</text>
            <text class="info-value">{{ booking.formData.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">手机号</text>
            <text class="info-value">{{ booking.formData.phone }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">参与人数</text>
            <text class="info-value">{{ booking.formData.participants }}人</text>
          </view>
          <view class="info-row" v-if="booking.formData.remark">
            <text class="info-label">备注</text>
            <text class="info-value">{{ booking.formData.remark }}</text>
          </view>
        </view>
      </view>
      
      <!-- 预约时间 -->
      <view class="info-section">
        <text class="section-title">预约时间</text>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">创建时间</text>
            <text class="info-value">{{ formatDate(booking.createdAt) }}</text>
          </view>
          <view class="info-row" v-if="booking.updatedAt !== booking.createdAt">
            <text class="info-label">更新时间</text>
            <text class="info-value">{{ formatDate(booking.updatedAt) }}</text>
          </view>
        </view>
      </view>
      
      <!-- 取消按钮 -->
      <view class="action-section" v-if="canCancelBooking">
        <button class="cancel-btn" @click="handleCancel">取消预约</button>
        <text class="cancel-tip">距离活动开始超过24小时可取消</text>
      </view>
      
      <view class="action-section" v-else-if="booking.status === 'confirmed' || booking.status === 'pending'">
        <text class="cannot-cancel-tip">距离活动开始不足24小时，无法取消</text>
      </view>
    </view>
    
    <!-- 未找到预约 -->
    <view class="empty-state" v-else>
      <text class="empty-text">未找到预约信息</text>
    </view>
  </view>
</template>

<script>
import BookingService from '@/services/booking.service.js'

export default {
  data() {
    return {
      bookingId: '',
      booking: null,
      loading: true,
      canCancelBooking: false
    }
  },
  onLoad(options) {
    this.bookingId = options.id
    this.loadBookingDetail()
  },
  methods: {
    async loadBookingDetail() {
      this.loading = true
      try {
        // Load booking detail from BookingService
        this.booking = await BookingService.getBookingDetail(this.bookingId)
        this.checkCanCancel()
      } catch (error) {
        console.error('Failed to load booking detail:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    checkCanCancel() {
      if (!this.booking) {
        this.canCancelBooking = false
        return
      }
      
      // Use BookingService.canCancel to check 24-hour rule
      this.canCancelBooking = BookingService.canCancel(this.booking)
    },
    async handleCancel() {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消此预约吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.cancelBooking()
          }
        }
      })
    },
    async cancelBooking() {
      try {
        // Use BookingService to cancel booking with 24-hour rule validation
        const result = await BookingService.cancelBooking(this.bookingId)
        
        if (result.success) {
          uni.showToast({
            title: '取消成功',
            icon: 'success'
          })
          // Reload detail to show updated status
          await this.loadBookingDetail()
        } else {
          uni.showToast({
            title: result.message,
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('Failed to cancel booking:', error)
        uni.showToast({
          title: '取消失败',
          icon: 'none'
        })
      }
    },
    getStatusClass(status) {
      const classMap = {
        pending: 'status-pending',
        confirmed: 'status-confirmed',
        cancelled: 'status-cancelled',
        completed: 'status-completed'
      }
      return classMap[status] || ''
    },
    getStatusIcon(status) {
      const iconMap = {
        pending: '⏳',
        confirmed: '✓',
        cancelled: '✕',
        completed: '★'
      }
      return iconMap[status] || '?'
    },
    getStatusText(status) {
      const textMap = {
        pending: '待确认',
        confirmed: '已确认',
        cancelled: '已取消',
        completed: '已完成'
      }
      return textMap[status] || status
    },
    formatDate(isoString) {
      if (!isoString) return ''
      const date = new Date(isoString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style scoped>
.booking-detail-container {
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

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx;
  color: #999;
}

.detail-content {
  padding: 20rpx;
}

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
}

.status-card.status-pending {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.status-card.status-confirmed {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.status-card.status-cancelled {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.status-card.status-completed {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.status-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
}

.status-pending .status-text {
  color: #ff9800;
}

.status-confirmed .status-text {
  color: #4caf50;
}

.status-cancelled .status-text {
  color: #f44336;
}

.status-completed .status-text {
  color: #2196f3;
}

.info-section {
  margin-bottom: 30rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #666;
  margin-bottom: 16rpx;
  padding-left: 10rpx;
}

.info-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #999;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 20rpx;
}

.action-section {
  margin-top: 40rpx;
  padding: 0 20rpx;
}

.cancel-btn {
  width: 100%;
  background: #f44336;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 32rpx;
  padding: 28rpx 0;
}

.cancel-tip {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;
}

.cannot-cancel-tip {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: #f44336;
  padding: 30rpx;
  background: #ffebee;
  border-radius: 16rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
}
</style>
