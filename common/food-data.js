const STORAGE_KEY = 'foodList'

export const defaultFoodList = [
  {
    _id: 'demo-1',
    name: '麻婆豆腐',
    desc: '豆腐滑嫩，麻香入味',
    category: '素菜',
    img: '/static/food_demo-1.png',
    isDelete: false
  },
  {
    _id: 'demo-2',
    name: '蒜蓉西兰花',
    desc: '清脆爽口，蒜香浓郁',
    category: '素菜',
    img: '/static/food_demo-2.png',
    isDelete: false
  },
  {
    _id: 'demo-3',
    name: '醋溜土豆丝',
    desc: '酸甜开胃，口感鲜脆',
    category: '素菜',
    img: '/static/food_demo-3.png',
    isDelete: false
  },
  {
    _id: 'demo-4',
    name: '油菜炒香菇',
    desc: '清爽鲜嫩，菌香十足',
    category: '素菜',
    img: '/static/food_demo-4.png',
    isDelete: false
  },
  {
    _id: 'demo-5',
    name: '鸡蛋抱豆腐',
    desc: '软滑入味，鲜香淡雅',
    category: '素菜',
    img: '/static/food_demo-5.png',
    isDelete: false
  },
  {
    _id: 'demo-6',
    name: '素炒藕片',
    desc: '爽脆清淡，健康低脂',
    category: '素菜',
    img: '/static/food_demo-6.png',
    isDelete: false
  },
  {
    _id: 'demo-7',
    name: '尖椒土豆片',
    desc: '微辣开胃，口感筋道',
    category: '素菜',
    img: '/static/food_demo-7.png',
    isDelete: false
  },
  {
    _id: 'demo-8',
    name: '醋溜豆芽',
    desc: '清爽脆嫩，利于消化',
    category: '素菜',
    img: '/static/food_demo-8.png',
    isDelete: false
  },
  {
    _id: 'demo-9',
    name: '蒜香豇豆角',
    desc: '蒜香浓郁，豆角爽脆',
    category: '素菜',
    img: '/static/food_demo-9.png',
    isDelete: false
  },
  {
    _id: 'demo-10',
    name: '西葫芦炒鸡蛋',
    desc: '软嫩清甜，营养搭配',
    category: '素菜',
    img: '/static/food_demo-10.png',
    isDelete: false
  },
  {
    _id: 'demo-11',
    name: '蒜黄炒鸡蛋',
    desc: '香气四溢，嫩滑鲜美',
    category: '素菜',
    img: '/static/food_demo-11.png',
    isDelete: false
  },
  {
    _id: 'demo-12',
    name: '尖椒炒鸡蛋',
    desc: '微辣提味，鲜香十足',
    category: '素菜',
    img: '/static/food_demo-12.png',
    isDelete: false
  },
  {
    _id: 'demo-13',
    name: '西红柿炒鸡蛋',
    desc: '家常经典，酸甜开胃',
    category: '素菜',
    img: '/static/food_demo-13.png',
    isDelete: false
  },
  {
    _id: 'demo-14',
    name: '鱼香肉丝',
    desc: '酸甜微辣，鲜香浓郁',
    category: '荤菜',
    img: '/static/food_demo-14.png',
    isDelete: false
  },
  {
    _id: 'demo-15',
    name: '木须肉',
    desc: '色彩丰富，鲜嫩爽口',
    category: '荤菜',
    img: '/static/food_demo-15.png',
    isDelete: false
  },
  {
    _id: 'demo-16',
    name: '糖醋排骨',
    desc: '酸甜适口，骨肉酥香',
    category: '荤菜',
    img: '/static/food_demo-16.png',
    isDelete: false
  },
  {
    _id: 'demo-17',
    name: '红烧猪蹄',
    desc: '胶原满满，软糯入味',
    category: '荤菜',
    img: '/static/food_demo-17.png',
    isDelete: false
  },
  {
    _id: 'demo-18',
    name: '可乐鸡翅',
    desc: '甜香微焦，色泽诱人',
    category: '荤菜',
    img: '/static/food_demo-18.png',
    isDelete: false
  },
  {
    _id: 'demo-19',
    name: '土豆炖牛腩',
    desc: '土豆软糯，牛腩酥烂',
    category: '荤菜',
    img: '/static/food_demo-19.png',
    isDelete: false
  },
  {
    _id: 'demo-20',
    name: '油闷大虾',
    desc: '虾肉鲜甜，汁浓味美',
    category: '荤菜',
    img: '/static/food_demo-20.png',
    isDelete: false
  },
  {
    _id: 'demo-21',
    name: '芹菜炒肉',
    desc: '芹香清爽，肉片鲜嫩',
    category: '荤菜',
    img: '/static/food_demo-21.png',
    isDelete: false
  },
  {
    _id: 'demo-22',
    name: '杏鲍菇炒肉',
    desc: '菌香浓郁，肉片嫩滑',
    category: '荤菜',
    img: '/static/food_demo-22.png',
    isDelete: false
  },
  {
    _id: 'demo-23',
    name: '辣椒炒肉',
    desc: '香辣下饭，肉片入味',
    category: '荤菜',
    img: '/static/food_demo-23.png',
    isDelete: false
  },
  {
    _id: 'demo-24',
    name: '尖椒肉丝',
    desc: '鲜辣爽口，肉丝嫩滑',
    category: '荤菜',
    img: '/static/food_demo-24.png',
    isDelete: false
  },
  {
    _id: 'demo-25',
    name: '玉米排骨汤',
    desc: '汤汁清甜，营养滋补',
    category: '汤类',
    img: '/static/food_demo-25.png',
    isDelete: false
  },
  {
    _id: 'demo-26',
    name: '绿豆汤',
    desc: '清热解暑，清香甘甜',
    category: '汤类',
    img: '/static/food_demo-26.png',
    isDelete: false
  },
  {
    _id: 'demo-27',
    name: '可口可乐',
    desc: '冰爽气泡，畅快解渴',
    category: '饮品',
    img: '/static/food_demo-27.png',
    isDelete: false
  },
  {
    _id: 'demo-28',
    name: '鲜肉包子',
    desc: '皮薄多汁，鲜香饱满',
    category: '主食',
    img: '/static/food_demo-28.png',
    isDelete: false
  },
  {
    _id: 'demo-29',
    name: '白馒头',
    desc: '松软绵密，家庭常见主食',
    category: '主食',
    img: '/static/food_demo-29.png',
    isDelete: false
  },
  {
    _id: 'demo-30',
    name: '米饭',
    desc: '颗粒饱满，搭配任意菜品',
    category: '主食',
    img: '/static/food_demo-30.png',
    isDelete: false
  },
  {
    _id: 'demo-31',
    name: '香煎大饼',
    desc: '外脆里软，香气扑鼻',
    category: '主食',
    img: '/static/food_demo-31.png',
    isDelete: false
  }
]

export function getStoredFoodList() {
  const stored = uni.getStorageSync(STORAGE_KEY)
  if (Array.isArray(stored)) {
    return stored
  }
  return JSON.parse(JSON.stringify(defaultFoodList))
}

export function saveFoodList(foodList) {
  uni.setStorageSync(STORAGE_KEY, foodList)
}

export function ensureFoodListStorage() {
  const stored = uni.getStorageSync(STORAGE_KEY)
  if (!Array.isArray(stored)) {
    uni.setStorageSync(STORAGE_KEY, JSON.parse(JSON.stringify(defaultFoodList)))
  }
}
