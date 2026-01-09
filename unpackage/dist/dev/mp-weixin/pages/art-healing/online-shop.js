"use strict";
const common_vendor = require("../../common/vendor.js");
const services_product_service = require("../../services/product.service.js");
const CustomNavBar = () => "../../components/CustomNavBar.js";
const _sfc_main = {
  components: { CustomNavBar },
  data() {
    return {
      navPaddingTop: 100,
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
    this.navPaddingTop = (info.statusBarHeight || 20) + 75;
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        this.categories = services_product_service.getCategories();
        this.products = services_product_service.getProducts(this.selectedCategory);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/art-healing/online-shop.vue:122", "Failed to load products:", err);
        common_vendor.index.showToast({ title: "加载失败，请重试", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.products = services_product_service.getProducts(categoryId);
    },
    openProductDetail(product) {
      this.selectedProduct = product;
      this.showDetail = true;
    },
    closeProductDetail() {
      this.showDetail = false;
      this.selectedProduct = null;
    },
    navigateToShop() {
      if (!this.selectedProduct)
        return;
      const shopUrl = services_product_service.getShopUrl(this.selectedProduct.id);
      if (!shopUrl) {
        common_vendor.index.showToast({ title: "商城链接暂不可用", icon: "none" });
        return;
      }
      common_vendor.index.setClipboardData({
        data: shopUrl,
        success: () => {
          common_vendor.index.showToast({ title: "链接已复制，请在浏览器中打开", icon: "none", duration: 2e3 });
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
      title: "线上文创选购",
      subtitle: "壮族特色文创产品",
      gradient: "linear-gradient(120deg, #e65100 0%, #ff9800 45%, #ffb74d 100%)"
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
  }, $data.selectedProduct ? {
    k: $data.selectedProduct.image,
    l: common_vendor.t($data.selectedProduct.name),
    m: common_vendor.t($data.selectedProduct.price),
    n: common_vendor.t($data.selectedProduct.description)
  } : {}, {
    o: common_vendor.o((...args) => $options.navigateToShop && $options.navigateToShop(...args)),
    p: common_vendor.o(() => {
    }),
    q: common_vendor.o((...args) => $options.closeProductDetail && $options.closeProductDetail(...args))
  }) : {}, {
    r: $data.navPaddingTop + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-923cb5be"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/art-healing/online-shop.js.map
