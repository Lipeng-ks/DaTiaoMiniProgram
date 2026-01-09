"use strict";
const common_vendor = require("../../common/vendor.js");
const services_aromaProduct_service = require("../../services/aroma-product.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      statusBarHeight: 20,
      navPaddingTop: 140,
      categories: [],
      products: [],
      selectedCategory: "",
      selectedProduct: null,
      showDetail: false,
      loading: true
    };
  },
  onLoad() {
    const info = common_vendor.index.getSystemInfoSync();
    const sbh = info.statusBarHeight || 20;
    this.statusBarHeight = sbh;
    this.navPaddingTop = sbh + 75;
    this.loadProducts();
  },
  methods: {
    /**
     * 加载产品数据
     */
    async loadProducts() {
      this.loading = true;
      try {
        this.categories = services_aromaProduct_service.getAromaCategories();
        this.products = services_aromaProduct_service.getAromaProducts(this.selectedCategory);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/aroma-healing/aroma-shop.vue:132", "Failed to load products:", err);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    /**
     * 按分类筛选产品
     * @param {string} categoryId - 分类ID
     */
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.products = services_aromaProduct_service.getAromaProducts(categoryId);
    },
    /**
     * 打开产品详情弹窗
     * @param {Object} product - 产品对象
     */
    openProductDetail(product) {
      this.selectedProduct = product;
      this.showDetail = true;
    },
    /**
     * 关闭产品详情弹窗
     */
    closeProductDetail() {
      this.showDetail = false;
      this.selectedProduct = null;
    },
    /**
     * 跳转外部商城
     */
    navigateToShop() {
      if (!this.selectedProduct) {
        return;
      }
      const shopUrl = services_aromaProduct_service.getAromaShopUrl(this.selectedProduct.id);
      if (!shopUrl) {
        common_vendor.index.showToast({
          title: "商城链接暂不可用",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(shopUrl)}`,
        fail: () => {
          common_vendor.index.setClipboardData({
            data: shopUrl,
            success: () => {
              common_vendor.index.showToast({
                title: "链接已复制，请在浏览器中打开",
                icon: "none",
                duration: 2e3
              });
            },
            fail: () => {
              common_vendor.index.showToast({
                title: "商城链接暂不可用",
                icon: "none"
              });
            }
          });
        }
      });
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
      title: "线上香氛选购",
      subtitle: "壮族特色香氛产品",
      gradient: "linear-gradient(120deg, #880e4f 0%, #c2185b 45%, #e91e63 100%)"
    }),
    b: $data.selectedCategory === "" ? 1 : "",
    c: common_vendor.o(($event) => $options.filterByCategory("")),
    d: common_vendor.f($data.categories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.icon),
        b: common_vendor.t(category.name),
        c: category.id,
        d: $data.selectedCategory === category.id ? 1 : "",
        e: common_vendor.o(($event) => $options.filterByCategory(category.id), category.id)
      };
    }),
    e: $data.loading
  }, $data.loading ? {} : $data.products.length > 0 ? {
    g: common_vendor.f($data.products, (product, k0, i0) => {
      return {
        a: product.image,
        b: common_vendor.t(product.name),
        c: common_vendor.t(product.price),
        d: product.id,
        e: common_vendor.o(($event) => $options.openProductDetail(product), product.id)
      };
    })
  } : {}, {
    f: $data.products.length > 0,
    h: $data.showDetail
  }, $data.showDetail ? common_vendor.e({
    i: common_vendor.o((...args) => $options.closeProductDetail && $options.closeProductDetail(...args)),
    j: $data.selectedProduct
  }, $data.selectedProduct ? common_vendor.e({
    k: $data.selectedProduct.image,
    l: common_vendor.t($data.selectedProduct.name),
    m: common_vendor.t($data.selectedProduct.price),
    n: common_vendor.t($data.selectedProduct.description),
    o: $data.selectedProduct.effect
  }, $data.selectedProduct.effect ? {
    p: common_vendor.t($data.selectedProduct.effect)
  } : {}) : {}, {
    q: common_vendor.o((...args) => $options.navigateToShop && $options.navigateToShop(...args)),
    r: common_vendor.o(() => {
    }),
    s: common_vendor.o((...args) => $options.closeProductDetail && $options.closeProductDetail(...args))
  }) : {}, {
    t: $data.navPaddingTop + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-24b85f79"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/aroma-healing/aroma-shop.js.map
