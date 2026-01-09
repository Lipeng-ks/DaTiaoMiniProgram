"use strict";
const foodCategories = [
  { id: "glutinous-rice", name: "糯米制品", icon: "🍚" },
  { id: "pickled", name: "腌制食品", icon: "🥒" },
  { id: "pastry", name: "糕点小吃", icon: "🍰" },
  { id: "beverage", name: "特色饮品", icon: "🍵" }
];
const sampleFoodProducts = [
  // 糯米制品类
  {
    id: "food-1",
    name: "五色糯米饭",
    description: "壮族传统节日美食，用天然植物染色，色彩斑斓，寓意五谷丰登。",
    price: 38,
    image: "/static/images/food1.jpg",
    categoryId: "glutinous-rice",
    ingredients: "糯米、枫叶、黄姜、紫蕃藤、红蓝草",
    taste: "软糯香甜、清香自然、色彩缤纷",
    shopUrl: "https://weidian.com/item/food1"
  },
  {
    id: "food-2",
    name: "壮族粽子",
    description: "采用传统工艺包制，馅料丰富，粽叶清香，是壮族端午必备美食。",
    price: 28,
    image: "/static/images/food2.jpg",
    categoryId: "glutinous-rice",
    ingredients: "糯米、猪肉、绿豆、板栗、粽叶",
    taste: "咸香软糯、肉香四溢、回味悠长",
    shopUrl: "https://weidian.com/item/food2"
  },
  {
    id: "food-3",
    name: "糍粑",
    description: "壮族传统糯米糕点，口感软糯，可蘸糖或炸食，老少皆宜。",
    price: 25,
    image: "/static/images/food3.jpg",
    categoryId: "glutinous-rice",
    ingredients: "糯米、芝麻、花生、白糖",
    taste: "软糯弹牙、香甜可口、外酥里嫩",
    shopUrl: "https://weidian.com/item/food3"
  },
  // 腌制食品类
  {
    id: "food-4",
    name: "酸嘢拼盘",
    description: "广西特色酸味小吃，选用新鲜蔬果腌制，酸爽开胃，消暑解腻。",
    price: 22,
    image: "/static/images/food4.jpg",
    categoryId: "pickled",
    ingredients: "萝卜、黄瓜、木瓜、芒果、辣椒",
    taste: "酸辣爽脆、开胃解腻、清新爽口",
    shopUrl: "https://weidian.com/item/food4"
  },
  {
    id: "food-5",
    name: "酸笋",
    description: "壮族传统发酵食品，用于烹饪各种菜肴，增添独特风味。",
    price: 18,
    image: "/static/images/food5.jpg",
    categoryId: "pickled",
    ingredients: "竹笋、盐、米汤",
    taste: "酸香浓郁、脆嫩爽口、风味独特",
    shopUrl: "https://weidian.com/item/food5"
  },
  {
    id: "food-6",
    name: "腌柠檬",
    description: "广西特产腌制柠檬，可泡水饮用或调味，酸甜可口。",
    price: 35,
    image: "/static/images/food6.jpg",
    categoryId: "pickled",
    ingredients: "柠檬、冰糖、蜂蜜、盐",
    taste: "酸甜适中、清香怡人、生津止渴",
    shopUrl: "https://weidian.com/item/food6"
  },
  // 糕点小吃类
  {
    id: "food-7",
    name: "马蹄糕",
    description: "广西传统糕点，以马蹄粉制作，口感爽滑，清甜不腻。",
    price: 28,
    image: "/static/images/food7.jpg",
    categoryId: "pastry",
    ingredients: "马蹄粉、马蹄、冰糖、椰浆",
    taste: "爽滑弹嫩、清甜可口、入口即化",
    shopUrl: "https://weidian.com/item/food7"
  },
  {
    id: "food-8",
    name: "芋头糕",
    description: "壮族传统糕点，选用优质芋头制作，香糯软滑。",
    price: 32,
    image: "/static/images/food8.jpg",
    categoryId: "pastry",
    ingredients: "芋头、粘米粉、腊肉、虾米、香菇",
    taste: "芋香浓郁、咸香软糯、层次丰富",
    shopUrl: "https://weidian.com/item/food8"
  },
  {
    id: "food-9",
    name: "艾粑粑",
    description: "清明时节壮族传统小吃，用艾草汁和糯米制作，清香软糯。",
    price: 20,
    image: "/static/images/food9.jpg",
    categoryId: "pastry",
    ingredients: "糯米粉、艾草、花生、芝麻、红糖",
    taste: "艾草清香、软糯香甜、健康养生",
    shopUrl: "https://weidian.com/item/food9"
  },
  // 特色饮品类
  {
    id: "food-10",
    name: "油茶",
    description: "壮族传统饮品，用茶叶、姜、蒜等熬制，驱寒暖胃，提神醒脑。",
    price: 45,
    image: "/static/images/food10.jpg",
    categoryId: "beverage",
    ingredients: "茶叶、生姜、大蒜、花生、米花",
    taste: "浓郁醇厚、微苦回甘、暖身驱寒",
    shopUrl: "https://weidian.com/item/food10"
  },
  {
    id: "food-11",
    name: "罗汉果茶",
    description: "广西特产罗汉果制作的养生茶饮，清热润肺，甘甜可口。",
    price: 58,
    image: "/static/images/food11.jpg",
    categoryId: "beverage",
    ingredients: "罗汉果、枸杞、菊花、冰糖",
    taste: "甘甜清润、清热解暑、润肺止咳",
    shopUrl: "https://weidian.com/item/food11"
  },
  {
    id: "food-12",
    name: "酸梅汤",
    description: "广西传统消暑饮品，酸甜可口，生津止渴，夏日必备。",
    price: 25,
    image: "/static/images/food12.jpg",
    categoryId: "beverage",
    ingredients: "乌梅、山楂、陈皮、甘草、冰糖",
    taste: "酸甜爽口、生津解渴、消暑开胃",
    shopUrl: "https://weidian.com/item/food12"
  }
];
function getFoodCategories() {
  return foodCategories;
}
function getFoodProducts(categoryId) {
  if (!categoryId || categoryId === "") {
    return sampleFoodProducts;
  }
  return sampleFoodProducts.filter((product) => product.categoryId === categoryId);
}
function getFoodProductById(productId) {
  if (!productId) {
    return null;
  }
  return sampleFoodProducts.find((product) => product.id === productId) || null;
}
function getFoodShopUrl(productId) {
  const product = getFoodProductById(productId);
  if (!product) {
    return null;
  }
  return product.shopUrl || null;
}
exports.getFoodCategories = getFoodCategories;
exports.getFoodProducts = getFoodProducts;
exports.getFoodShopUrl = getFoodShopUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/food-product.service.js.map
