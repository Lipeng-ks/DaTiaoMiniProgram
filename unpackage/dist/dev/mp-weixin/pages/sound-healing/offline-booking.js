"use strict";
const common_vendor = require("../../common/vendor.js");
const services_booking_service = require("../../services/booking.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
      events: [
        {
          id: "event-001",
          title: "壮乡山歌挑战赛·春季篇",
          description: "体验壮族传统山歌文化，与歌王歌后同台竞技",
          date: "2026-02-15",
          time: "14:00",
          location: "南宁市民族文化中心",
          address: "南宁市青秀区民族大道123号",
          totalSlots: 50,
          availableSlots: 12,
          requirements: "热爱山歌文化，年满18周岁",
          coverImage: "/static/pexels-pripicart-620337.jpg"
        },
        {
          id: "event-002",
          title: "山歌传承工作坊",
          description: "跟随非遗传承人学习正宗壮族山歌",
          date: "2026-02-20",
          time: "09:30",
          location: "武鸣区文化馆",
          address: "南宁市武鸣区城厢镇文化路88号",
          totalSlots: 30,
          availableSlots: 0,
          requirements: "对山歌有浓厚兴趣",
          coverImage: "/static/logo.png"
        },
        {
          id: "event-003",
          title: "三月三山歌节预热活动",
          description: "提前感受三月三山歌节的热烈氛围",
          date: "2026-03-01",
          time: "10:00",
          location: "青秀山风景区",
          address: "南宁市青秀区青山路19号",
          totalSlots: 100,
          availableSlots: 45,
          requirements: "无特殊要求",
          coverImage: "/static/logo.png"
        },
        {
          id: "event-004",
          title: "亲子山歌体验营",
          description: "带孩子一起感受壮乡山歌魅力",
          date: "2026-03-08",
          time: "15:00",
          location: "广西民族博物馆",
          address: "南宁市青秀区青环路11号",
          totalSlots: 40,
          availableSlots: 8,
          requirements: "需家长陪同，儿童年龄6-14岁",
          coverImage: "/static/logo.png"
        }
      ],
      selectedEvent: null,
      showBookingForm: false,
      showConfirmation: false,
      confirmationData: {
        eventTitle: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
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
  },
  methods: {
    goToRecords() {
      common_vendor.index.navigateTo({
        url: "/pages/sound-healing/booking-records"
      });
    },
    openBookingForm(event) {
      this.selectedEvent = event;
      this.showBookingForm = true;
      this.resetForm();
    },
    closeBookingForm() {
      this.showBookingForm = false;
      this.selectedEvent = null;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        name: "",
        phone: "",
        participants: 1,
        remark: ""
      };
      this.formErrors = {};
    },
    validateForm() {
      const errors = {};
      if (!this.formData.name || !this.formData.name.trim()) {
        errors.name = "请输入姓名";
      }
      if (!this.formData.phone || !this.formData.phone.trim()) {
        errors.phone = "请输入手机号";
      } else if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        errors.phone = "请输入正确的手机号码";
      }
      this.formErrors = errors;
      return Object.keys(errors).length === 0;
    },
    closeConfirmation() {
      this.showConfirmation = false;
      this.confirmationData = {
        eventTitle: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
        name: "",
        phone: "",
        participants: 1
      };
    },
    goToRecordsFromConfirm() {
      this.closeConfirmation();
      this.goToRecords();
    },
    async submitBooking() {
      if (!this.validateForm()) {
        return;
      }
      if (!this.selectedEvent) {
        common_vendor.index.showToast({
          title: "请选择活动",
          icon: "none"
        });
        return;
      }
      const result = await services_booking_service.BookingService.createBooking(
        this.selectedEvent.id,
        this.selectedEvent,
        this.formData
      );
      if (result.success) {
        const eventIndex = this.events.findIndex((e) => e.id === this.selectedEvent.id);
        if (eventIndex !== -1) {
          this.events[eventIndex].availableSlots -= this.formData.participants || 1;
        }
        this.confirmationData = {
          eventTitle: this.selectedEvent.title,
          eventDate: this.selectedEvent.date,
          eventTime: this.selectedEvent.time,
          eventLocation: this.selectedEvent.location,
          name: this.formData.name,
          phone: this.formData.phone,
          participants: this.formData.participants || 1
        };
        this.showBookingForm = false;
        this.showConfirmation = true;
        this.selectedEvent = null;
        this.resetForm();
      } else {
        common_vendor.index.showToast({
          title: result.message || "预约失败",
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
      title: "线下山歌挑战预约",
      gradient: "linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)"
    }),
    b: common_vendor.f($data.events, (event, k0, i0) => {
      return {
        a: event.coverImage,
        b: common_vendor.t(event.title),
        c: common_vendor.t(event.date),
        d: common_vendor.t(event.time),
        e: common_vendor.t(event.location),
        f: common_vendor.t(event.availableSlots === 0 ? "已满" : `剩余 ${event.availableSlots} 个名额`),
        g: event.availableSlots === 0 ? 1 : "",
        h: common_vendor.t(event.availableSlots === 0 ? "已满" : "立即预约"),
        i: event.availableSlots === 0 ? 1 : "",
        j: event.availableSlots === 0,
        k: common_vendor.o(($event) => $options.openBookingForm(event), event.id),
        l: event.id
      };
    }),
    c: $data.showBookingForm
  }, $data.showBookingForm ? common_vendor.e({
    d: common_vendor.o((...args) => $options.closeBookingForm && $options.closeBookingForm(...args)),
    e: $data.selectedEvent
  }, $data.selectedEvent ? {
    f: common_vendor.t($data.selectedEvent.title),
    g: common_vendor.t($data.selectedEvent.date),
    h: common_vendor.t($data.selectedEvent.time),
    i: common_vendor.t($data.selectedEvent.location)
  } : {}, {
    j: $data.formErrors.name ? 1 : "",
    k: $data.formData.name,
    l: common_vendor.o(($event) => $data.formData.name = $event.detail.value),
    m: $data.formErrors.name
  }, $data.formErrors.name ? {
    n: common_vendor.t($data.formErrors.name)
  } : {}, {
    o: $data.formErrors.phone ? 1 : "",
    p: $data.formData.phone,
    q: common_vendor.o(($event) => $data.formData.phone = $event.detail.value),
    r: $data.formErrors.phone
  }, $data.formErrors.phone ? {
    s: common_vendor.t($data.formErrors.phone)
  } : {}, {
    t: $data.formData.participants,
    v: common_vendor.o(($event) => $data.formData.participants = $event.detail.value),
    w: $data.formData.remark,
    x: common_vendor.o(($event) => $data.formData.remark = $event.detail.value),
    y: common_vendor.o((...args) => $options.submitBooking && $options.submitBooking(...args)),
    z: common_vendor.o((...args) => $options.closeBookingForm && $options.closeBookingForm(...args))
  }) : {}, {
    A: $data.showConfirmation
  }, $data.showConfirmation ? {
    B: common_vendor.t($data.confirmationData.eventTitle),
    C: common_vendor.t($data.confirmationData.eventDate),
    D: common_vendor.t($data.confirmationData.eventTime),
    E: common_vendor.t($data.confirmationData.eventLocation),
    F: common_vendor.t($data.confirmationData.name),
    G: common_vendor.t($data.confirmationData.phone),
    H: common_vendor.t($data.confirmationData.participants),
    I: common_vendor.o((...args) => $options.goToRecordsFromConfirm && $options.goToRecordsFromConfirm(...args)),
    J: common_vendor.o((...args) => $options.closeConfirmation && $options.closeConfirmation(...args)),
    K: common_vendor.o((...args) => $options.closeConfirmation && $options.closeConfirmation(...args))
  } : {}, {
    L: $data.navPaddingTop + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c72e0a46"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/sound-healing/offline-booking.js.map
