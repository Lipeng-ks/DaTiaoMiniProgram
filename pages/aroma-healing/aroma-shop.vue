<template>
  <view class="aroma-shop-container" :style="{ paddingTop: navPaddingTop + 'px' }">
    <custom-nav-bar
      title="线上香氛选购"
      subtitle="壮族特色香氛产品"
      gradient="linear-gradient(120deg, #880e4f 0%, #c2185b 45%, #e91e63 100%)"
    />
    
    <!-- 分类标签栏 -->
    <view class="categories">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view 
          class="category-item"
          :class="{ active: selectedCategory === '' }"
          @click="filterByCategory('')"
        >
          <text>全部</text>
        </view>
        <view 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: selectedCategory === category.id }"
          @click="filterByCategory(category.id)"
        >
          <text>{{ category.icon }} {{ category.name }}</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <!-- 产品列表（网格布局） -->
    <view class="product-grid" v-else-if="products.length > 0">
      <view 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
        @click="openProductDetail(product)"
      >
        <image 
          :src="product.image" 
          class="product-image" 
          mode="aspectFill"
        ></image>
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-price">¥{{ product.price }}</text>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-icon">🌸</text>
      <text class="empty-text">暂无产品</text>
    </view>

    <!-- 产品详情弹窗 -->
    <view class="modal-overlay" v-if="showDetail" @click="closeProductDetail">
      <view class="product-detail-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">产品详情</text>
          <text class="modal-close" @click="closeProductDetail">×</text>
        </view>
        
        <scroll-view scroll-y class="modal-content" v-if="selectedProduct">
          <image 
            :src="selectedProduct.image" 
            class="detail-image" 
            mode="aspectFill"
          ></image>
          <view class="detail-info">
            <text class="detail-name">{{ selectedProduct.name }}</text>
            <text class="detail-price">¥{{ selectedProduct.price }}</text>
            <text class="detail-desc">{{ selectedProduct.description }}</text>
            <view class="detail-effect" v-if="selectedProduct.effect">
              <text class="effect-label">功效：</text>
              <text class="effect-text">{{ selectedProduct.effect }}</text>
            </view>
          </view>
        </scroll-view>
        
        <view class="modal-footer">
          <button class="buy-btn" @click="navigateToShop">
            立即购买
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CustomNavBar from '@/components/CustomNavBar.vue'
import { getAromaCategories, getAromaProducts, getAromaShopUrl } from '@/services/aroma-product.service.js'

export default {
  components: { CustomNavBar },
  data() {
    return {
      statusBarHeight: 20,
      navPaddingTop: 140,
      categories: [],
      products: [],
      selectedCategory: '',
      selectedProduct: null,
      showDetail: false,
      loading: true
    }
  },
  onLoad() {
    const info = uni.getSystemInfoSync()
    const sbh = info.statusBarHeight || 20
    this.statusBarHeight = sbh
    this.navPaddingTop = sbh + 75
    this.loadProducts()
  },
  methods: {
    /**
     * 加载产品数据
     */
    async loadProducts() {
      this.loading = true
      try {
        this.categories = getAromaCategories()
        this.products = getAromaProducts(this.selectedCategory)
      } catch (err) {
        console.error('Failed to load products:', err)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    /**
     * 按分类筛选产品
     * @param {string} categoryId - 分类ID
     */
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId
      this.products = getAromaProducts(categoryId)
    },
    
    /**
     * 打开产品详情弹窗
     * @param {Object} product - 产品对象
     */
    openProductDetail(product) {
      this.selectedProduct = product
      this.showDetail = true
    },
    
    /**
     * 关闭产品详情弹窗
     */
    closeProductDetail() {
      this.showDetail = false
      this.selectedProduct = null
    },
    
    /**
     * 跳转外部商城
     */
    navigateToShop() {
      if (!this.selectedProduct) {
        return
      }
      
      const shopUrl = getAromaShopUrl(this.selectedProduct.id)
      
      if (!shopUrl) {
        uni.showToast({
          title: '商城链接暂不可用',
          icon: 'none'
        })
        return
      }
      
      // 尝试跳转外部链接
      // #ifdef H5
      window.open(shopUrl, '_blank')
      // #endif
      
      // #ifndef H5
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(shopUrl)}`,
        fail: () => {
          // 如果没有webview页面，尝试复制链接
          uni.setClipboardData({
            data: shopUrl,
            success: () => {
              uni.showToast({
                title: '链接已复制，请在浏览器中打开',
                icon: 'none',
                duration: 2000
              })
            },
            fail: () => {
              uni.showToast({
                title: '商城链接暂不可用',
                icon: 'none'
              })
            }
          })
        }
      })
      // #endif
    }
  }
}
</script>

<style scoped>
.aroma-shop-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

/* 分类标签栏 */
.categories {
  background: #ffffff;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 16rpx 32rpx;
  margin-right: 20rpx;
  border-radius: 30rpx;
  background: #f0f0f0;
  font-size: 28rpx;
  color: #666;
}

.category-item.active {
  background: #e91e63;
  color: #ffffff;
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 产品网格 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
  gap: 20rpx;
}

.product-card {
  width: calc(50% - 10rpx);
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.product-image {
  width: 100%;
  height: 320rpx;
  background: #f0f0f0;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #e91e63;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 产品详情弹窗 */
.product-detail-modal {
  width: 90%;
  max-width: 600rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 48rpx;
  color: #999;
  line-height: 1;
}

.modal-content {
  flex: 1;
  padding: 30rpx;
  max-height: 60vh;
}

.detail-image {
  width: 100%;
  height: 400rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
  margin-bottom: 30rpx;
}

.detail-info {
  display: flex;
  flex-direction: column;
}

.detail-name {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.detail-price {
  font-size: 40rpx;
  font-weight: bold;
  color: #e91e63;
  margin-bottom: 20rpx;
}

.detail-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.detail-effect {
  background: #fce4ec;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 10rpx;
}

.effect-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #e91e63;
}

.effect-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.buy-btn {
  width: 100%;
  background: linear-gradient(135deg, #e91e63 0%, #f48fb1 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 40rpx;
  padding: 24rpx 0;
  border: none;
}

.buy-btn:active {
  opacity: 0.9;
}
</style>
