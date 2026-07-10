<template>
  <view class="page-wrap">
    <view class="header">
      <text class="title">购物车</text>
      <button size="mini" plain @click="goBack">返回</button>
    </view>

    <view v-if="cartList.length === 0" class="empty">
      <text>购物车里还没有商品</text>
      <button class="primary-btn" @click="goHome">去挑选菜品</button>
    </view>

    <view v-else class="cart-list">
      <view v-for="(item, index) in cartList" :key="item._id || index" class="cart-item">
        <view class="item-main">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-count">数量：{{ item.num }}</text>
        </view>
        <button size="mini" type="warn" @click="removeItem(index)">移除</button>
      </view>
    </view>

    <view v-if="cartList.length > 0" class="action-bar">
      <button class="secondary-btn" @click="clearCart">清空购物车</button>
      <button class="primary-btn" @click="submitOrder">生成订单</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartList: []
    }
  },
  onLoad() {
    this.loadCart()
  },
  methods: {
    loadCart() {
      this.cartList = uni.getStorageSync('cartList') || []
    },
    removeItem(index) {
      this.cartList.splice(index, 1)
      uni.setStorageSync('cartList', this.cartList)
      this.loadCart()
    },
    clearCart() {
      this.cartList = []
      uni.setStorageSync('cartList', this.cartList)
      uni.showToast({ title: '购物车已清空', icon: 'success' })
    },
    submitOrder() {
      if (!this.cartList.length) {
        uni.showToast({ title: '请选择至少一件商品', icon: 'none' })
        return
      }

      const history = uni.getStorageSync('orderHistory') || []
      const order = {
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
        items: this.cartList.map(item => ({
          name: item.name,
          num: item.num
        }))
      }

      history.unshift(order)
      uni.setStorageSync('orderHistory', history.slice(0, 20))
      uni.setStorageSync('cartList', [])
      this.cartList = []
      uni.showToast({ title: '订单已生成', icon: 'success' })
    },
    goBack() {
      uni.navigateBack()
    },
    goHome() {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>

<style>
.page-wrap {
  padding: 20px;
  background: #f7f7f7;
  min-height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.empty {
  background: #fff;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
}
.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cart-item {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-main {
  display: flex;
  flex-direction: column;
}
.item-name {
  font-size: 15px;
  font-weight: 600;
}
.item-count {
  color: #666;
  margin-top: 4px;
}
.action-bar {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.primary-btn {
  background: #f44336;
  color: #fff;
}
.secondary-btn {
  background: #eee;
  color: #333;
}
</style>
