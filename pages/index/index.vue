<template>
	<view class="page-wrap">
		<view class="top">
			<text>家庭点餐菜单</text>
		    <button v-if="isAdmin" @tap="goAdmin">订单/餐品管理</button>
	    </view>
		<view class="quick-actions">
			<button size="mini" @tap="goCart">购物车</button>
			<button size="mini" @tap="goProfile">个人主页</button>
		</view>
	    <view class="food-list">
		    <view v-for="(item,index) in foodList" :key="index" class="food-item">
			    <image :src="item.img" mode="aspectFill"></image>
			    <view class="food-info">
				    <text> {{ item.name}}</text>
				    <text>备注：{{ item.desc}}</text>
			    </view>
			    <view class="food-btn">
				    <button @tap="addCart(index)">+加入购物车</button>
			    </view>
		    </view>
	    </view>
	    <view class="cart">
		    <text>已选菜品： {{ cartTotalNum}}件 </text>
		    <button @tap="goCart">去购物车</button>
	     </view>
		 <button style="margin:20rpx 0;background:#f44336;color:#fff;" @click="logout">退出登录</button>
	</view>
	
</template>

<script>
	export default {
	  data() {
	    return {
	      adminOpenid: "", // 不再硬编码code
	      isAdmin: false,
	      foodList: [],
	      cartList: [],
	      cartTotalNum: 0,
	      cartTotalPrice: 0
	    }
	  },
	  onLoad() {
	    // 1. 获取本地存储的真实openid
	    const openid = uni.getStorageSync("openid")
	    // 先加载菜品，不要一进来就强制跳转，避免闪退
	    this.getFoodList()
	    this.getCartStorage()
	
	    // 没有openid再跳转登录（延后执行，页面先渲染）
	    /*if (!openid) {
	      setTimeout(() => {
	        uni.reLaunch({ url: "/pages/login/login" })
	      }, 800)
	      return
	    }
		*/
	
	    // ========== 这里填你云函数打印出来的 o开头真实openid ==========
	    this.adminOpenid = "opDMSxk5VfRYJVyqjmuH3eoCLL-A"
	    if (openid === this.adminOpenid) {
	      this.isAdmin = true
	    }
	  },
	  onShow() {
	    this.getCartStorage()
	  },
	  methods: {
	    async getFoodList() {
	      const db = uniCloud.database()
	      let res = await db.collection("foods").get()
	      this.foodList = res.data
	    },
	    addCart(index) {
	      let food = this.foodList[index]
	      let existIndex = this.cartList.findIndex(item => item._id === food._id)
	      if (existIndex > -1) {
	        this.cartList[existIndex].num += 1
	      } else {
	        this.cartList.push({
	          _id: food._id,
	          name: food.name,
	          price: food.price,
	          img: food.img,
	          num: 1
	        })
	      }
	      uni.setStorageSync("cartList", this.cartList)
	      this.calcCart()
	    },
	    calcCart() {
	      let num = 0
	      let price = 0
	      this.cartList.forEach(item => {
	        num += item.num
	        price += item.num * item.price
	      })
	      this.cartTotalNum = num
	      this.cartTotalPrice = price
	    },
	    getCartStorage() {
	      let cart = uni.getStorageSync("cartList") || []
	      this.cartList = cart
	      this.calcCart()
	    },
	    goCart() {
	      uni.navigateTo({
	        url: "/pages/cart/cart"
	      })
	    },
	    goProfile() {
	      uni.navigateTo({
	        url: "/pages/profile/profile"
	      })
	    },
	    goAdmin() {
	      uni.navigateTo({
	        url: "/pages/admin/admin"
	      })
	    },
		logout() {
		      // 删除本地登录凭证openid
		      uni.removeStorageSync("openid")
		      // 强制重启页面跳回登录页
		      uni.reLaunch({
		        url: "/pages/login/login"
		      })
		    }
	  }
	}
</script>

<style>
.page-wrap {
  padding: 16px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.food-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.food-item {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
}
</style>