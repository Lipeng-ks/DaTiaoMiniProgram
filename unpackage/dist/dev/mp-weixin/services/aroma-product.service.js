"use strict";
const aromaCategories = [
  { id: "essential-oil", name: "精油", icon: "💧" },
  { id: "candle", name: "香薰蜡烛", icon: "🕯️" },
  { id: "sachet", name: "香包香囊", icon: "🎀" },
  { id: "bath", name: "沐浴香氛", icon: "🛁" }
];
const sampleAromaProducts = [
  // 精油类
  {
    id: "aroma-1",
    name: "壮乡茶树精油",
    description: "采用广西本地茶树叶提取，具有清新净化的功效，适合日常香薰使用。",
    price: 128,
    image: "/static/images/aroma1.jpg",
    categoryId: "essential-oil",
    effect: "清新净化、提神醒脑、舒缓压力",
    shopUrl: "https://weidian.com/item/aroma1"
  },
  {
    id: "aroma-2",
    name: "八角茴香精油",
    description: "壮族传统香料八角提取的精油，温暖甜美的香气，有助于放松身心。",
    price: 98,
    image: "/static/images/aroma2.jpg",
    categoryId: "essential-oil",
    effect: "温暖舒适、促进睡眠、缓解疲劳",
    shopUrl: "https://weidian.com/item/aroma2"
  },
  {
    id: "aroma-3",
    name: "桂花精油",
    description: "广西桂林特产桂花提取，香气馥郁持久，是壮乡代表性香氛。",
    price: 158,
    image: "/static/images/aroma3.jpg",
    categoryId: "essential-oil",
    effect: "安神助眠、美容养颜、愉悦心情",
    shopUrl: "https://weidian.com/item/aroma3"
  },
  // 香薰蜡烛类
  {
    id: "aroma-4",
    name: "壮锦纹样香薰蜡烛",
    description: "蜡烛外观采用壮锦纹样设计，融合壮族草本香气，燃烧时散发自然芬芳。",
    price: 88,
    image: "/static/images/aroma4.jpg",
    categoryId: "candle",
    effect: "营造氛围、净化空气、舒缓情绪",
    shopUrl: "https://weidian.com/item/aroma4"
  },
  {
    id: "aroma-5",
    name: "山茶花香薰蜡烛",
    description: "以广西山茶花为灵感，清雅淡香，适合卧室和书房使用。",
    price: 68,
    image: "/static/images/aroma5.jpg",
    categoryId: "candle",
    effect: "清新淡雅、助眠放松、提升专注",
    shopUrl: "https://weidian.com/item/aroma5"
  },
  // 香包香囊类
  {
    id: "aroma-6",
    name: "壮族绣球香囊",
    description: "传统壮族绣球造型，内含多种壮乡草本香料，可挂于车内或衣柜。",
    price: 48,
    image: "/static/images/aroma6.jpg",
    categoryId: "sachet",
    effect: "驱蚊防虫、清新空气、传统祝福",
    shopUrl: "https://weidian.com/item/aroma6"
  },
  {
    id: "aroma-7",
    name: "艾草香包",
    description: "采用广西野生艾草制作，端午传统香包，具有驱邪避秽的寓意。",
    price: 38,
    image: "/static/images/aroma7.jpg",
    categoryId: "sachet",
    effect: "驱蚊辟邪、安神定志、传统养生",
    shopUrl: "https://weidian.com/item/aroma7"
  },
  {
    id: "aroma-8",
    name: "薰衣草安眠香囊",
    description: "融合壮乡草本与薰衣草，专为改善睡眠设计，可放置枕边。",
    price: 58,
    image: "/static/images/aroma8.jpg",
    categoryId: "sachet",
    effect: "改善睡眠、舒缓焦虑、放松身心",
    shopUrl: "https://weidian.com/item/aroma8"
  },
  // 沐浴香氛类
  {
    id: "aroma-9",
    name: "壮乡草本沐浴盐",
    description: "融合多种壮族传统草本植物，沐浴时释放天然香气，滋养肌肤。",
    price: 78,
    image: "/static/images/aroma9.jpg",
    categoryId: "bath",
    effect: "深层清洁、滋养肌肤、放松肌肉",
    shopUrl: "https://weidian.com/item/aroma9"
  },
  {
    id: "aroma-10",
    name: "桂花沐浴露",
    description: "桂花精华配方，沐浴后留香持久，让肌肤散发自然花香。",
    price: 68,
    image: "/static/images/aroma10.jpg",
    categoryId: "bath",
    effect: "温和清洁、持久留香、滋润保湿",
    shopUrl: "https://weidian.com/item/aroma10"
  },
  {
    id: "aroma-11",
    name: "草本泡澡球套装",
    description: "含多种壮乡草本成分的泡澡球，泡澡时释放香气和精华，舒缓身心。",
    price: 98,
    image: "/static/images/aroma11.jpg",
    categoryId: "bath",
    effect: "舒缓疲劳、滋养肌肤、芳香疗愈",
    shopUrl: "https://weidian.com/item/aroma11"
  }
];
function getAromaCategories() {
  return aromaCategories;
}
function getAromaProducts(categoryId) {
  if (!categoryId || categoryId === "") {
    return sampleAromaProducts;
  }
  return sampleAromaProducts.filter((product) => product.categoryId === categoryId);
}
function getAromaProductById(productId) {
  if (!productId) {
    return null;
  }
  return sampleAromaProducts.find((product) => product.id === productId) || null;
}
function getAromaShopUrl(productId) {
  const product = getAromaProductById(productId);
  if (!product) {
    return null;
  }
  return product.shopUrl || null;
}
exports.getAromaCategories = getAromaCategories;
exports.getAromaProducts = getAromaProducts;
exports.getAromaShopUrl = getAromaShopUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/aroma-product.service.js.map
