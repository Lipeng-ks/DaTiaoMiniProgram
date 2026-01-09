"use strict";
const common_vendor = require("../common/vendor.js");
const services_storage_service = require("./storage.service.js");
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
const SAMPLE_FESTIVALS = [
  {
    id: "festival-1",
    title: "壮族三月三歌圩节",
    description: "体验壮族传统歌圩文化，欣赏山歌对唱，参与民俗活动",
    date: "2026-04-03",
    time: "09:00",
    location: "南宁市青秀山风景区",
    availableSlots: 50,
    image: "/static/festivals/sanyuesan.jpg"
  },
  {
    id: "festival-2",
    title: "壮锦织造体验工坊",
    description: "学习壮锦织造技艺，亲手制作壮锦作品，感受非遗魅力",
    date: "2026-04-15",
    time: "14:00",
    location: "广西民族博物馆",
    availableSlots: 20,
    image: "/static/festivals/zhuangjin.jpg"
  },
  {
    id: "festival-3",
    title: "铜鼓文化艺术展",
    description: "观赏壮族铜鼓艺术，了解铜鼓历史文化，体验铜鼓演奏",
    date: "2026-05-01",
    time: "10:00",
    location: "广西壮族自治区博物馆",
    availableSlots: 100,
    image: "/static/festivals/tonggu.jpg"
  },
  {
    id: "festival-4",
    title: "壮族服饰文化节",
    description: "欣赏壮族传统服饰展示，体验民族服装试穿，学习服饰文化",
    date: "2026-05-20",
    time: "09:30",
    location: "南宁国际会展中心",
    availableSlots: 80,
    image: "/static/festivals/fuzhi.jpg"
  }
];
async function getFestivals() {
  return SAMPLE_FESTIVALS;
}
async function createArtBooking(festivalId, festival, formData) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const booking = {
      id: generateId(),
      festivalId,
      festivalTitle: festival.title,
      festivalDate: festival.date,
      festivalTime: festival.time,
      festivalLocation: festival.location,
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
    await services_storage_service.StorageService.saveArtBooking(booking);
    return {
      success: true,
      bookingId: booking.id,
      message: "预约成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/art-booking.service.js:109", "Failed to create art booking:", error);
    return {
      success: false,
      message: "预约失败，请重试"
    };
  }
}
async function cancelArtBooking(bookingId) {
  try {
    const booking = await services_storage_service.StorageService.getArtBookingById(bookingId);
    if (!booking) {
      return {
        success: false,
        message: "预约记录不存在"
      };
    }
    if (!canCancelArtBooking(booking)) {
      return {
        success: false,
        message: "距离活动开始不足24小时，无法取消"
      };
    }
    await services_storage_service.StorageService.updateArtBooking(bookingId, {
      status: "cancelled"
    });
    return {
      success: true,
      message: "取消成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/art-booking.service.js:149", "Failed to cancel art booking:", error);
    return {
      success: false,
      message: "取消失败，请重试"
    };
  }
}
function canCancelArtBooking(booking) {
  if (!booking)
    return false;
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return false;
  }
  const festivalDateTime = /* @__PURE__ */ new Date(`${booking.festivalDate}T${booking.festivalTime}`);
  const now = /* @__PURE__ */ new Date();
  const hoursUntilFestival = (festivalDateTime - now) / (1e3 * 60 * 60);
  return hoursUntilFestival >= 24;
}
async function getUserArtBookings() {
  try {
    const bookings = await services_storage_service.StorageService.getArtBookings();
    return bookings.sort((a, b) => {
      const dateA = /* @__PURE__ */ new Date(`${a.festivalDate}T${a.festivalTime}`);
      const dateB = /* @__PURE__ */ new Date(`${b.festivalDate}T${b.festivalTime}`);
      return dateA - dateB;
    });
  } catch (error) {
    common_vendor.index.__f__("error", "at services/art-booking.service.js:193", "Failed to get user art bookings:", error);
    return [];
  }
}
async function getArtBookingDetail(bookingId) {
  return services_storage_service.StorageService.getArtBookingById(bookingId);
}
function validateArtBookingForm(formData) {
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
const ArtBookingService = {
  getFestivals,
  createArtBooking,
  cancelArtBooking,
  canCancelArtBooking,
  getUserArtBookings,
  getArtBookingDetail,
  validateArtBookingForm
};
exports.ArtBookingService = ArtBookingService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/art-booking.service.js.map
