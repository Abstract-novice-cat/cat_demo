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
      <view class="banner-wrap">
        <swiper class="banner" indicator-dots autoplay circular>
          <swiper-item>
            <image src="/static/003.png" mode="aspectFill" class="banner-image"></image>
          </swiper-item>
          <swiper-item>
            <image src="/static/004.png" mode="aspectFill" class="banner-image"></image>
          </swiper-item>
        </swiper>
      </view>

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
import { getStoredFoodList, ensureFoodListStorage } from '../../common/food-data.js'

export default {
  data() {
    return {
      adminOpenid: '',
      isAdmin: false,
      foodList: [],
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

    ensureFoodListStorage()
    this.loadFoods()
    this.getCartStorage()
  },
  onShow() {
    this.loadFoods()
    this.getCartStorage()
  },
  methods: {
    loadFoods() {
      this.foodList = getStoredFoodList()
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
.banner-wrap {
  margin-bottom: 16px;
}
.banner {
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
}
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sidebar {
  width: 140px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  gap: 8px;
}
.logo {
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  padding: 12px 0;
  margin-bottom: 8px;
  color: #ff6b35;
  border-bottom: 1px solid #f0f0f0;
}
.nav-btn {
  margin: 0;
  height: 44px;
  line-height: 44px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  color: #333;
  padding: 0 12px;
  text-align: left;
}
.nav-btn::after {
  border: none;
}
.nav-btn:active {
  background: #fff5f0;
  color: #ff6b35;
}
.bottom-btn {
  margin: 0;
  margin-top: 8px;
  height: 44px;
  line-height: 44px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  font-size: 14px;
  padding: 0 12px;
  text-align: left;
}
.bottom-btn::after {
  border: none;
}
.bottom-btn:active {
  background: #ff6b35;
  color: #fff;
}
.main {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: #f7f7f7;
}
.food-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: stretch;
}
.card {
  flex: 1 1 calc((100% - 48px) / 3);
  min-width: 180px;
  max-width: calc((100% - 48px) / 3);
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease;
}
.card:active {
  transform: translateY(-2px);
}
.food-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}
.card-body {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.name {
  font-weight: 600;
  font-size: 15px;
  color: #222;
}
.desc {
  color: #666;
  font-size: 13px;
  margin-top: 6px;
  line-height: 1.4;
  flex: 1;
}
.meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;
}
.meta button {
  background: #ff6b35;
  color: #fff;
  border: none;
  border-radius: 20px;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  font-size: 13px;
  margin: 0;
}
.meta button::after {
  border: none;
}
.meta button[disabled] {
  background: #ccc;
  color: #fff;
}
@media (max-width: 900px) {
  .card {
    flex: 1 1 calc((100% - 24px) / 2);
    max-width: calc((100% - 24px) / 2);
    min-width: 160px;
  }
  .sidebar {
    width: 120px;
    padding: 12px 8px;
  }
  .nav-btn, .bottom-btn {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    padding: 0 8px;
  }
}
@media (max-width: 600px) {
  .card {
    flex: 1 1 100%;
    max-width: 100%;
    min-width: 0;
  }
  .sidebar {
    width: 100px;
  }
  .logo {
    font-size: 16px;
    padding: 8px 0;
  }
}
</style>