"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 20,
      entries: [
        {
          id: "aroma-shop",
          title: "线上香气选购",
          description: "浏览壮族特色香气产品，在线选购",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c4.97 0 9-2.69 9-6v-2c0-3.31-4.03-6-9-6s-9 2.69-9 6v2c0 3.31 4.03 6 9 6z"/><path d="M12 8V2"/><path d="M8 4l4-2 4 2"/></svg>',
          path: "/pages/aroma-healing/aroma-shop"
        },
        {
          id: "salon-booking",
          title: "线下香气沙龙预约",
          description: "预约参加香气沙龙活动，体验香气文化",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
          path: "/pages/aroma-healing/salon-booking"
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-efa83931"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/aroma-healing/aroma-healing.js.map
