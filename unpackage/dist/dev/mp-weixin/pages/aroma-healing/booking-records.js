"use strict";
const common_vendor = require("../../common/vendor.js");
const services_aromaBooking_service = require("../../services/aroma-booking.service.js");
const _sfc_main = {
  data() {
    return {
      bookings: [],
      loading: true
    };
  },
  onShow() {
    this.loadBookings();
  },
  methods: {
    async loadBookings() {
      this.loading = true;
      try {
        this.bookings = await services_aromaBooking_service.AromaBookingService.getUserAromaBookings();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/aroma-healing/booking-records.vue:78", "Failed to load bookings:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    viewDetail(bookingId) {
      common_vendor.index.navigateTo({
        url: `/pages/aroma-healing/booking-detail?id=${bookingId}`
      });
    },
    goToBooking() {
      common_vendor.index.navigateTo({
        url: "/pages/aroma-healing/salon-booking"
      });
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
  }, $data.loading ? {} : $data.bookings.length > 0 ? {
    c: common_vendor.f($data.bookings, (booking, k0, i0) => {
      return {
        a: common_vendor.t(booking.salonTitle),
        b: common_vendor.t($options.getStatusText(booking.status)),
        c: common_vendor.n($options.getStatusClass(booking.status)),
        d: common_vendor.t(booking.salonDate),
        e: common_vendor.t(booking.salonTime),
        f: common_vendor.t(booking.salonLocation),
        g: common_vendor.t(booking.formData.name),
        h: common_vendor.t(booking.formData.participants),
        i: common_vendor.t($options.formatDate(booking.createdAt)),
        j: booking.id,
        k: common_vendor.o(($event) => $options.viewDetail(booking.id), booking.id)
      };
    })
  } : {
    d: common_vendor.o((...args) => $options.goToBooking && $options.goToBooking(...args))
  }, {
    b: $data.bookings.length > 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-898d026e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/aroma-healing/booking-records.js.map
