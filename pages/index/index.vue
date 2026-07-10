<template>
  <view class="container">
    <view class="sidebar">
      <view class="logo">点餐</view>
      <button class="nav-btn" @tap="goAdmin" v-if="isAdmin">管理</button>
      <button class="nav-btn" @tap="filterAll">所有菜品</button>
      <button class="nav-btn" @tap="filterCategory('热菜')">热菜</button>
      <button class="nav-btn" @tap="filterCategory('凉菜')">凉菜</button>
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
              <text class="price">¥{{ item.price }}</text>
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
      foodList: [],
      displayedFoods: [],
      cartList: [],
      cartTotalNum: 0,
      cartTotalPrice: 0,
      activeCategory: '所有'
    }
  },
  onLoad() {
    const openid = uni.getStorageSync('openid')
    this.adminOpenid = 'opDMSxk5VfRYJVyqjmuH3eoCLL-A'
    if (openid === this.adminOpenid) this.isAdmin = true

    this.getFoodList()
    this.getCartStorage()
  },
  onShow() {
    this.getCartStorage()
  },
  methods: {
    async getFoodList() {
      const db = uniCloud.database()
      let res = await db.collection('foods').orderBy('createTime', 'desc').get()
      this.foodList = res.data || []
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
        this.cartList.push({ _id: food._id, name: food.name, price: food.price, img: food.img, num: 1 })
      }
      uni.setStorageSync('cartList', this.cartList)
      this.calcCart()
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    calcCart() {
      let num = 0
      let price = 0
      this.cartList.forEach(item => { num += item.num; price += item.num * item.price })
      this.cartTotalNum = num
      this.cartTotalPrice = price
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
.price {
  color: #f44336;
}
@media (max-width: 600px) {
  .card { width: calc((100% - 24px) / 2); }
}
</style>