<template>
  <view class="page-wrap">
    <view class="header">
      <text class="title">个人主页</text>
      <button size="mini" plain @click="goBack">返回</button>
    </view>

    <!-- 用户头部卡片 -->
    <view class="user-card">
      <view class="avatar" @click="changeAvatar">
        <image v-if="avatarUrl" :src="avatarUrl" class="avatar-img" mode="aspectFill"></image>
        <text v-else class="avatar-text">{{ nickname.charAt(0) }}</text>
      </view>
      <view class="user-info">
        <view class="name-row">
          <text class="nickname">{{ nickname }}</text>
          <text v-if="isAdmin" class="admin-tag">管理员</text>
        </view>
        <text class="phone">{{ phone }}</text>
        <text class="user-id">ID: {{ openidShort }}</text>
      </view>
      <button class="edit-btn" size="mini" @click="editProfile">编辑资料</button>
    </view>

    <!-- 数据统计栏 -->
    <view class="stats-bar">
      <view class="stat-item" @click="goOrders('all')">
        <text class="stat-num">{{ stats.orders }}</text>
        <text class="stat-label">累计订单</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @click="goFavorites">
        <text class="stat-num">{{ stats.favorites }}</text>
        <text class="stat-label">我的收藏</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @click="goCoupons">
        <text class="stat-num">{{ stats.coupons }}</text>
        <text class="stat-label">优惠券</text>
      </view>
    </view>

    <!-- 订单快捷入口 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <text class="section-more" @click="goOrders('all')">全部订单 ></text>
      </view>
      <view class="order-entries">
        <view class="order-entry" @click="goOrders('all')">
          <view class="entry-icon">📦</view>
          <text class="entry-text">全部订单</text>
        </view>
        <view class="order-entry" @click="goOrders('pending')">
          <view class="entry-icon">💳</view>
          <text class="entry-text">待付款</text>
          <view v-if="pendingCount > 0" class="entry-badge">{{ pendingCount }}</view>
        </view>
        <view class="order-entry" @click="goOrders('shipping')">
          <view class="entry-icon">🚚</view>
          <text class="entry-text">待配送</text>
          <view v-if="shippingCount > 0" class="entry-badge">{{ shippingCount }}</view>
        </view>
        <view class="order-entry" @click="goOrders('completed')">
          <view class="entry-icon">✅</view>
          <text class="entry-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 历史订单展示 -->
    <view class="section">
      <text class="section-title">历史订单</text>
      <view v-if="history.length === 0" class="empty">暂无历史订单</view>
      <view v-else>
        <view v-for="order in history" :key="order.id" class="order-item">
          <view class="order-top">
            <text class="order-time">{{ order.createdAt }}</text>
            <view class="order-status" :class="'status-' + order.status">
              {{ statusText[order.status] }}
            </view>
          </view>
          <view class="order-id-row">
            <text class="order-id-text">订单号：#{{ order.id }}</text>
          </view>
          <view v-for="(item, idx) in order.items" :key="idx" class="order-detail">
            <text>{{ item.name }} × {{ item.num }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
          <view class="order-bottom">
            <text class="order-total">
              合计：<text class="total-price">¥{{ order.total }}</text>
            </text>
            <button v-if="order.status === 'pending'" class="pay-btn" size="mini" @click="payOrder(order.id)">去付款</button>
            <button v-else-if="order.status === 'completed'" class="again-btn" size="mini" @click="reorder(order.id)">再来一单</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单区 -->
    <view class="section menu-section">
      <view class="menu-item" @click="goFavorites">
        <text class="menu-icon">❤️</text>
        <text class="menu-label">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goAddress">
        <text class="menu-icon">📍</text>
        <text class="menu-label">收货地址</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-label">账号设置</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goHelp">
        <text class="menu-icon">❓</text>
        <text class="menu-label">帮助中心</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="logout-btn" @click="logout">退出登录</button>

  </view>
</template>

<script>
export default {
  data() {
    return {
      openid: '',
      isAdmin: false,
      history: [],
      avatarUrl: '',
      nickname: '美食用户',
      phone: '138****8888',
      stats: {
        orders: 0,
        favorites: 8,
        coupons: 3
      },
      statusText: {
        pending: '待付款',
        shipping: '待配送',
        completed: '已完成',
        cancelled: '已取消'
      },
      pendingCount: 0,
      shippingCount: 0
    }
  },
  computed: {
    openidShort() {
      if (!this.openid) return '未登录'
      return this.openid.substring(0, 8) + '...'
    }
  },
  onLoad() {
    this.openid = uni.getStorageSync('openid') || ''
    this.isAdmin = this.openid === 'opDMSxk5VfRYJVyqjmuH3eoCLL-A'
    this.history = uni.getStorageSync('orderHistory') || this.getMockHistory()
    // 从本地存储读取用户信息
    const savedProfile = uni.getStorageSync('userProfile')
    if (savedProfile) {
      this.nickname = savedProfile.nickname || '美食用户'
      this.avatarUrl = savedProfile.avatarUrl || ''
      this.phone = savedProfile.phone || '138****8888'
    }
    this.calcStats()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    // 模拟历史订单数据
    getMockHistory() {
      return [
        {
          id: '202407110001',
          createdAt: '2024-07-11 12:30',
          status: 'completed',
          total: 42,
          items: [
            { name: '麻婆豆腐', num: 1, price: 18 },
            { name: '米饭', num: 2, price: 6 }
          ]
        },
        {
          id: '202407100002',
          createdAt: '2024-07-10 18:45',
          status: 'shipping',
          total: 38,
          items: [
            { name: '糖醋排骨', num: 1, price: 38 }
          ]
        },
        {
          id: '202407090003',
          createdAt: '2024-07-09 19:20',
          status: 'pending',
          total: 56,
          items: [
            { name: '可乐鸡翅', num: 1, price: 32 },
            { name: '鲜肉包子', num: 2, price: 24 }
          ]
        }
      ]
    },
    calcStats() {
      this.stats.orders = this.history.length
      this.pendingCount = this.history.filter(o => o.status === 'pending').length
      this.shippingCount = this.history.filter(o => o.status === 'shipping').length
    },
    changeAvatar() {
      uni.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        success: (res) => {
          // 模拟更换头像
          const colors = ['#ff6b35', '#ff8c5a', '#ffa07a', '#ff7f50', '#ff6347']
          const randomColor = colors[Math.floor(Math.random() * colors.length)]
          this.avatarUrl = ''
          // 用颜色模拟头像变化（实际项目中走图片选择 API）
          uni.showToast({ title: '头像更换成功', icon: 'success' })
          this.saveProfile()
        }
      })
    },
    editProfile() {
      uni.showToast({ title: '编辑资料功能开发中', icon: 'none' })
    },
    saveProfile() {
      uni.setStorageSync('userProfile', {
        nickname: this.nickname,
        avatarUrl: this.avatarUrl,
        phone: this.phone
      })
    },
    goOrders(type) {
      uni.showToast({ title: `查看${type === 'all' ? '全部' : type === 'pending' ? '待付款' : type === 'shipping' ? '待配送' : '已完成'}订单`, icon: 'none' })
    },
    goFavorites() {
      uni.showToast({ title: '我的收藏', icon: 'none' })
    },
    goCoupons() {
      uni.showToast({ title: '我的优惠券', icon: 'none' })
    },
    goAddress() {
      uni.showToast({ title: '收货地址', icon: 'none' })
    },
    goSettings() {
      uni.showToast({ title: '账号设置', icon: 'none' })
    },
    goHelp() {
      uni.showToast({ title: '帮助中心', icon: 'none' })
    },
    payOrder(orderId) {
      const idx = this.history.findIndex(o => o.id === orderId)
      if (idx > -1) {
        this.history[idx].status = 'shipping'
        uni.setStorageSync('orderHistory', this.history)
        this.calcStats()
        uni.showToast({ title: '支付成功', icon: 'success' })
      }
    },
    reorder(orderId) {
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('openid')
            uni.showToast({ title: '已退出登录', icon: 'success' })
            setTimeout(() => {
              uni.navigateBack()
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style>
.page-wrap {
  padding: 20rpx;
  background: #f7f7f7;
  min-height: 100vh;
  box-sizing: border-box;
}

/* ===== 顶部栏 ===== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 10rpx 0;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #222;
}
.header button {
  font-size: 24rpx;
  border-color: #ff6b35;
  color: #ff6b35;
  border-radius: 30rpx;
  padding: 0 20rpx;
  line-height: 48rpx;
  height: 48rpx;
}

/* ===== 用户头部卡片 ===== */
.user-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  position: relative;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: linear-gradient(135deg, #ff6b35, #ff8c5a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  font-weight: bold;
  flex-shrink: 0;
  overflow: hidden;
}
.avatar-img {
  width: 100%;
  height: 100%;
}
.avatar-text {
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
}
.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.nickname {
  font-size: 32rpx;
  font-weight: bold;
  color: #222;
}
.admin-tag {
  font-size: 20rpx;
  color: #ff6b35;
  background: #fff2ed;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
}
.phone {
  font-size: 24rpx;
  color: #666;
}
.user-id {
  font-size: 22rpx;
  color: #999;
}
.edit-btn {
  font-size: 24rpx;
  background: #fff2ed;
  color: #ff6b35;
  border: none;
  border-radius: 30rpx;
  padding: 0 20rpx;
  line-height: 52rpx;
  height: 52rpx;
  flex-shrink: 0;
}
.edit-btn::after {
  border: none;
}

/* ===== 数据统计栏 ===== */
.stats-bar {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 0;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.stat-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff6b35;
}
.stat-label {
  font-size: 24rpx;
  color: #666;
}
.stat-divider {
  width: 1px;
  height: 60rpx;
  background: #eee;
}

/* ===== 通用 section ===== */
.section {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 16rpx;
}
.section-header .section-title {
  margin-bottom: 0;
}
.section-more {
  font-size: 24rpx;
  color: #999;
}

/* ===== 订单快捷入口 ===== */
.order-entries {
  display: flex;
  justify-content: space-around;
  padding-top: 12rpx;
}
.order-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  position: relative;
  flex: 1;
}
.entry-icon {
  font-size: 44rpx;
  line-height: 1;
}
.entry-text {
  font-size: 24rpx;
  color: #333;
}
.entry-badge {
  position: absolute;
  top: -8rpx;
  right: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  padding: 0 8rpx;
  background: #ff6b35;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  text-align: center;
  box-sizing: border-box;
}

/* ===== 历史订单 ===== */
.empty {
  color: #999;
  text-align: center;
  padding: 40rpx 0;
  font-size: 26rpx;
}
.order-item {
  border-top: 1px solid #f0f0f0;
  padding-top: 20rpx;
  margin-top: 20rpx;
}
.order-item:first-child {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}
.order-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.order-time {
  color: #999;
  font-size: 24rpx;
}
.order-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.status-pending {
  color: #ff9500;
  background: #fff5e6;
}
.status-shipping {
  color: #ff6b35;
  background: #fff2ed;
}
.status-completed {
  color: #4cd964;
  background: #e8faec;
}
.status-cancelled {
  color: #999;
  background: #f5f5f5;
}
.order-id-row {
  margin-bottom: 10rpx;
}
.order-id-text {
  font-size: 22rpx;
  color: #999;
}
.order-detail {
  display: flex;
  justify-content: space-between;
  padding: 6rpx 0;
  color: #333;
  font-size: 26rpx;
}
.item-price {
  color: #666;
}
.order-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12rpx;
  padding-top: 12rpx;
  border-top: 1px dashed #f0f0f0;
}
.order-total {
  font-size: 26rpx;
  color: #333;
}
.total-price {
  color: #ff6b35;
  font-weight: bold;
  font-size: 30rpx;
}
.pay-btn {
  background: #ff6b35;
  color: #fff;
  border: none;
  border-radius: 30rpx;
  font-size: 24rpx;
  padding: 0 24rpx;
  line-height: 52rpx;
  height: 52rpx;
}
.pay-btn::after {
  border: none;
}
.again-btn {
  background: #fff;
  color: #ff6b35;
  border: 1px solid #ff6b35;
  border-radius: 30rpx;
  font-size: 24rpx;
  padding: 0 24rpx;
  line-height: 50rpx;
  height: 52rpx;
}
.again-btn::after {
  border: none;
}

/* ===== 功能菜单区 ===== */
.menu-section {
  padding: 0 24rpx;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 20rpx;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-icon {
  font-size: 36rpx;
  flex-shrink: 0;
}
.menu-label {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.menu-arrow {
  font-size: 36rpx;
  color: #ccc;
  line-height: 1;
}

/* ===== 退出登录 ===== */
.logout-btn {
  width: 100%;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
  background: #fff;
  color: #ff3b30;
  border: none;
  border-radius: 20rpx;
  font-size: 30rpx;
  line-height: 88rpx;
  height: 88rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.logout-btn::after {
  border: none;
}
</style>
