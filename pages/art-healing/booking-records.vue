<template>
  <view class="booking-records-container">
    <view class="header">
      <text class="title">我的预约</text>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <!-- 预约记录列表 -->
    <view class="records-list" v-else-if="bookings.length > 0">
      <view 
        v-for="booking in bookings" 
        :key="booking.id"
        class="record-card"
        @click="viewDetail(booking.id)"
      >
        <view class="record-header">
          <text class="event-title">{{ booking.festivalTitle }}</text>
          <text class="status" :class="getStatusClass(booking.status)">
            {{ getStatusText(booking.status) }}
          </text>
        </view>
        
        <view class="record-info">
          <view class="info-row">
            <text class="info-icon">📅</text>
            <text class="info-text">{{ booking.festivalDate }} {{ booking.festivalTime }}</text>
          </view>
          <view class="info-row">
            <text class="info-icon">📍</text>
            <text class="info-text">{{ booking.festivalLocation }}</text>
          </view>
          <view class="info-row">
            <text class="info-icon">👤</text>
            <text class="info-text">{{ booking.formData.name }} | {{ booking.formData.participants }}人</text>
          </view>
        </view>
        
        <view class="record-footer">
          <text class="booking-time">预约时间：{{ formatDate(booking.createdAt) }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无预约记录</text>
      <button class="go-booking-btn" @click="goToBooking">去预约</button>
    </view>
  </view>
</template>

<script>
import ArtBookingService from '@/services/art-booking.service.js'

export default {
  data() {
    return {
      bookings: [],
      loading: true
    }
  },
  onShow() {
    this.loadBookings()
  },
  methods: {
    async loadBookings() {
      this.loading = true
      try {
        // Get bookings sorted by festival date (ascending)
        this.bookings = await ArtBookingService.getUserArtBookings()
      } catch (error) {
        console.error('Failed to load bookings:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    viewDetail(bookingId) {
      uni.navigateTo({
        url: `/pages/art-healing/booking-detail?id=${bookingId}`
      })
    },
    goToBooking() {
      uni.navigateTo({
        url: '/pages/art-healing/festival-booking'
      })
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
.booking-records-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #e65100 0%, #ff9800 60%, #ffb74d 100%);
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

.records-list {
  padding: 20rpx;
}

.record-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.event-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.status {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.status-pending {
  background: #fff3e0;
  color: #ff9800;
}

.status-confirmed {
  background: #e8f5e9;
  color: #4caf50;
}

.status-cancelled {
  background: #ffebee;
  color: #f44336;
}

.status-completed {
  background: #e3f2fd;
  color: #2196f3;
}

.record-info {
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.info-icon {
  margin-right: 12rpx;
  font-size: 26rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.booking-time {
  font-size: 24rpx;
  color: #999;
}

.arrow {
  font-size: 32rpx;
  color: #ccc;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.go-booking-btn {
  background: #ff9800;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
}
</style>
