"use strict";
const common_vendor = require("../../common/vendor.js");
const services_booking_service = require("../../services/booking.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      bookings: [],
      loading: true
    };
  },
  onLoad() {
    const info = common_vendor.index.getSystemInfoSync();
    this.navPaddingTop = (info.statusBarHeight || 20) + 75;
  },
  onShow() {
    this.loadBookings();
  },
  methods: {
    async loadBookings() {
      this.loading = true;
      try {
        this.bookings = await services_booking_service.BookingService.getUserBookings();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/sound-healing/booking-records.vue:86", "Failed to load bookings:", error);
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
        url: `/pages/sound-healing/booking-detail?id=${bookingId}`
      });
    },
    goToBooking() {
      common_vendor.index.navigateTo({
        url: "/pages/sound-healing/offline-booking"
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
if (!Array) {
  const _component_custom_nav_bar = common_vendor.resolveComponent("custom-nav-bar");
  _component_custom_nav_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "我的预约",
      gradient: "linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)"
    }),
    b: $data.loading
  }, $data.loading ? {} : $data.bookings.length > 0 ? {
    d: common_vendor.f($data.bookings, (booking, k0, i0) => {
      return {
        a: common_vendor.t(booking.eventTitle),
        b: common_vendor.t($options.getStatusText(booking.status)),
        c: common_vendor.n($options.getStatusClass(booking.status)),
        d: common_vendor.t(booking.eventDate),
        e: common_vendor.t(booking.eventTime),
        f: common_vendor.t(booking.eventLocation),
        g: common_vendor.t(booking.formData.name),
        h: common_vendor.t(booking.formData.participants),
        i: common_vendor.t($options.formatDate(booking.createdAt)),
        j: booking.id,
        k: common_vendor.o(($event) => $options.viewDetail(booking.id), booking.id)
      };
    })
  } : {
    e: common_vendor.o((...args) => $options.goToBooking && $options.goToBooking(...args))
  }, {
    c: $data.bookings.length > 0,
    f: $data.navPaddingTop + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ee48b6ab"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/sound-healing/booking-records.js.map
