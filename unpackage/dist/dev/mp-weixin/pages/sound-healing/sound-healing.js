"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 20,
      entries: [
        {
          id: "online-duet",
          title: "线上山歌对唱",
          description: "选择喜爱的山歌，录制你的歌声",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
          path: "/pages/sound-healing/online-duet"
        },
        {
          id: "offline-booking",
          title: "线下山歌挑战预约",
          description: "预约线下山歌活动，体验壮乡文化",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
          path: "/pages/sound-healing/offline-booking"
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c1821460"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/sound-healing/sound-healing.js.map
