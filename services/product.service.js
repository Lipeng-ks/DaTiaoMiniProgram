/**
 * ProductService - 产品服务
 * 负责文创产品数据管理
 */

/**
 * 产品分类列表
 */
export const categories = [
  { id: 'handicraft', name: '手工艺品', icon: '🎨' },
  { id: 'clothing', name: '服饰配饰', icon: '👗' },
  { id: 'artwork', name: '艺术画作', icon: '🖼️' }
]

/**
 * 示例产品数据
 */
export const sampleProducts = [
  {
    id: 'product-1',
    name: '壮锦手工挎包',
    description: '采用传统壮锦工艺编织，图案精美，色彩鲜艳，是壮族文化的代表性手工艺品。',
    price: 268,
    image: '/static/pexels-pripicart-620337.jpg',
    categoryId: 'handicraft',
    shopUrl: 'https://weidian.com/item/product1'
  },
  {
    id: 'product-2',
    name: '铜鼓摆件',
    description: '壮族铜鼓文化的微缩复刻品，精致小巧，适合家居装饰或收藏。',
    price: 188,
    image: '/static/images/product2.jpg',
    categoryId: 'handicraft',
    shopUrl: 'https://weidian.com/item/product2'
  },
  {
    id: 'product-3',
    name: '绣球挂饰',
    description: '手工制作的壮族绣球，寓意吉祥如意，可作为装饰品或礼物。',
    price: 68,
    image: '/static/images/product3.jpg',
    categoryId: 'handicraft',
    shopUrl: 'https://weidian.com/item/product3'
  },
  {
    id: 'product-4',
    name: '壮族刺绣围巾',
    description: '采用壮族传统刺绣工艺，图案为壮族特色花纹，柔软舒适。',
    price: 158,
    image: '/static/images/product4.jpg',
    categoryId: 'clothing',
    shopUrl: 'https://weidian.com/item/product4'
  },
  {
    id: 'product-5',
    name: '银饰耳环',
    description: '壮族传统银饰工艺制作，造型独特，展现民族风情。',
    price: 128,
    image: '/static/images/product5.jpg',
    categoryId: 'clothing',
    shopUrl: 'https://weidian.com/item/product5'
  },
  {
    id: 'product-6',
    name: '民族风手链',
    description: '融合壮族元素设计的手链，时尚与传统的完美结合。',
    price: 88,
    image: '/static/images/product6.jpg',
    categoryId: 'clothing',
    shopUrl: 'https://weidian.com/item/product6'
  },
  {
    id: 'product-7',
    name: '壮乡风光油画',
    description: '描绘壮族山水风光的原创油画，展现壮乡自然之美。',
    price: 580,
    image: '/static/images/product7.jpg',
    categoryId: 'artwork',
    shopUrl: 'https://weidian.com/item/product7'
  },
  {
    id: 'product-8',
    name: '刘三姐水墨画',
    description: '以壮族传说人物刘三姐为主题的水墨画作品。',
    price: 420,
    image: '/static/images/product8.jpg',
    categoryId: 'artwork',
    shopUrl: 'https://weidian.com/item/product8'
  },
  {
    id: 'product-9',
    name: '铜鼓纹样版画',
    description: '以壮族铜鼓纹样为灵感创作的现代版画艺术品。',
    price: 320,
    image: '/static/images/product9.jpg',
    categoryId: 'artwork',
    shopUrl: 'https://weidian.com/item/product9'
  }
]

/**
 * 获取所有产品分类
 * @returns {Array} 分类列表
 */
export function getCategories() {
  return categories
}

/**
 * 获取产品列表
 * @param {string} categoryId - 可选的分类ID
 * @returns {Array} 产品列表
 */
export function getProducts(categoryId) {
  if (!categoryId || categoryId === '') {
    return sampleProducts
  }
  return sampleProducts.filter(product => product.categoryId === categoryId)
}

/**
 * 获取单个产品详情
 * @param {string} productId - 产品ID
 * @returns {Object|null} 产品对象或null
 */
export function getProductById(productId) {
  if (!productId) {
    return null
  }
  return sampleProducts.find(product => product.id === productId) || null
}

/**
 * 获取外部商城链接
 * @param {string} productId - 产品ID
 * @returns {string|null} 商城链接或null
 */
export function getShopUrl(productId) {
  const product = getProductById(productId)
  if (!product) {
    return null
  }
  return product.shopUrl || null
}

export default {
  categories,
  sampleProducts,
  getCategories,
  getProducts,
  getProductById,
  getShopUrl
}
