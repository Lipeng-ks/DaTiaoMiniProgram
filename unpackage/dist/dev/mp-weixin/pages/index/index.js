"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      statusBarHeight: 20,
      healingCards: [
        {
          id: "sound-healing",
          title: "声愈",
          description: "山歌疗愈心灵",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
          path: "/pages/sound-healing/sound-healing",
          enabled: true
        },
        {
          id: "art-healing",
          title: "艺愈",
          description: "艺术滋养身心",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
          path: "/pages/art-healing/art-healing",
          enabled: true
        },
        {
          id: "aroma-healing",
          title: "香愈",
          description: "香气舒缓情绪",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c4.97 0 9-2.69 9-6v-2c0-3.31-4.03-6-9-6s-9 2.69-9 6v2c0 3.31 4.03 6 9 6z"/><path d="M12 8V2"/><path d="M8 4l4-2 4 2"/></svg>',
          path: "/pages/aroma-healing/aroma-healing",
          enabled: true
        },
        {
          id: "food-healing",
          title: "食愈",
          description: "美食疗愈味蕾",
          svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
          path: "/pages/food-healing/food-healing",
          enabled: true
        }
      ]
    };
  },
  onLoad() {
    const sysInfo = common_vendor.index.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight || 20;
  },
  methods: {
    navigateTo(card) {
      if (card.enabled && card.path) {
        common_vendor.index.navigateTo({ url: card.path });
      } else {
        common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.statusBarHeight + "px",
    b: common_vendor.f($data.healingCards, (card, k0, i0) => {
      return {
        a: card.svgIcon,
        b: common_vendor.n(card.id + "-icon"),
        c: common_vendor.t(card.title),
        d: common_vendor.t(card.description),
        e: card.id,
        f: common_vendor.n(card.id),
        g: common_vendor.o(($event) => $options.navigateTo(card), card.id)
      };
    }),
    c: $data.statusBarHeight + 110 + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
