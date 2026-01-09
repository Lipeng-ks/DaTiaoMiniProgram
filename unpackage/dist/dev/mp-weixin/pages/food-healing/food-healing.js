"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 20,
      entries: [
        {
          id: "food-shop",
          title: "线上壮族特色美食选购",
          description: "浏览壮族特色美食产品，在线选购",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
          path: "/pages/food-healing/food-shop"
        },
        {
          id: "cooking-booking",
          title: "线下壮乡美食制作体验",
          description: "预约参加美食制作体验活动，体验壮乡美食文化",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
          path: "/pages/food-healing/cooking-booking"
        }
      ]
    };
  },
  onLoad() {
    const sysInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight || 20;
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    navigateTo(path) {
      common_vendor.index.navigateTo({ url: path });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.statusBarHeight + "px",
    c: common_vendor.f($data.entries, (entry, k0, i0) => {
      return {
        a: entry.svgIcon,
        b: common_vendor.t(entry.title),
        c: common_vendor.t(entry.description),
        d: entry.id,
        e: common_vendor.o(($event) => $options.navigateTo(entry.path), entry.id)
      };
    }),
    d: $data.statusBarHeight + 110 + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-70870cd1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food-healing/food-healing.js.map
