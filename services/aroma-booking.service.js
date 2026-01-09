/**
 * AromaBookingService - 香氛沙龙预约服务
 * 负责香氛沙龙预约业务逻辑处理
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
 * 示例香氛沙龙活动数据
 */
const SAMPLE_SALONS = [
  {
    id: 'salon-1',
    title: '壮乡草本香氛调配体验',
    description: '学习壮族传统草本香氛调配技艺，亲手制作专属香氛产品',
    theme: '草本调香',
    date: '2026-02-15',
    time: '14:00',
    location: '南宁市青秀区民族大道88号香愈馆',
    availableSlots: 15,
    image: '/static/salons/herbal.jpg'
  },
  {
    id: 'salon-2',
    title: '精油芳疗放松沙龙',
    description: '体验壮族特色精油芳疗，学习精油使用方法与功效',
    theme: '精油芳疗',
    date: '2026-02-22',
    time: '10:00',
    location: '南宁市西乡塘区大学路100号疗愈中心',
    availableSlots: 20,
    image: '/static/salons/essential-oil.jpg'
  },
  {
    id: 'salon-3',
    title: '香薰蜡烛DIY工坊',
    description: '亲手制作壮族特色香薰蜡烛，感受香氛疗愈的魅力',
    theme: '蜡烛制作',
    date: '2026-03-01',
    time: '15:00',
    location: '南宁市江南区星光大道66号创意工坊',
    availableSlots: 12,
    image: '/static/salons/candle.jpg'
  },
  {
    id: 'salon-4',
    title: '壮乡香包香囊制作',
    description: '学习传统香包香囊制作工艺，了解壮族香文化历史',
    theme: '香包制作',
    date: '2026-03-15',
    time: '09:30',
    location: '广西民族博物馆手工体验区',
    availableSlots: 25,
    image: '/static/salons/sachet.jpg'
  }
]


/**
 * 获取香氛沙龙活动列表
 * @returns {Promise<Array>}
 */
export async function getSalons() {
  // 返回示例数据，实际项目中可从API获取
  return SAMPLE_SALONS
}

/**
 * 创建香氛沙龙预约
 * @param {string} salonId - 活动ID
 * @param {Object} salon - 活动信息
 * @param {Object} formData - 表单数据
 * @returns {Promise<Object>} BookingResult
 */
export async function createAromaBooking(salonId, salon, formData) {
  try {
    const now = new Date().toISOString()
    
    const booking = {
      id: generateId(),
      salonId: salonId,
      salonTitle: salon.title,
      salonDate: salon.date,
      salonTime: salon.time,
      salonLocation: salon.location,
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
    
    await StorageService.saveAromaBooking(booking)
    
    return {
      success: true,
      bookingId: booking.id,
      message: '预约成功'
    }
  } catch (error) {
    console.error('Failed to create aroma booking:', error)
    return {
      success: false,
      message: '预约失败，请重试'
    }
  }
}

/**
 * 取消香氛沙龙预约
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object>} CancelResult
 */
export async function cancelAromaBooking(bookingId) {
  try {
    const booking = await StorageService.getAromaBookingById(bookingId)
    
    if (!booking) {
      return {
        success: false,
        message: '预约记录不存在'
      }
    }
    
    if (!canCancelAromaBooking(booking)) {
      return {
        success: false,
        message: '距离活动开始不足24小时，无法取消'
      }
    }
    
    await StorageService.updateAromaBooking(bookingId, {
      status: 'cancelled'
    })
    
    return {
      success: true,
      message: '取消成功'
    }
  } catch (error) {
    console.error('Failed to cancel aroma booking:', error)
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
export function canCancelAromaBooking(booking) {
  if (!booking) return false
  
  // 只有待确认和已确认状态可以取消
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return false
  }
  
  // 检查24小时规则
  const salonDateTime = new Date(`${booking.salonDate}T${booking.salonTime}`)
  const now = new Date()
  const hoursUntilSalon = (salonDateTime - now) / (1000 * 60 * 60)
  
  return hoursUntilSalon >= 24
}

/**
 * 获取用户香氛沙龙预约列表（按日期排序）
 * @returns {Promise<Array>}
 */
export async function getUserAromaBookings() {
  try {
    const bookings = await StorageService.getAromaBookings()
    
    // 按活动日期升序排序
    return bookings.sort((a, b) => {
      const dateA = new Date(`${a.salonDate}T${a.salonTime}`)
      const dateB = new Date(`${b.salonDate}T${b.salonTime}`)
      return dateA - dateB
    })
  } catch (error) {
    console.error('Failed to get user aroma bookings:', error)
    return []
  }
}

/**
 * 获取单个香氛沙龙预约详情
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object|null>}
 */
export async function getAromaBookingDetail(bookingId) {
  return StorageService.getAromaBookingById(bookingId)
}

/**
 * 验证香氛沙龙预约表单数据
 * @param {Object} formData - 表单数据
 * @returns {Object} ValidationResult
 */
export function validateAromaBookingForm(formData) {
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
  getSalons,
  createAromaBooking,
  cancelAromaBooking,
  canCancelAromaBooking,
  getUserAromaBookings,
  getAromaBookingDetail,
  validateAromaBookingForm
}
