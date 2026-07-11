<template>
  <view class="container">
    <view class="sidebar">
      <view class="logo">点餐</view>
      <button class="nav-btn" @tap="goAdmin" v-if="isAdmin">管理</button>
      <button class="nav-btn" @tap="filterAll">所有菜品</button>
      <button class="nav-btn" @tap="filterCategory('素菜')">素菜</button>
      <button class="nav-btn" @tap="filterCategory('荤菜')">荤菜</button>
      <button class="nav-btn" @tap="filterCategory('主食')">主食</button>
      <button class="nav-btn" @tap="filterCategory('粥类')">粥类</button>
      <button class="nav-btn" @tap="filterCategory('饮品')">饮品</button>
      <button class="nav-btn" @tap="filterCategory('汤类')">汤类</button>
      <view style="flex:1"></view>
      <button class="bottom-btn" @tap="goProfile">个人主页</button>
      <button class="bottom-btn" @tap="goCart">购物车 ({{ cartTotalNum }})</button>
    </view>

    <view class="main">
      <view class="food-grid">
        <view v-for="(item, index) in displayedFoods" :key="item._id || index" class="card">
          <image :src="item.img || 'https://via.placeholder.com/240'" mode="aspectFill" class="food-image"></image>
          <view class="card-body">
            <text class="name">{{ item.name }}</text>
            <text class="desc">{{ item.desc }}</text>
            <view class="meta">
              <button @tap="addCartById(item._id)" :disabled="item.isDelete">{{ item.isDelete ? '已下架' : '+ 加入' }}</button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      adminOpenid: '',
      isAdmin: false,
      foodList: [
        {
          _id: 'demo-1',
          name: '麻婆豆腐',
          desc: '豆腐滑嫩，麻香入味',
          category: '素菜',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-2',
          name: '蒜蓉西兰花',
          desc: '清脆爽口，蒜香浓郁',
          category: '素菜',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-3',
          name: '宫保鸡丁',
          desc: '鸡丁香辣，花生脆口',
          category: '荤菜',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-4',
          name: '红烧牛腩',
          desc: '牛腩酥烂，酱汁浓郁',
          category: '荤菜',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-5',
          name: '皮蛋瘦肉粥',
          desc: '口感绵软，暖胃爽滑',
          category: '粥类',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-6',
          name: '红枣桂圆粥',
          desc: '甜润滋补，养胃暖身',
          category: '粥类',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-7',
          name: '冰镇绿茶',
          desc: '清爽解渴，香气宜人',
          category: '饮品',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-8',
          name: '鲜榨橙汁',
          desc: '清甜酸爽，活力十足',
          category: '饮品',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-9',
          name: '西红柿鸡蛋汤',
          desc: '酸甜开胃，营养丰富',
          category: '汤类',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-10',
          name: '紫菜蛋花汤',
          desc: '鲜香滑嫩，轻盈暖心',
          category: '汤类',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-11',
          name: '鲜肉包子',
          desc: '皮薄多汁，鲜香饱满',
          category: '主食',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-12',
          name: '白馒头',
          desc: '松软绵密，家庭常见主食',
          category: '主食',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-13',
          name: '米饭',
          desc: '颗粒饱满，搭配任意菜品',
          category: '主食',
          img: '/static/logo.png',
          isDelete: false
        },
        {
          _id: 'demo-14',
          name: '香煎大饼',
          desc: '外脆里软，香气扑鼻',
          category: '主食',
          img: '/static/logo.png',
          isDelete: false
        }
      ],
      displayedFoods: [],
      cartList: [],
      cartTotalNum: 0,
      activeCategory: '所有'
    }
  },
  onLoad() {
    const openid = uni.getStorageSync('openid')
    this.adminOpenid = 'opDMSxk5VfRYJVyqjmuH3eoCLL-A'
    if (openid === this.adminOpenid) this.isAdmin = true

    this.applyFilter()
    this.getCartStorage()
  },
  onShow() {
    this.getCartStorage()
  },
  methods: {
    async getFoodList() {
      // 现在直接使用前端内置示例菜品，不再调用云端数据库。
      this.applyFilter()
    },
    applyFilter() {
      if (!this.activeCategory || this.activeCategory === '所有') {
        this.displayedFoods = this.foodList
      } else {
        this.displayedFoods = this.foodList.filter(f => f.category === this.activeCategory)
      }
    },
    filterAll() {
      this.activeCategory = '所有'
      this.applyFilter()
    },
    filterCategory(c) {
      this.activeCategory = c
      this.applyFilter()
    },
    addCartById(id) {
      const index = this.foodList.findIndex(f => f._id === id)
      if (index === -1) return
      const food = this.foodList[index]
      if (food.isDelete) {
        uni.showToast({ title: '该菜已下架', icon: 'none' })
        return
      }
      let existIndex = this.cartList.findIndex(item => item._id === food._id)
      if (existIndex > -1) {
        this.cartList[existIndex].num += 1
      } else {
        this.cartList.push({ _id: food._id, name: food.name, img: food.img, num: 1 })
      }
      uni.setStorageSync('cartList', this.cartList)
      this.calcCart()
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    calcCart() {
      let num = 0
      this.cartList.forEach(item => { num += item.num })
      this.cartTotalNum = num
    },
    getCartStorage() {
      let cart = uni.getStorageSync('cartList') || []
      this.cartList = cart
      this.calcCart()
    },
    goCart() { uni.navigateTo({ url: '/pages/cart/cart' }) },
    goProfile() { uni.navigateTo({ url: '/pages/profile/profile' }) },
    goAdmin() { uni.navigateTo({ url: '/pages/admin/admin' }) }
  }
}
</script>

<style>
.container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 110px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 12px;
}
.logo {
  font-weight: bold;
  margin-bottom: 12px;
}
.nav-btn {
  margin-bottom: 8px;
}
.bottom-btn {
  margin-top: 8px;
  background: #f5f5f5;
}
.main {
  flex: 1;
  padding: 12px;
  overflow: auto;
  background: #f7f7f7;
}
.food-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.card {
  width: calc((100% - 48px) / 3);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.food-image {
  width: 100%;
  height: 140px;
}
.card-body {
  padding: 8px;
}
.name {
  font-weight: bold;
}
.desc {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
@media (max-width: 600px) {
  .card { width: calc((100% - 24px) / 2); }
}
</style>