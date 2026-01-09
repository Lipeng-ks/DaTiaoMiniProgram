"use strict";
const common_vendor = require("../common/vendor.js");
const services_storage_service = require("./storage.service.js");
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
async function createBooking(eventId, event, formData) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const booking = {
      id: generateId(),
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      formData: {
        name: formData.name,
        phone: formData.phone,
        participants: formData.participants || 1,
        remark: formData.remark || ""
      },
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    await services_storage_service.StorageService.saveBooking(booking);
    return {
      success: true,
      bookingId: booking.id,
      message: "预约成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/booking.service.js:53", "Failed to create booking:", error);
    return {
      success: false,
      message: "预约失败，请重试"
    };
  }
}
async function cancelBooking(bookingId) {
  try {
    const booking = await services_storage_service.StorageService.getBookingById(bookingId);
    if (!booking) {
      return {
        success: false,
        message: "预约记录不存在"
      };
    }
    if (!canCancel(booking)) {
      return {
        success: false,
        message: "距离活动开始不足24小时，无法取消"
      };
    }
    await services_storage_service.StorageService.updateBooking(bookingId, {
      status: "cancelled"
    });
    return {
      success: true,
      message: "取消成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/booking.service.js:93", "Failed to cancel booking:", error);
    return {
      success: false,
      message: "取消失败，请重试"
    };
  }
}
function canCancel(booking) {
  if (!booking)
    return false;
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return false;
  }
  const eventDateTime = /* @__PURE__ */ new Date(`${booking.eventDate}T${booking.eventTime}`);
  const now = /* @__PURE__ */ new Date();
  const hoursUntilEvent = (eventDateTime - now) / (1e3 * 60 * 60);
  return hoursUntilEvent >= 24;
}
async function getUserBookings() {
  try {
    const bookings = await services_storage_service.StorageService.getBookings();
    return bookings.sort((a, b) => {
      const dateA = /* @__PURE__ */ new Date(`${a.eventDate}T${a.eventTime}`);
      const dateB = /* @__PURE__ */ new Date(`${b.eventDate}T${b.eventTime}`);
      return dateA - dateB;
    });
  } catch (error) {
    common_vendor.index.__f__("error", "at services/booking.service.js:137", "Failed to get user bookings:", error);
    return [];
  }
}
async function getBookingDetail(bookingId) {
  return services_storage_service.StorageService.getBookingById(bookingId);
}
function validateForm(formData) {
  const errors = [];
  if (!formData.name || !formData.name.trim()) {
    errors.push({ field: "name", message: "请输入姓名" });
  }
  if (!formData.phone || !formData.phone.trim()) {
    errors.push({ field: "phone", message: "请输入手机号" });
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.push({ field: "phone", message: "请输入正确的手机号码" });
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
const BookingService = {
  createBooking,
  cancelBooking,
  canCancel,
  getUserBookings,
  getBookingDetail,
  validateForm
};
exports.BookingService = BookingService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/booking.service.js.map
