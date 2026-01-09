<template>
  <view class="offline-booking-container" :style="{ paddingTop: navPaddingTop + 'px' }">
    <custom-nav-bar
      title="线下山歌挑战预约"
      gradient="linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)"
    />
    
    <!-- 活动列表 -->
    <view class="event-list">
      <view 
        v-for="event in events" 
        :key="event.id"
        class="event-card"
      >
        <image :src="event.coverImage" class="event-cover" mode="aspectFill"></image>
        <view class="event-content">
          <text class="event-title">{{ event.title }}</text>
          <view class="event-info">
            <view class="info-item">
              <text class="info-icon">📅</text>
              <text class="info-text">{{ event.date }} {{ event.time }}</text>
            </view>
            <view class="info-item">
              <text class="info-icon">📍</text>
              <text class="info-text">{{ event.location }}</text>
            </view>
            <view class="info-item">
              <text class="info-icon">👥</text>
              <text class="info-text" :class="{ 'sold-out': event.availableSlots === 0 }">
                {{ event.availableSlots === 0 ? '已满' : `剩余 ${event.availableSlots} 个名额` }}
              </text>
            </view>
          </view>
          <button 
            class="book-btn"
            :class="{ disabled: event.availableSlots === 0 }"
            :disabled="event.availableSlots === 0"
            @click="openBookingForm(event)"
          >
            {{ event.availableSlots === 0 ? '已满' : '立即预约' }}
          </button>
        </view>
      </view>
    </view>
    
    <!-- 预约表单弹窗 -->
    <view class="booking-modal" v-if="showBookingForm" @click.self="closeBookingForm">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">预约信息</text>
          <text class="close-btn" @click="closeBookingForm">×</text>
        </view>
        
        <!-- 选中的活动信息 -->
        <view class="selected-event-info" v-if="selectedEvent">
          <text class="event-name">{{ selectedEvent.title }}</text>
          <text class="event-datetime">{{ selectedEvent.date }} {{ selectedEvent.time }}</text>
          <text class="event-place">{{ selectedEvent.location }}</text>
        </view>
        
        <view class="form-group">
          <text class="form-label">姓名 <text class="required">*</text></text>
          <input 
            class="form-input"
            :class="{ error: formErrors.name }"
            v-model="formData.name"
            placeholder="请输入您的姓名"
          />
          <text class="error-text" v-if="formErrors.name">{{ formErrors.name }}</text>
        </view>
        
        <view class="form-group">
          <text class="form-label">手机号 <text class="required">*</text></text>
          <input 
            class="form-input"
            :class="{ error: formErrors.phone }"
            v-model="formData.phone"
            type="number"
            placeholder="请输入您的手机号"
          />
          <text class="error-text" v-if="formErrors.phone">{{ formErrors.phone }}</text>
        </view>
        
        <view class="form-group">
          <text class="form-label">参与人数</text>
          <input 
            class="form-input"
            v-model="formData.participants"
            type="number"
            placeholder="默认1人"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">备注</text>
          <textarea 
            class="form-textarea"
            v-model="formData.remark"
            placeholder="如有特殊需求请备注"
          ></textarea>
        </view>
        
        <button class="submit-btn" @click="submitBooking">确认预约</button>
      </view>
    </view>
    
    <!-- 预约成功确认弹窗 -->
    <view class="booking-modal" v-if="showConfirmation" @click.self="closeConfirmation">
      <view class="modal-content confirmation-modal">
        <view class="success-icon">✓</view>
        <text class="success-title">预约成功</text>
        <view class="confirmation-details">
          <view class="detail-item">
            <text class="detail-label">活动名称</text>
            <text class="detail-value">{{ confirmationData.eventTitle }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">活动时间</text>
            <text class="detail-value">{{ confirmationData.eventDate }} {{ confirmationData.eventTime }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">活动地点</text>
            <text class="detail-value">{{ confirmationData.eventLocation }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">预约人</text>
            <text class="detail-value">{{ confirmationData.name }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">联系电话</text>
            <text class="detail-value">{{ confirmationData.phone }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">参与人数</text>
            <text class="detail-value">{{ confirmationData.participants }}人</text>
          </view>
        </view>
        <view class="confirmation-actions">
          <button class="view-records-btn" @click="goToRecordsFromConfirm">查看我的预约</button>
          <button class="close-confirm-btn" @click="closeConfirmation">返回活动列表</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue'
import BookingService from '../../services/booking.service.js'

export default {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      events: [
        {
          id: 'event-001',
          title: '壮乡山歌挑战赛·春季篇',
          description: '体验壮族传统山歌文化，与歌王歌后同台竞技',
          date: '2026-02-15',
          time: '14:00',
          location: '南宁市民族文化中心',
          address: '南宁市青秀区民族大道123号',
          totalSlots: 50,
          availableSlots: 12,
          requirements: '热爱山歌文化，年满18周岁',
          coverImage: '/static/pexels-pripicart-620337.jpg'
        },
        {
          id: 'event-002',
          title: '山歌传承工作坊',
          description: '跟随非遗传承人学习正宗壮族山歌',
          date: '2026-02-20',
          time: '09:30',
          location: '武鸣区文化馆',
          address: '南宁市武鸣区城厢镇文化路88号',
          totalSlots: 30,
          availableSlots: 0,
          requirements: '对山歌有浓厚兴趣',
          coverImage: '/static/logo.png'
        },
        {
          id: 'event-003',
          title: '三月三山歌节预热活动',
          description: '提前感受三月三山歌节的热烈氛围',
          date: '2026-03-01',
          time: '10:00',
          location: '青秀山风景区',
          address: '南宁市青秀区青山路19号',
          totalSlots: 100,
          availableSlots: 45,
          requirements: '无特殊要求',
          coverImage: '/static/logo.png'
        },
        {
          id: 'event-004',
          title: '亲子山歌体验营',
          description: '带孩子一起感受壮乡山歌魅力',
          date: '2026-03-08',
          time: '15:00',
          location: '广西民族博物馆',
          address: '南宁市青秀区青环路11号',
          totalSlots: 40,
          availableSlots: 8,
          requirements: '需家长陪同，儿童年龄6-14岁',
          coverImage: '/static/logo.png'
        }
      ],
      selectedEvent: null,
      showBookingForm: false,
      showConfirmation: false,
      confirmationData: {
        eventTitle: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        name: '',
        phone: '',
        participants: 1
      },
      formData: {
        name: '',
        phone: '',
        participants: 1,
        remark: ''
      },
      formErrors: {}
    }
  },
  onLoad() {
    const info = uni.getSystemInfoSync()
    this.navPaddingTop = (info.statusBarHeight || 20) + 75
  },
  methods: {
    goToRecords() {
      uni.navigateTo({
        url: '/pages/sound-healing/booking-records'
      })
    },
    openBookingForm(event) {
      this.selectedEvent = event
      this.showBookingForm = true
      this.resetForm()
    },
    closeBookingForm() {
      this.showBookingForm = false
      this.selectedEvent = null
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        name: '',
        phone: '',
        participants: 1,
        remark: ''
      }
      this.formErrors = {}
    },
    validateForm() {
      const errors = {}
      
      if (!this.formData.name || !this.formData.name.trim()) {
        errors.name = '请输入姓名'
      }
      
      if (!this.formData.phone || !this.formData.phone.trim()) {
        errors.phone = '请输入手机号'
      } else if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        errors.phone = '请输入正确的手机号码'
      }
      
      this.formErrors = errors
      return Object.keys(errors).length === 0
    },
    closeConfirmation() {
      this.showConfirmation = false
      this.confirmationData = {
        eventTitle: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        name: '',
        phone: '',
        participants: 1
      }
    },
    goToRecordsFromConfirm() {
      this.closeConfirmation()
      this.goToRecords()
    },
    async submitBooking() {
      if (!this.validateForm()) {
        return
      }
      
      if (!this.selectedEvent) {
        uni.showToast({
          title: '请选择活动',
          icon: 'none'
        })
        return
      }
      
      const result = await BookingService.createBooking(
        this.selectedEvent.id,
        this.selectedEvent,
        this.formData
      )
      
      if (result.success) {
        // 更新本地活动剩余名额
        const eventIndex = this.events.findIndex(e => e.id === this.selectedEvent.id)
        if (eventIndex !== -1) {
          this.events[eventIndex].availableSlots -= (this.formData.participants || 1)
        }
        
        // 保存确认信息
        this.confirmationData = {
          eventTitle: this.selectedEvent.title,
          eventDate: this.selectedEvent.date,
          eventTime: this.selectedEvent.time,
          eventLocation: this.selectedEvent.location,
          name: this.formData.name,
          phone: this.formData.phone,
          participants: this.formData.participants || 1
        }
        
        // 关闭表单，显示确认弹窗
        this.showBookingForm = false
        this.showConfirmation = true
        this.selectedEvent = null
        this.resetForm()
      } else {
        uni.showToast({
          title: result.message || '预约失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.offline-booking-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.event-list {
  padding: 20rpx;
}

.event-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.event-cover {
  width: 100%;
  height: 300rpx;
}

.event-content {
  padding: 30rpx;
}

.event-title {
  display: block;
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.event-info {
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.info-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}

.info-text {
  font-size: 26rpx;
  color: #666;
}

.info-text.sold-out {
  color: #f44336;
  font-weight: 600;
}

.book-btn {
  width: 100%;
  background: #2e7d32;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
  padding: 24rpx 0;
}

.book-btn.disabled {
  background: #ccc;
  color: #999;
}

.booking-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 40rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 48rpx;
  color: #999;
  line-height: 1;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.required {
  color: #f44336;
}

.form-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-input.error {
  border-color: #f44336;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.error-text {
  display: block;
  font-size: 24rpx;
  color: #f44336;
  margin-top: 8rpx;
}

.submit-btn {
  width: 100%;
  background: #2e7d32;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 32rpx;
  padding: 28rpx 0;
  margin-top: 20rpx;
}

.selected-event-info {
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.event-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.event-datetime {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.event-place {
  display: block;
  font-size: 26rpx;
  color: #666;
}

.confirmation-modal {
  text-align: center;
  padding: 60rpx 40rpx;
}

.success-icon {
  width: 120rpx;
  height: 120rpx;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  font-size: 60rpx;
  color: #ffffff;
}

.success-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
}

.confirmation-details {
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: left;
  margin-bottom: 40rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 26rpx;
  color: #999;
}

.detail-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.view-records-btn {
  width: 100%;
  background: #2e7d32;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
  padding: 24rpx 0;
}

.close-confirm-btn {
  width: 100%;
  background: #f5f5f5;
  color: #666;
  border-radius: 40rpx;
  font-size: 30rpx;
  padding: 24rpx 0;
}
</style>
