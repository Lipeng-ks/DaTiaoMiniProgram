/**
 * EventService - 活动服务
 * 负责活动相关的业务逻辑
 */

/**
 * 渲染活动信息为显示字符串
 * @param {Object} event - 活动对象
 * @returns {Object} 包含渲染后的各字段信息
 */
export function renderEventInfo(event) {
  if (!event) {
    return null
  }
  
  return {
    date: event.date || '',
    time: event.time || '',
    location: event.location || '',
    availableSlots: event.availableSlots !== undefined ? event.availableSlots : null,
    slotsText: event.availableSlots === 0 ? '已满' : `剩余 ${event.availableSlots} 个名额`
  }
}

/**
 * 检查活动是否已满
 * @param {Object} event - 活动对象
 * @returns {boolean}
 */
export function isEventFull(event) {
  if (!event) return false
  return event.availableSlots === 0
}

/**
 * 获取预约按钮状态
 * @param {Object} event - 活动对象
 * @returns {Object} { disabled: boolean, text: string }
 */
export function getBookingButtonState(event) {
  if (!event) {
    return { disabled: true, text: '无效活动' }
  }
  
  const isFull = isEventFull(event)
  return {
    disabled: isFull,
    text: isFull ? '已满' : '立即预约'
  }
}

/**
 * 验证活动数据完整性
 * @param {Object} event - 活动对象
 * @returns {Object} { valid: boolean, missingFields: string[] }
 */
export function validateEventData(event) {
  const requiredFields = ['date', 'time', 'location', 'availableSlots']
  const missingFields = []
  
  if (!event) {
    return { valid: false, missingFields: requiredFields }
  }
  
  for (const field of requiredFields) {
    if (event[field] === undefined || event[field] === null || event[field] === '') {
      missingFields.push(field)
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  }
}

export default {
  renderEventInfo,
  isEventFull,
  getBookingButtonState,
  validateEventData
}
