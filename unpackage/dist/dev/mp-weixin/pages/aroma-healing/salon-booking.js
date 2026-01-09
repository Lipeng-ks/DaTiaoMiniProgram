"use strict";
const common_vendor = require("../../common/vendor.js");
const services_aromaBooking_service = require("../../services/aroma-booking.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      salons: [],
      selectedSalon: null,
      showBookingForm: false,
      showConfirmation: false,
      loading: true,
      confirmationData: {
        salonTitle: "",
        salonDate: "",
        salonTime: "",
        salonLocation: "",
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
    this.loadSalons();
  },
  methods: {
    /**
     * 加载香氛沙龙活动列表
     */
    async loadSalons() {
      this.loading = true;
      try {
        this.salons = await services_aromaBooking_service.AromaBookingService.getSalons();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/aroma-healing/salon-booking.vue:208", "Failed to load salons:", err);
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
        url: "/pages/aroma-healing/booking-records"
      });
    },
    /**
     * 打开预约表单弹窗
     * @param {Object} salon - 香氛沙龙活动对象
     */
    openBookingForm(salon) {
      this.selectedSalon = salon;
      this.showBookingForm = true;
      this.resetForm();
    },
    /**
     * 关闭预约表单弹窗
     */
    closeBookingForm() {
      this.showBookingForm = false;
      this.selectedSalon = null;
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
      const result = services_aromaBooking_service.AromaBookingService.validateAromaBookingForm(this.formData);
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
        salonTitle: "",
        salonDate: "",
        salonTime: "",
        salonLocation: "",
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
      if (!this.selectedSalon) {
        common_vendor.index.showToast({
          title: "请选择活动",
          icon: "none"
        });
        return;
      }
      const result = await services_aromaBooking_service.AromaBookingService.createAromaBooking(
        this.selectedSalon.id,
        this.selectedSalon,
        this.formData
      );
      if (result.success) {
        const salonIndex = this.salons.findIndex((s) => s.id === this.selectedSalon.id);
        if (salonIndex !== -1) {
          this.salons[salonIndex].availableSlots -= this.formData.participants || 1;
        }
        this.confirmationData = {
          salonTitle: this.selectedSalon.title,
          salonDate: this.selectedSalon.date,
          salonTime: this.selectedSalon.time,
          salonLocation: this.selectedSalon.location,
          name: this.formData.name,
          phone: this.formData.phone,
          participants: this.formData.participants || 1
        };
        this.showBookingForm = false;
        this.showConfirmation = true;
        this.selectedSalon = null;
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
      title: "线下香氛沙龙预约",
      gradient: "linear-gradient(120deg, #880e4f 0%, #c2185b 45%, #e91e63 100%)"
    }),
    b: $data.loading
  }, $data.loading ? {} : $data.salons.length > 0 ? {
    d: common_vendor.f($data.salons, (salon, k0, i0) => {
      return {
        a: salon.image,
        b: common_vendor.t(salon.title),
        c: common_vendor.t(salon.description),
        d: common_vendor.t(salon.theme),
        e: common_vendor.t(salon.date),
        f: common_vendor.t(salon.time),
        g: common_vendor.t(salon.location),
        h: common_vendor.t(salon.availableSlots === 0 ? "已满" : `剩余 ${salon.availableSlots} 个名额`),
        i: salon.availableSlots === 0 ? 1 : "",
        j: common_vendor.t(salon.availableSlots === 0 ? "已满" : "立即预约"),
        k: salon.availableSlots === 0 ? 1 : "",
        l: salon.availableSlots === 0,
        m: common_vendor.o(($event) => $options.openBookingForm(salon), salon.id),
        n: salon.id
      };
    })
  } : {}, {
    c: $data.salons.length > 0,
    e: $data.showBookingForm
  }, $data.showBookingForm ? common_vendor.e({
    f: common_vendor.o((...args) => $options.closeBookingForm && $options.closeBookingForm(...args)),
    g: $data.selectedSalon
  }, $data.selectedSalon ? {
    h: common_vendor.t($data.selectedSalon.title),
    i: common_vendor.t($data.selectedSalon.date),
    j: common_vendor.t($data.selectedSalon.time),
    k: common_vendor.t($data.selectedSalon.location)
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
    D: common_vendor.t($data.confirmationData.salonTitle),
    E: common_vendor.t($data.confirmationData.salonDate),
    F: common_vendor.t($data.confirmationData.salonTime),
    G: common_vendor.t($data.confirmationData.salonLocation),
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e54a326a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/aroma-healing/salon-booking.js.map
