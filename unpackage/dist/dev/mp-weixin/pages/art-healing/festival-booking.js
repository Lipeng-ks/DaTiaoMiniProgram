"use strict";
const common_vendor = require("../../common/vendor.js");
const services_artBooking_service = require("../../services/art-booking.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      festivals: [],
      selectedFestival: null,
      showBookingForm: false,
      showConfirmation: false,
      loading: true,
      confirmationData: {
        festivalTitle: "",
        festivalDate: "",
        festivalTime: "",
        festivalLocation: "",
        name: "",
        phone: "",
        participants: 1
      },
      formData: {
        name: "",
        phone: "",
        participants: 1,
        remark: ""
      },
      formErrors: {}
    };
  },
  onLoad() {
    const info = common_vendor.index.getSystemInfoSync();
    this.navPaddingTop = (info.statusBarHeight || 20) + 75;
    this.loadFestivals();
  },
  methods: {
    /**
     * 加载艺术节活动列表
     */
    async loadFestivals() {
      this.loading = true;
      try {
        this.festivals = await services_artBooking_service.ArtBookingService.getFestivals();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/art-healing/festival-booking.vue:205", "Failed to load festivals:", err);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    /**
     * 跳转到预约记录页面
     */
    goToRecords() {
      common_vendor.index.navigateTo({
        url: "/pages/art-healing/booking-records"
      });
    },
    /**
     * 打开预约表单弹窗
     * @param {Object} festival - 艺术节活动对象
     */
    openBookingForm(festival) {
      this.selectedFestival = festival;
      this.showBookingForm = true;
      this.resetForm();
    },
    /**
     * 关闭预约表单弹窗
     */
    closeBookingForm() {
      this.showBookingForm = false;
      this.selectedFestival = null;
      this.resetForm();
    },
    /**
     * 重置表单数据
     */
    resetForm() {
      this.formData = {
        name: "",
        phone: "",
        participants: 1,
        remark: ""
      };
      this.formErrors = {};
    },
    /**
     * 验证表单数据
     * @returns {boolean}
     */
    validateForm() {
      const result = services_artBooking_service.ArtBookingService.validateArtBookingForm(this.formData);
      const errors = {};
      if (!result.valid) {
        result.errors.forEach((err) => {
          errors[err.field] = err.message;
        });
      }
      this.formErrors = errors;
      return result.valid;
    },
    /**
     * 关闭确认弹窗
     */
    closeConfirmation() {
      this.showConfirmation = false;
      this.confirmationData = {
        festivalTitle: "",
        festivalDate: "",
        festivalTime: "",
        festivalLocation: "",
        name: "",
        phone: "",
        participants: 1
      };
    },
    /**
     * 从确认弹窗跳转到预约记录
     */
    goToRecordsFromConfirm() {
      this.closeConfirmation();
      this.goToRecords();
    },
    /**
     * 提交预约
     */
    async submitBooking() {
      if (!this.validateForm()) {
        return;
      }
      if (!this.selectedFestival) {
        common_vendor.index.showToast({
          title: "请选择活动",
          icon: "none"
        });
        return;
      }
      const result = await services_artBooking_service.ArtBookingService.createArtBooking(
        this.selectedFestival.id,
        this.selectedFestival,
        this.formData
      );
      if (result.success) {
        const festivalIndex = this.festivals.findIndex((f) => f.id === this.selectedFestival.id);
        if (festivalIndex !== -1) {
          this.festivals[festivalIndex].availableSlots -= this.formData.participants || 1;
        }
        this.confirmationData = {
          festivalTitle: this.selectedFestival.title,
          festivalDate: this.selectedFestival.date,
          festivalTime: this.selectedFestival.time,
          festivalLocation: this.selectedFestival.location,
          name: this.formData.name,
          phone: this.formData.phone,
          participants: this.formData.participants || 1
        };
        this.showBookingForm = false;
        this.showConfirmation = true;
        this.selectedFestival = null;
        this.resetForm();
      } else {
        common_vendor.index.showToast({
          title: result.message || "预约失败，请重试",
          icon: "none"
        });
      }
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
      title: "线下壮乡艺术节预约",
      gradient: "linear-gradient(120deg, #e65100 0%, #ff9800 45%, #ffb74d 100%)"
    }),
    b: $data.loading
  }, $data.loading ? {} : $data.festivals.length > 0 ? {
    d: common_vendor.f($data.festivals, (festival, k0, i0) => {
      return {
        a: festival.image,
        b: common_vendor.t(festival.title),
        c: common_vendor.t(festival.description),
        d: common_vendor.t(festival.date),
        e: common_vendor.t(festival.time),
        f: common_vendor.t(festival.location),
        g: common_vendor.t(festival.availableSlots === 0 ? "已满" : `剩余 ${festival.availableSlots} 个名额`),
        h: festival.availableSlots === 0 ? 1 : "",
        i: common_vendor.t(festival.availableSlots === 0 ? "已满" : "立即预约"),
        j: festival.availableSlots === 0 ? 1 : "",
        k: festival.availableSlots === 0,
        l: common_vendor.o(($event) => $options.openBookingForm(festival), festival.id),
        m: festival.id
      };
    })
  } : {}, {
    c: $data.festivals.length > 0,
    e: $data.showBookingForm
  }, $data.showBookingForm ? common_vendor.e({
    f: common_vendor.o((...args) => $options.closeBookingForm && $options.closeBookingForm(...args)),
    g: $data.selectedFestival
  }, $data.selectedFestival ? {
    h: common_vendor.t($data.selectedFestival.title),
    i: common_vendor.t($data.selectedFestival.date),
    j: common_vendor.t($data.selectedFestival.time),
    k: common_vendor.t($data.selectedFestival.location)
  } : {}, {
    l: $data.formErrors.name ? 1 : "",
    m: $data.formData.name,
    n: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    o: $data.formErrors.name
  }, $data.formErrors.name ? {
    p: common_vendor.t($data.formErrors.name)
  } : {}, {
    q: $data.formErrors.phone ? 1 : "",
    r: $data.formData.phone,
    s: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    t: $data.formErrors.phone
  }, $data.formErrors.phone ? {
    v: common_vendor.t($data.formErrors.phone)
  } : {}, {
    w: $data.formData.participants,
    x: common_vendor.o(($event) => $data.formData.participants = $event.detail.value),
    y: $data.formData.remark,
    z: common_vendor.o(($event) => $data.formData.remark = $event.detail.value),
    A: common_vendor.o((...args) => $options.submitBooking && $options.submitBooking(...args)),
    B: common_vendor.o((...args) => $options.closeBookingForm && $options.closeBookingForm(...args))
  }) : {}, {
    C: $data.showConfirmation
  }, $data.showConfirmation ? {
    D: common_vendor.t($data.confirmationData.festivalTitle),
    E: common_vendor.t($data.confirmationData.festivalDate),
    F: common_vendor.t($data.confirmationData.festivalTime),
    G: common_vendor.t($data.confirmationData.festivalLocation),
    H: common_vendor.t($data.confirmationData.name),
    I: common_vendor.t($data.confirmationData.phone),
    J: common_vendor.t($data.confirmationData.participants),
    K: common_vendor.o((...args) => $options.goToRecordsFromConfirm && $options.goToRecordsFromConfirm(...args)),
    L: common_vendor.o((...args) => $options.closeConfirmation && $options.closeConfirmation(...args)),
    M: common_vendor.o((...args) => $options.closeConfirmation && $options.closeConfirmation(...args))
  } : {}, {
    N: $data.navPaddingTop + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7746ea19"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/art-healing/festival-booking.js.map
