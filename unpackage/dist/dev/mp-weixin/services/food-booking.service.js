"use strict";
const common_vendor = require("../common/vendor.js");
const services_storage_service = require("./storage.service.js");
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
const SAMPLE_COOKING_EXPERIENCES = [
  {
    id: "exp-1",
    title: "五色糯米饭制作体验",
    description: "学习壮族传统五色糯米饭的制作工艺，了解天然植物染色技艺",
    dishName: "五色糯米饭",
    difficulty: "中等",
    date: "2026-02-15",
    time: "09:00",
    location: "南宁市青秀区民族大道88号壮乡美食馆",
    availableSlots: 20,
    image: "/static/food/wuse-nuomifan.jpg"
  },
  {
    id: "exp-2",
    title: "壮族粽子包制体验",
    description: "亲手包制壮族特色粽子，体验传统节日美食文化",
    dishName: "壮族粽子",
    difficulty: "简单",
    date: "2026-02-22",
    time: "14:00",
    location: "南宁市西乡塘区大学路100号美食体验中心",
    availableSlots: 25,
    image: "/static/food/zongzi.jpg"
  },
  {
    id: "exp-3",
    title: "酸嘢腌制工坊",
    description: "学习壮族传统酸嘢腌制方法，制作属于自己的酸嘢",
    dishName: "酸嘢",
    difficulty: "简单",
    date: "2026-03-01",
    time: "10:00",
    location: "南宁市江南区星光大道66号传统工坊",
    availableSlots: 15,
    image: "/static/food/suanye.jpg"
  },
  {
    id: "exp-4",
    title: "糍粑制作体验",
    description: "体验传统糍粑制作过程，感受壮族美食文化魅力",
    dishName: "糍粑",
    difficulty: "中等",
    date: "2026-03-15",
    time: "15:00",
    location: "广西民族博物馆美食体验区",
    availableSlots: 18,
    image: "/static/food/ciba.jpg"
  }
];
async function getCookingExperiences() {
  return SAMPLE_COOKING_EXPERIENCES;
}
async function createFoodBooking(experienceId, experience, formData) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const booking = {
      id: generateId(),
      experienceId,
      experienceTitle: experience.title,
      experienceDate: experience.date,
      experienceTime: experience.time,
      experienceLocation: experience.location,
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
    await services_storage_service.StorageService.saveFoodBooking(booking);
    return {
      success: true,
      bookingId: booking.id,
      message: "预约成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/food-booking.service.js:117", "Failed to create food booking:", error);
    return {
      success: false,
      message: "预约失败，请重试"
    };
  }
}
async function cancelFoodBooking(bookingId) {
  try {
    const booking = await services_storage_service.StorageService.getFoodBookingById(bookingId);
    if (!booking) {
      return {
        success: false,
        message: "预约记录不存在"
      };
    }
    if (!canCancelFoodBooking(booking)) {
      return {
        success: false,
        message: "距离活动开始不足24小时，无法取消"
      };
    }
    await services_storage_service.StorageService.updateFoodBooking(bookingId, {
      status: "cancelled"
    });
    return {
      success: true,
      message: "取消成功"
    };
  } catch (error) {
    common_vendor.index.__f__("error", "at services/food-booking.service.js:158", "Failed to cancel food booking:", error);
    return {
      success: false,
      message: "取消失败，请重试"
    };
  }
}
function canCancelFoodBooking(booking) {
  if (!booking)
    return false;
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return false;
  }
  const experienceDateTime = /* @__PURE__ */ new Date(`${booking.experienceDate}T${booking.experienceTime}`);
  const now = /* @__PURE__ */ new Date();
  const hoursUntilExperience = (experienceDateTime - now) / (1e3 * 60 * 60);
  return hoursUntilExperience >= 24;
}
async function getUserFoodBookings() {
  try {
    const bookings = await services_storage_service.StorageService.getFoodBookings();
    return bookings.sort((a, b) => {
      const dateA = /* @__PURE__ */ new Date(`${a.experienceDate}T${a.experienceTime}`);
      const dateB = /* @__PURE__ */ new Date(`${b.experienceDate}T${b.experienceTime}`);
      return dateA - dateB;
    });
  } catch (error) {
    common_vendor.index.__f__("error", "at services/food-booking.service.js:202", "Failed to get user food bookings:", error);
    return [];
  }
}
async function getFoodBookingDetail(bookingId) {
  return services_storage_service.StorageService.getFoodBookingById(bookingId);
}
function validateFoodBookingForm(formData) {
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
const FoodBookingService = {
  getCookingExperiences,
  createFoodBooking,
  cancelFoodBooking,
  canCancelFoodBooking,
  getUserFoodBookings,
  getFoodBookingDetail,
  validateFoodBookingForm
};
exports.FoodBookingService = FoodBookingService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/food-booking.service.js.map
