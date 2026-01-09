"use strict";
const common_vendor = require("../common/vendor.js");
const BOOKINGS_KEY = "sound_healing_bookings";
const ART_BOOKINGS_KEY = "art_healing_bookings";
const AROMA_BOOKINGS_KEY = "aroma_healing_bookings";
const FOOD_BOOKINGS_KEY = "food_healing_bookings";
function saveBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync();
      bookings.push(booking);
      common_vendor.index.setStorageSync(BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync();
      resolve(bookings);
    } catch (error) {
      reject(error);
    }
  });
}
function getBookingsSync() {
  try {
    const data = common_vendor.index.getStorageSync(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    common_vendor.index.__f__("error", "at services/storage.service.js:53", "Failed to get bookings from storage:", error);
    return [];
  }
}
function updateBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync();
      const index = bookings.findIndex((b) => b.id === bookingId);
      if (index === -1) {
        reject(new Error("Booking not found"));
        return;
      }
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      common_vendor.index.setStorageSync(BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function deleteBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync();
      const filteredBookings = bookings.filter((b) => b.id !== bookingId);
      common_vendor.index.setStorageSync(BOOKINGS_KEY, JSON.stringify(filteredBookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getBookingsSync();
      const booking = bookings.find((b) => b.id === bookingId);
      resolve(booking || null);
    } catch (error) {
      reject(error);
    }
  });
}
function clearBookings() {
  return new Promise((resolve, reject) => {
    try {
      common_vendor.index.removeStorageSync(BOOKINGS_KEY);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function saveArtBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync();
      bookings.push(booking);
      common_vendor.index.setStorageSync(ART_BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getArtBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync();
      resolve(bookings);
    } catch (error) {
      reject(error);
    }
  });
}
function getArtBookingsSync() {
  try {
    const data = common_vendor.index.getStorageSync(ART_BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    common_vendor.index.__f__("error", "at services/storage.service.js:184", "Failed to get art bookings from storage:", error);
    return [];
  }
}
function updateArtBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync();
      const index = bookings.findIndex((b) => b.id === bookingId);
      if (index === -1) {
        reject(new Error("Art booking not found"));
        return;
      }
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      common_vendor.index.setStorageSync(ART_BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function deleteArtBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync();
      const filteredBookings = bookings.filter((b) => b.id !== bookingId);
      common_vendor.index.setStorageSync(ART_BOOKINGS_KEY, JSON.stringify(filteredBookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getArtBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getArtBookingsSync();
      const booking = bookings.find((b) => b.id === bookingId);
      resolve(booking || null);
    } catch (error) {
      reject(error);
    }
  });
}
function clearArtBookings() {
  return new Promise((resolve, reject) => {
    try {
      common_vendor.index.removeStorageSync(ART_BOOKINGS_KEY);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function saveAromaBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync();
      bookings.push(booking);
      common_vendor.index.setStorageSync(AROMA_BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getAromaBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync();
      resolve(bookings);
    } catch (error) {
      reject(error);
    }
  });
}
function getAromaBookingsSync() {
  try {
    const data = common_vendor.index.getStorageSync(AROMA_BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    common_vendor.index.__f__("error", "at services/storage.service.js:315", "Failed to get aroma bookings from storage:", error);
    return [];
  }
}
function updateAromaBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync();
      const index = bookings.findIndex((b) => b.id === bookingId);
      if (index === -1) {
        reject(new Error("Aroma booking not found"));
        return;
      }
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      common_vendor.index.setStorageSync(AROMA_BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function deleteAromaBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync();
      const filteredBookings = bookings.filter((b) => b.id !== bookingId);
      common_vendor.index.setStorageSync(AROMA_BOOKINGS_KEY, JSON.stringify(filteredBookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getAromaBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getAromaBookingsSync();
      const booking = bookings.find((b) => b.id === bookingId);
      resolve(booking || null);
    } catch (error) {
      reject(error);
    }
  });
}
function clearAromaBookings() {
  return new Promise((resolve, reject) => {
    try {
      common_vendor.index.removeStorageSync(AROMA_BOOKINGS_KEY);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function saveFoodBooking(booking) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync();
      bookings.push(booking);
      common_vendor.index.setStorageSync(FOOD_BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getFoodBookings() {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync();
      resolve(bookings);
    } catch (error) {
      reject(error);
    }
  });
}
function getFoodBookingsSync() {
  try {
    const data = common_vendor.index.getStorageSync(FOOD_BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    common_vendor.index.__f__("error", "at services/storage.service.js:446", "Failed to get food bookings from storage:", error);
    return [];
  }
}
function updateFoodBooking(bookingId, data) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync();
      const index = bookings.findIndex((b) => b.id === bookingId);
      if (index === -1) {
        reject(new Error("Food booking not found"));
        return;
      }
      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      common_vendor.index.setStorageSync(FOOD_BOOKINGS_KEY, JSON.stringify(bookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function deleteFoodBooking(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync();
      const filteredBookings = bookings.filter((b) => b.id !== bookingId);
      common_vendor.index.setStorageSync(FOOD_BOOKINGS_KEY, JSON.stringify(filteredBookings));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
function getFoodBookingById(bookingId) {
  return new Promise((resolve, reject) => {
    try {
      const bookings = getFoodBookingsSync();
      const booking = bookings.find((b) => b.id === bookingId);
      resolve(booking || null);
    } catch (error) {
      reject(error);
    }
  });
}
function clearFoodBookings() {
  return new Promise((resolve, reject) => {
    try {
      common_vendor.index.removeStorageSync(FOOD_BOOKINGS_KEY);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
const StorageService = {
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
};
exports.StorageService = StorageService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/storage.service.js.map
