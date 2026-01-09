"use strict";
const common_vendor = require("../common/vendor.js");
const services_storage_service = require("./storage.service.js");
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
const SAMPLE_SALONS = [
  {
    id: "salon-1",
    title: "壮乡草本香氛调配体验",
    description: "学习壮族传统草本香氛调配技艺，亲手制作专属香氛产品",
    theme: "草本调香",
    date: "2026-02-15",
    time: "14:00",
    location: "南宁市青秀区民族大道88号香愈馆",
    availableSlots: 15,
    image: "/static/salons/herbal.jpg"
  },
  {
    id: "salon-2",
    title: "精油芳疗放松沙龙",
    description: "体验壮族特色精油芳疗，学习精油使用方法与功效",
    theme: "精油芳疗",
    date: "2026-02-22",
    time: "10:00",
    location: "南宁市西乡塘区大学路100号疗愈中心",
    availableSlots: 20,
    image: "/static/salons/essential-oil.jpg"
  },
  {
    id: "salon-3",
    title: "香薰蜡烛DIY工坊",
    description: "亲手制作壮族特色香薰蜡烛，感受香氛疗愈的魅力",
    theme: "蜡烛制作",
    date: "2026-03-01",
    time: "15:00",
    location: "南宁市江南区星光大道66号创意工坊",
    availableSlots: 12,
    image: "/static/salons/candle.jpg"
  },
  {
    id: "salon-4",
    title: "壮乡香包香囊制作",
    description: "学习传统香包香囊制作工艺，了解壮族香文化历史",
    theme: "香包制作",
    date: "2026-03-15",
    time: "09:30",
    location: "广西民族博物馆手工体验区",
    availableSlots: 25,
    image: "/static/salons/sachet.jpg"
  }
];
async function getSalons() {
  return SAMPLE_SALONS;
}
async function createAromaBooking(salonId, salon, formData) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const booking = {
      id: generateId(),
      salonId,
      salonTitle: salon.title,
      salonDate: salon.date,
      salonTime: salon.time,
      salonLocation: salon.location,
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
    await services_storage_service.StorageService.saveAromaBooking(booking);
    return {
      success: true,
      bookingId: booking.id,
      message: "预约成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/aroma-booking.service.js:113", "Failed to create aroma booking:", error);
    return {
      success: false,
      message: "预约失败，请重试"
    };
  }
}
async function cancelAromaBooking(bookingId) {
  try {
    const booking = await services_storage_service.StorageService.getAromaBookingById(bookingId);
    if (!booking) {
      return {
        success: false,
        message: "预约记录不存在"
      };
    }
    if (!canCancelAromaBooking(booking)) {
      return {
        success: false,
        message: "距离活动开始不足24小时，无法取消"
      };
    }
    await services_storage_service.StorageService.updateAromaBooking(bookingId, {
      status: "cancelled"
    });
    return {
      success: true,
      message: "取消成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/aroma-booking.service.js:153", "Failed to cancel aroma booking:", error);
    return {
      success: false,
      message: "取消失败，请重试"
    };
  }
}
function canCancelAromaBooking(booking) {
  if (!booking)
    return false;
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return false;
  }
  const salonDateTime = /* @__PURE__ */ new Date(`${booking.salonDate}T${booking.salonTime}`);
  const now = /* @__PURE__ */ new Date();
  const hoursUntilSalon = (salonDateTime - now) / (1e3 * 60 * 60);
  return hoursUntilSalon >= 24;
}
async function getUserAromaBookings() {
  try {
    const bookings = await services_storage_service.StorageService.getAromaBookings();
    return bookings.sort((a, b) => {
      const dateA = /* @__PURE__ */ new Date(`${a.salonDate}T${a.salonTime}`);
      const dateB = /* @__PURE__ */ new Date(`${b.salonDate}T${b.salonTime}`);
      return dateA - dateB;
    });
  } catch (error) {
    common_vendor.index.__f__("error", "at services/aroma-booking.service.js:197", "Failed to get user aroma bookings:", error);
    return [];
  }
}
async function getAromaBookingDetail(bookingId) {
  return services_storage_service.StorageService.getAromaBookingById(bookingId);
}
function validateAromaBookingForm(formData) {
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
const AromaBookingService = {
  getSalons,
  createAromaBooking,
  cancelAromaBooking,
  canCancelAromaBooking,
  getUserAromaBookings,
  getAromaBookingDetail,
  validateAromaBookingForm
};
exports.AromaBookingService = AromaBookingService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/aroma-booking.service.js.map
