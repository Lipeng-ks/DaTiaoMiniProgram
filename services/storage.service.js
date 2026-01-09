/**
 * StorageService - 本地存储服务
 * 负责预约数据的持久化存储
 */

const BOOKINGS_KEY = 'sound_healing_bookings'
const ART_BOOKINGS_KEY = 'art_healing_bookings'
const AROMA_BOOKINGS_KEY = 'aroma_healing_bookings'
const FOOD_BOOKINGS_KEY = 'food_healing_bookings'

/**
 * 保存预约记录
 * @param {Object} booking - 预约记录对象
 * @returns {Promise<void>}
 */
export function saveBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync()
      bookings.push(booking)
      uni.setStorageSync(BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取所有预约记录
 * @returns {Promise<Array>}
 */
export function getBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync()
      resolve(bookings)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 同步获取所有预约记录
 * @returns {Array}
 */
export function getBookingsSync() {
  try {
    const data = uni.getStorageSync(BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to get bookings from storage:', error)
    return []
  }
}

/**
 * 更新预约记录
 * @param {string} bookingId - 预约ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<void>}
 */
export function updateBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync()
      const index = bookings.findIndex(b => b.id === bookingId)
      
      if (index === -1) {
        reject(new Error('Booking not found'))
        return
      }
      
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      uni.setStorageSync(BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 删除预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<void>}
 */
export function deleteBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync()
      const filteredBookings = bookings.filter(b => b.id !== bookingId)
      
      uni.setStorageSync(BOOKINGS_KEY, JSON.stringify(filteredBookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 根据ID获取单个预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object|null>}
 */
export function getBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync()
      const booking = bookings.find(b => b.id === bookingId)
      resolve(booking || null)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 清空所有预约记录
 * @returns {Promise<void>}
 */
export function clearBookings() {
  return new Promise((resolve, reject) => {
    try {
      uni.removeStorageSync(BOOKINGS_KEY)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// ==================== 艺愈模块存储方法 ====================

/**
 * 保存艺术节预约记录
 * @param {Object} booking - 预约记录对象
 * @returns {Promise<void>}
 */
export function saveArtBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync()
      bookings.push(booking)
      uni.setStorageSync(ART_BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取所有艺术节预约记录
 * @returns {Promise<Array>}
 */
export function getArtBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync()
      resolve(bookings)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 同步获取所有艺术节预约记录
 * @returns {Array}
 */
export function getArtBookingsSync() {
  try {
    const data = uni.getStorageSync(ART_BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to get art bookings from storage:', error)
    return []
  }
}

/**
 * 更新艺术节预约记录
 * @param {string} bookingId - 预约ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<void>}
 */
export function updateArtBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync()
      const index = bookings.findIndex(b => b.id === bookingId)
      
      if (index === -1) {
        reject(new Error('Art booking not found'))
        return
      }
      
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      uni.setStorageSync(ART_BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 删除艺术节预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<void>}
 */
export function deleteArtBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync()
      const filteredBookings = bookings.filter(b => b.id !== bookingId)
      
      uni.setStorageSync(ART_BOOKINGS_KEY, JSON.stringify(filteredBookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 根据ID获取单个艺术节预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object|null>}
 */
export function getArtBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync()
      const booking = bookings.find(b => b.id === bookingId)
      resolve(booking || null)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 清空所有艺术节预约记录
 * @returns {Promise<void>}
 */
export function clearArtBookings() {
  return new Promise((resolve, reject) => {
    try {
      uni.removeStorageSync(ART_BOOKINGS_KEY)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// ==================== 香愈模块存储方法 ====================

/**
 * 保存香氛沙龙预约记录
 * @param {Object} booking - 预约记录对象
 * @returns {Promise<void>}
 */
export function saveAromaBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync()
      bookings.push(booking)
      uni.setStorageSync(AROMA_BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取所有香氛沙龙预约记录
 * @returns {Promise<Array>}
 */
export function getAromaBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync()
      resolve(bookings)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 同步获取所有香氛沙龙预约记录
 * @returns {Array}
 */
export function getAromaBookingsSync() {
  try {
    const data = uni.getStorageSync(AROMA_BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to get aroma bookings from storage:', error)
    return []
  }
}

/**
 * 更新香氛沙龙预约记录
 * @param {string} bookingId - 预约ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<void>}
 */
export function updateAromaBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync()
      const index = bookings.findIndex(b => b.id === bookingId)
      
      if (index === -1) {
        reject(new Error('Aroma booking not found'))
        return
      }
      
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      uni.setStorageSync(AROMA_BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 删除香氛沙龙预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<void>}
 */
export function deleteAromaBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync()
      const filteredBookings = bookings.filter(b => b.id !== bookingId)
      
      uni.setStorageSync(AROMA_BOOKINGS_KEY, JSON.stringify(filteredBookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 根据ID获取单个香氛沙龙预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object|null>}
 */
export function getAromaBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync()
      const booking = bookings.find(b => b.id === bookingId)
      resolve(booking || null)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 清空所有香氛沙龙预约记录
 * @returns {Promise<void>}
 */
export function clearAromaBookings() {
  return new Promise((resolve, reject) => {
    try {
      uni.removeStorageSync(AROMA_BOOKINGS_KEY)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// ==================== 食愈模块存储方法 ====================

/**
 * 保存美食制作体验预约记录
 * @param {Object} booking - 预约记录对象
 * @returns {Promise<void>}
 */
export function saveFoodBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync()
      bookings.push(booking)
      uni.setStorageSync(FOOD_BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 获取所有美食制作体验预约记录
 * @returns {Promise<Array>}
 */
export function getFoodBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync()
      resolve(bookings)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 同步获取所有美食制作体验预约记录
 * @returns {Array}
 */
export function getFoodBookingsSync() {
  try {
    const data = uni.getStorageSync(FOOD_BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to get food bookings from storage:', error)
    return []
  }
}

/**
 * 更新美食制作体验预约记录
 * @param {string} bookingId - 预约ID
 * @param {Object} data - 要更新的数据
 * @returns {Promise<void>}
 */
export function updateFoodBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync()
      const index = bookings.findIndex(b => b.id === bookingId)
      
      if (index === -1) {
        reject(new Error('Food booking not found'))
        return
      }
      
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      uni.setStorageSync(FOOD_BOOKINGS_KEY, JSON.stringify(bookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 删除美食制作体验预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<void>}
 */
export function deleteFoodBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync()
      const filteredBookings = bookings.filter(b => b.id !== bookingId)
      
      uni.setStorageSync(FOOD_BOOKINGS_KEY, JSON.stringify(filteredBookings))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 根据ID获取单个美食制作体验预约记录
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object|null>}
 */
export function getFoodBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync()
      const booking = bookings.find(b => b.id === bookingId)
      resolve(booking || null)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 清空所有美食制作体验预约记录
 * @returns {Promise<void>}
 */
export function clearFoodBookings() {
  return new Promise((resolve, reject) => {
    try {
      uni.removeStorageSync(FOOD_BOOKINGS_KEY)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  saveBooking,
  getBookings,
  getBookingsSync,
  updateBooking,
  deleteBooking,
  getBookingById,
  clearBookings,
  // 艺愈模块方法
  saveArtBooking,
  getArtBookings,
  getArtBookingsSync,
  updateArtBooking,
  deleteArtBooking,
  getArtBookingById,
  clearArtBookings,
  // 香愈模块方法
  saveAromaBooking,
  getAromaBookings,
  getAromaBookingsSync,
  updateAromaBooking,
  deleteAromaBooking,
  getAromaBookingById,
  clearAromaBookings,
  // 食愈模块方法
  saveFoodBooking,
  getFoodBookings,
  getFoodBookingsSync,
  updateFoodBooking,
  deleteFoodBooking,
  getFoodBookingById,
  clearFoodBookings
}
