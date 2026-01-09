"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "CustomNavBar",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    gradient: { type: String, default: "linear-gradient(120deg, #1b5e20 0%, #2e7d32 45%, #43a047 100%)" },
    showBack: { type: Boolean, default: true }
  },
  data() {
    return {
      statusBarHeight: 20
    };
  },
  created() {
    const info = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = info.statusBarHeight || 20;
  },
  methods: {
    handleBack() {
      this.$emit("back");
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.showBack
  }, $props.showBack ? {} : {}, {
    b: common_vendor.o(($event) => $props.showBack && $options.handleBack()),
    c: common_vendor.t($props.title),
    d: $props.subtitle
  }, $props.subtitle ? {
    e: common_vendor.t($props.subtitle)
  } : {}, {
    f: $data.statusBarHeight + "px",
    g: $props.gradient
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-35f38da3"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/CustomNavBar.js.map
