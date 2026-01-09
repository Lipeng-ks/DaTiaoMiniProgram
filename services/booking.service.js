/**
 * BookingService - 预约服务
 * 负责预约业务逻辑处理
 */

import StorageService from './storage.service.js'

/**
 * 生成唯一ID
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * 创建预约
 * @param {string} eventId - 活动ID
 * @param {Object} event - 活动信息
 * @param {Object} formData - 表单数据
 * @returns {Promise<Object>} BookingResult
 */
export async function createBooking(eventId, event, formData) {
  try {
    const now = new Date().toISOString()
    
    const booking = {
      id: generateId(),
      eventId: eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      formData: {
        name: formData.name,
        phone: formData.phone,
        participants: formData.participants || 1,
        remark: formData.remark || ''
      },
      status: 'pending',
      createdAt: now,
      updatedAt: now
    }
    
    await StorageService.saveBooking(booking)
    
    return {
      success: true,
      bookingId: booking.id,
      message: '预约成功'
    }
  } catch (error) {
    console.error('Failed to create booking:', error)
    return {
      success: false,
      message: '预约失败，请重试'
    }
  }
}

/**
 * 取消预约
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object>} CancelResult
 */
export async function cancelBooking(bookingId) {
  try {
    const booking = await StorageService.getBookingById(bookingId)
    
    if (!booking) {
      return {
        success: false,
        message: '预约记录不存在'
      }
    }
    
    if (!canCancel(booking)) {
      return {
        success: false,
        message: '距离活动开始不足24小时，无法取消'
      }
    }
    
    await StorageService.updateBooking(bookingId, {
      status: 'cancelled'
    })
    
    return {
      success: true,
      message: '取消成功'
    }
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    return {
      success: false,
      message: '取消失败，请重试'
    }
  }
}

/**
 * 检查是否可取消（24小时规则）
 * @param {Object} booking - 预约记录
 * @returns {boolean}
 */
export function canCancel(booking) {
  if (!booking) return false
  
  // 只有待确认和已确认状态可以取消
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return false
  }
  
  // 检查24小时规则
  const eventDateTime = new Date(`${booking.eventDate}T${booking.eventTime}`)
  const now = new Date()
  const hoursUntilEvent = (eventDateTime - now) / (1000 * 60 * 60)
  
  return hoursUntilEvent >= 24
}

/**
 * 获取用户预约列表（按日期排序）
 * @returns {Promise<Array>}
 */
export async function getUserBookings() {
  try {
    const bookings = await StorageService.getBookings()
    
    // 按活动日期升序排序
    return bookings.sort((a, b) => {
      const dateA = new Date(`${a.eventDate}T${a.eventTime}`)
      const dateB = new Date(`${b.eventDate}T${b.eventTime}`)
      return dateA - dateB
    })
  } catch (error) {
    console.error('Failed to get user bookings:', error)
    return []
  }
}

/**
 * 获取单个预约详情
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object|null>}
 */
export async function getBookingDetail(bookingId) {
  return StorageService.getBookingById(bookingId)
}

/**
 * 验证表单数据
 * @param {Object} formData - 表单数据
 * @returns {Object} ValidationResult
 */
export function validateForm(formData) {
  const errors = []
  
  if (!formData.name || !formData.name.trim()) {
    errors.push({ field: 'name', message: '请输入姓名' })
  }
  
  if (!formData.phone || !formData.phone.trim()) {
    errors.push({ field: 'phone', message: '请输入手机号' })
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.push({ field: 'phone', message: '请输入正确的手机号码' })
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  }
}

export default {
  createBooking,
  cancelBooking,
  canCancel,
  getUserBookings,
  getBookingDetail,
  validateForm
}
