"use strict";
const common_vendor = require("../../common/vendor.js");
const services_foodBooking_service = require("../../services/food-booking.service.js");
const _sfc_main = {
  data() {
    return {
      bookingId: "",
      booking: null,
      loading: true,
      canCancelBooking: false
    };
  },
  onLoad(options) {
    this.bookingId = options.id;
    this.loadBookingDetail();
  },
  methods: {
    async loadBookingDetail() {
      this.loading = true;
      try {
        this.booking = await services_foodBooking_service.FoodBookingService.getFoodBookingDetail(this.bookingId);
        this.checkCanCancel();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/food-healing/booking-detail.vue:123", "Failed to load booking detail:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    checkCanCancel() {
      if (!this.booking) {
        this.canCancelBooking = false;
        return;
      }
      this.canCancelBooking = services_foodBooking_service.FoodBookingService.canCancelFoodBooking(this.booking);
    },
    async handleCancel() {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确定要取消此预约吗？",
        success: async (res) => {
          if (res.confirm) {
            await this.cancelBooking();
          }
        }
      });
    },
    async cancelBooking() {
      try {
        const result = await services_foodBooking_service.FoodBookingService.cancelFoodBooking(this.bookingId);
        if (result.success) {
          common_vendor.index.showToast({
            title: "取消成功",
            icon: "success"
          });
          await this.loadBookingDetail();
        } else {
          common_vendor.index.showToast({
            title: result.message,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/food-healing/booking-detail.vue:171", "Failed to cancel booking:", error);
        common_vendor.index.showToast({
          title: "取消失败",
          icon: "none"
        });
      }
    },
    getStatusClass(status) {
      const classMap = {
        pending: "status-pending",
        confirmed: "status-confirmed",
        cancelled: "status-cancelled",
        completed: "status-completed"
      };
      return classMap[status] || "";
    },
    getStatusIcon(status) {
      const iconMap = {
        pending: "⏳",
        confirmed: "✓",
        cancelled: "✕",
        completed: "★"
      };
      return iconMap[status] || "?";
    },
    getStatusText(status) {
      const textMap = {
        pending: "待确认",
        confirmed: "已确认",
        cancelled: "已取消",
        completed: "已完成"
      };
      return textMap[status] || status;
    },
    formatDate(isoString) {
      if (!isoString)
        return "";
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : $data.booking ? common_vendor.e({
    c: common_vendor.t($options.getStatusIcon($data.booking.status)),
    d: common_vendor.t($options.getStatusText($data.booking.status)),
    e: common_vendor.n($options.getStatusClass($data.booking.status)),
    f: common_vendor.t($data.booking.experienceTitle),
    g: common_vendor.t($data.booking.experienceDate),
    h: common_vendor.t($data.booking.experienceTime),
    i: common_vendor.t($data.booking.experienceLocation),
    j: common_vendor.t($data.booking.formData.name),
    k: common_vendor.t($data.booking.formData.phone),
    l: common_vendor.t($data.booking.formData.participants),
    m: $data.booking.formData.remark
  }, $data.booking.formData.remark ? {
    n: common_vendor.t($data.booking.formData.remark)
  } : {}, {
    o: common_vendor.t($options.formatDate($data.booking.createdAt)),
    p: $data.booking.updatedAt !== $data.booking.createdAt
  }, $data.booking.updatedAt !== $data.booking.createdAt ? {
    q: common_vendor.t($options.formatDate($data.booking.updatedAt))
  } : {}, {
    r: $data.canCancelBooking
  }, $data.canCancelBooking ? {
    s: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args))
  } : $data.booking.status === "confirmed" || $data.booking.status === "pending" ? {} : {}, {
    t: $data.booking.status === "confirmed" || $data.booking.status === "pending"
  }) : {}, {
    b: $data.booking
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8d2e17b9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food-healing/booking-detail.js.map
