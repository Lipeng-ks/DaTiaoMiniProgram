<template>
  <view class="cooking-booking-container" :style="{ paddingTop: navPaddingTop + 'px' }">
    <custom-nav-bar
      title="线下美食制作体验预约"
      gradient="linear-gradient(120deg, #e65100 0%, #ff8f00 45%, #ffb300 100%)"
    />
    
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <!-- 体验活动列表 -->
    <view class="experience-list" v-else-if="experiences.length > 0">
      <view 
        v-for="experience in experiences" 
        :key="experience.id"
        class="experience-card"
      >
        <image :src="experience.image" class="experience-cover" mode="aspectFill"></image>
        <view class="experience-content">
          <text class="experience-title">{{ experience.title }}</text>
          <text class="experience-desc">{{ experience.description }}</text>
          <view class="experience-tags">
            <text class="dish-tag">🍳 {{ experience.dishName }}</text>
            <text class="difficulty-tag" :class="getDifficultyClass(experience.difficulty)">
              {{ experience.difficulty }}
            </text>
          </view>
          <view class="experience-info">
            <view class="info-item">
              <text class="info-icon">📅</text>
              <text class="info-text">{{ experience.date }} {{ experience.time }}</text>
            </view>
            <view class="info-item">
              <text class="info-icon">📍</text>
              <text class="info-text">{{ experience.location }}</text>
            </view>
            <view class="info-item">
              <text class="info-icon">👥</text>
              <text class="info-text" :class="{ 'sold-out': experience.availableSlots === 0 }">
                {{ experience.availableSlots === 0 ? '已满' : `剩余 ${experience.availableSlots} 个名额` }}
              </text>
            </view>
          </view>
          <button 
            class="book-btn"
            :class="{ disabled: experience.availableSlots === 0 }"
            :disabled="experience.availableSlots === 0"
            @click="openBookingForm(experience)"
          >
            {{ experience.availableSlots === 0 ? '已满' : '立即预约' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">👨‍🍳</text>
      <text class="empty-text">暂无美食制作体验活动</text>
    </view>

    <!-- 预约表单弹窗 -->
    <view class="booking-modal" v-if="showBookingForm" @click.self="closeBookingForm">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">预约信息</text>
          <text class="close-btn" @click="closeBookingForm">×</text>
        </view>
        
        <!-- 选中的体验活动信息 -->
        <view class="selected-experience-info" v-if="selectedExperience">
          <text class="experience-name">{{ selectedExperience.title }}</text>
          <text class="experience-datetime">{{ selectedExperience.date }} {{ selectedExperience.time }}</text>
          <text class="experience-place">{{ selectedExperience.location }}</text>
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
            placeholder="如有特殊需求请备注（如食物过敏等）"
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
            <text class="detail-value">{{ confirmationData.experienceTitle }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">活动时间</text>
            <text class="detail-value">{{ confirmationData.experienceDate }} {{ confirmationData.experienceTime }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">活动地点</text>
            <text class="detail-value">{{ confirmationData.experienceLocation }}</text>
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
import FoodBookingService from '@/services/food-booking.service.js'

export default {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      experiences: [],
      selectedExperience: null,
      showBookingForm: false,
      showConfirmation: false,
      loading: true,
      confirmationData: {
        experienceTitle: '',
        experienceDate: '',
        experienceTime: '',
        experienceLocation: '',
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
    this.loadExperiences()
  },
  methods: {
    /**
     * 加载美食制作体验活动列表
     */
    async loadExperiences() {
      this.loading = true
      try {
        this.experiences = await FoodBookingService.getCookingExperiences()
      } catch (err) {
        console.error('Failed to load experiences:', err)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    /**
     * 获取难度等级样式类
     * @param {string} difficulty - 难度等级
     * @returns {string}
     */
    getDifficultyClass(difficulty) {
      const classMap = {
        '简单': 'easy',
        '中等': 'medium',
        '困难': 'hard'
      }
      return classMap[difficulty] || 'medium'
    },
    
    /**
     * 跳转到预约记录页面
     */
    goToRecords() {
      uni.navigateTo({
        url: '/pages/food-healing/booking-records'
      })
    },
    
    /**
     * 打开预约表单弹窗
     * @param {Object} experience - 美食制作体验活动对象
     */
    openBookingForm(experience) {
      this.selectedExperience = experience
      this.showBookingForm = true
      this.resetForm()
    },
    
    /**
     * 关闭预约表单弹窗
     */
    closeBookingForm() {
      this.showBookingForm = false
      this.selectedExperience = null
      this.resetForm()
    },
    
    /**
     * 重置表单数据
     */
    resetForm() {
      this.formData = {
        name: '',
        phone: '',
        participants: 1,
        remark: ''
      }
      this.formErrors = {}
    },

    /**
     * 验证表单数据
     * @returns {boolean}
     */
    validateForm() {
      const result = FoodBookingService.validateFoodBookingForm(this.formData)
      
      // 转换错误格式
      const errors = {}
      if (!result.valid) {
        result.errors.forEach(err => {
          errors[err.field] = err.message
        })
      }
      
      this.formErrors = errors
      return result.valid
    },
    
    /**
     * 关闭确认弹窗
     */
    closeConfirmation() {
      this.showConfirmation = false
      this.confirmationData = {
        experienceTitle: '',
        experienceDate: '',
        experienceTime: '',
        experienceLocation: '',
        name: '',
        phone: '',
        participants: 1
      }
    },
    
    /**
     * 从确认弹窗跳转到预约记录
     */
    goToRecordsFromConfirm() {
      this.closeConfirmation()
      this.goToRecords()
    },
    
    /**
     * 提交预约
     */
    async submitBooking() {
      if (!this.validateForm()) {
        return
      }
      
      if (!this.selectedExperience) {
        uni.showToast({
          title: '请选择活动',
          icon: 'none'
        })
        return
      }
      
      const result = await FoodBookingService.createFoodBooking(
        this.selectedExperience.id,
        this.selectedExperience,
        this.formData
      )
      
      if (result.success) {
        // 更新本地活动剩余名额
        const expIndex = this.experiences.findIndex(e => e.id === this.selectedExperience.id)
        if (expIndex !== -1) {
          this.experiences[expIndex].availableSlots -= (this.formData.participants || 1)
        }
        
        // 保存确认信息
        this.confirmationData = {
          experienceTitle: this.selectedExperience.title,
          experienceDate: this.selectedExperience.date,
          experienceTime: this.selectedExperience.time,
          experienceLocation: this.selectedExperience.location,
          name: this.formData.name,
          phone: this.formData.phone,
          participants: this.formData.participants || 1
        }
        
        // 关闭表单，显示确认弹窗
        this.showBookingForm = false
        this.showConfirmation = true
        this.selectedExperience = null
        this.resetForm()
      } else {
        uni.showToast({
          title: result.message || '预约失败，请重试',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.cooking-booking-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 体验活动列表 */
.experience-list {
  padding: 20rpx;
}

.experience-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.experience-cover {
  width: 100%;
  height: 300rpx;
  background: #fff8e1;
}

.experience-content {
  padding: 30rpx;
}

.experience-title {
  display: block;
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.experience-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  line-height: 1.5;
}

.experience-tags {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.dish-tag {
  display: inline-block;
  background: #fff8e1;
  color: #ff8f00;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.difficulty-tag {
  display: inline-block;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.difficulty-tag.easy {
  background: #e8f5e9;
  color: #4caf50;
}

.difficulty-tag.medium {
  background: #fff3e0;
  color: #ff9800;
}

.difficulty-tag.hard {
  background: #ffebee;
  color: #f44336;
}

.experience-info {
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
  background: #ff8f00;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
  padding: 24rpx 0;
}

.book-btn.disabled {
  background: #ccc;
  color: #999;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 预约弹窗 */
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

/* 选中的体验活动信息 */
.selected-experience-info {
  background: #fff8e1;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.experience-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.experience-datetime {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.experience-place {
  display: block;
  font-size: 26rpx;
  color: #666;
}

/* 表单样式 */
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
  background: #ff8f00;
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 32rpx;
  padding: 28rpx 0;
  margin-top: 20rpx;
}

/* 确认弹窗 */
.confirmation-modal {
  text-align: center;
  padding: 60rpx 40rpx;
}

.success-icon {
  width: 120rpx;
  height: 120rpx;
  background: #ff8f00;
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
  background: #fff8e1;
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
  background: #ff8f00;
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
