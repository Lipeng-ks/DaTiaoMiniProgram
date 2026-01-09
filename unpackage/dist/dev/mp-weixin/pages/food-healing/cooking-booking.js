"use strict";
const common_vendor = require("../../common/vendor.js");
const services_foodBooking_service = require("../../services/food-booking.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      experiences: [],
      selectedExperience: null,
      showBookingForm: false,
      showConfirmation: false,
      loading: true,
      confirmationData: {
        experienceTitle: "",
        experienceDate: "",
        experienceTime: "",
        experienceLocation: "",
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
    this.loadExperiences();
  },
  methods: {
    /**
     * 加载美食制作体验活动列表
     */
    async loadExperiences() {
      this.loading = true;
      try {
        this.experiences = await services_foodBooking_service.FoodBookingService.getCookingExperiences();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/food-healing/cooking-booking.vue:211", "Failed to load experiences:", err);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    /**
     * 获取难度等级样式类
     * @param {string} difficulty - 难度等级
     * @returns {string}
     */
    getDifficultyClass(difficulty) {
      const classMap = {
        "简单": "easy",
        "中等": "medium",
        "困难": "hard"
      };
      return classMap[difficulty] || "medium";
    },
    /**
     * 跳转到预约记录页面
     */
    goToRecords() {
      common_vendor.index.navigateTo({
        url: "/pages/food-healing/booking-records"
      });
    },
    /**
     * 打开预约表单弹窗
     * @param {Object} experience - 美食制作体验活动对象
     */
    openBookingForm(experience) {
      this.selectedExperience = experience;
      this.showBookingForm = true;
      this.resetForm();
    },
    /**
     * 关闭预约表单弹窗
     */
    closeBookingForm() {
      this.showBookingForm = false;
      this.selectedExperience = null;
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
      const result = services_foodBooking_service.FoodBookingService.validateFoodBookingForm(this.formData);
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
        experienceTitle: "",
        experienceDate: "",
        experienceTime: "",
        experienceLocation: "",
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
      if (!this.selectedExperience) {
        common_vendor.index.showToast({
          title: "请选择活动",
          icon: "none"
        });
        return;
      }
      const result = await services_foodBooking_service.FoodBookingService.createFoodBooking(
        this.selectedExperience.id,
        this.selectedExperience,
        this.formData
      );
      if (result.success) {
        const expIndex = this.experiences.findIndex((e) => e.id === this.selectedExperience.id);
        if (expIndex !== -1) {
          this.experiences[expIndex].availableSlots -= this.formData.participants || 1;
        }
        this.confirmationData = {
          experienceTitle: this.selectedExperience.title,
          experienceDate: this.selectedExperience.date,
          experienceTime: this.selectedExperience.time,
          experienceLocation: this.selectedExperience.location,
          name: this.formData.name,
          phone: this.formData.phone,
          participants: this.formData.participants || 1
        };
        this.showBookingForm = false;
        this.showConfirmation = true;
        this.selectedExperience = null;
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
      title: "线下美食制作体验预约",
      gradient: "linear-gradient(120deg, #e65100 0%, #ff8f00 45%, #ffb300 100%)"
    }),
    b: $data.loading
  }, $data.loading ? {} : $data.experiences.length > 0 ? {
    d: common_vendor.f($data.experiences, (experience, k0, i0) => {
      return {
        a: experience.image,
        b: common_vendor.t(experience.title),
        c: common_vendor.t(experience.description),
        d: common_vendor.t(experience.dishName),
        e: common_vendor.t(experience.difficulty),
        f: common_vendor.n($options.getDifficultyClass(experience.difficulty)),
        g: common_vendor.t(experience.date),
        h: common_vendor.t(experience.time),
        i: common_vendor.t(experience.location),
        j: common_vendor.t(experience.availableSlots === 0 ? "已满" : `剩余 ${experience.availableSlots} 个名额`),
        k: experience.availableSlots === 0 ? 1 : "",
        l: common_vendor.t(experience.availableSlots === 0 ? "已满" : "立即预约"),
        m: experience.availableSlots === 0 ? 1 : "",
        n: experience.availableSlots === 0,
        o: common_vendor.o(($event) => $options.openBookingForm(experience), experience.id),
        p: experience.id
      };
    })
  } : {}, {
    c: $data.experiences.length > 0,
    e: $data.showBookingForm
  }, $data.showBookingForm ? common_vendor.e({
    f: common_vendor.o((...args) => $options.closeBookingForm && $options.closeBookingForm(...args)),
    g: $data.selectedExperience
  }, $data.selectedExperience ? {
    h: common_vendor.t($data.selectedExperience.title),
    i: common_vendor.t($data.selectedExperience.date),
    j: common_vendor.t($data.selectedExperience.time),
    k: common_vendor.t($data.selectedExperience.location)
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
    D: common_vendor.t($data.confirmationData.experienceTitle),
    E: common_vendor.t($data.confirmationData.experienceDate),
    F: common_vendor.t($data.confirmationData.experienceTime),
    G: common_vendor.t($data.confirmationData.experienceLocation),
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-255586a1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food-healing/cooking-booking.js.map
