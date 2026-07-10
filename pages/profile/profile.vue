<template>
  <view class="page-wrap">
    <view class="header">
      <text class="title">个人主页</text>
      <button size="mini" plain @click="goBack">返回</button>
    </view>

    <view class="card">
      <view class="avatar">U</view>
      <view class="info">
        <text class="name">家庭成员</text>
        <text class="desc">查看历史订单和个人信息</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">个人信息</text>
      <view class="info-row">
        <text>用户ID</text>
        <text>{{ openid || '未登录' }}</text>
      </view>
      <view class="info-row">
        <text>状态</text>
        <text>{{ isAdmin ? '管理员' : '普通用户' }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">历史订单</text>
      <view v-if="history.length === 0" class="empty">暂无历史订单</view>
      <view v-else>
        <view v-for="order in history" :key="order.id" class="order-item">
          <view class="order-top">
            <text class="order-time">{{ order.createdAt }}</text>
            <text class="order-id">#{{ order.id }}</text>
          </view>
          <view v-for="(item, idx) in order.items" :key="idx" class="order-detail">
            <text>{{ item.name }} × {{ item.num }}</text>
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
      openid: '',
      isAdmin: false,
      history: []
    }
  },
  onLoad() {
    this.openid = uni.getStorageSync('openid') || ''
    this.isAdmin = this.openid === 'opDMSxk5VfRYJVyqjmuH3eoCLL-A'
    this.history = uni.getStorageSync('orderHistory') || []
  },
  methods: {
    goBack() {
      uni.navigateBack()
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
  margin-bottom: 16px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background: #f44336;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.info {
  display: flex;
  flex-direction: column;
}
.name {
  font-weight: bold;
}
.desc {
  color: #666;
  font-size: 12px;
  margin-top: 2px;
}
.section {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}
.section-title {
  display: block;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: #444;
}
.empty {
  color: #999;
  text-align: center;
  padding: 10px 0;
}
.order-item {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 8px;
}
.order-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.order-time {
  color: #666;
  font-size: 12px;
}
.order-id {
  color: #f44336;
  font-size: 12px;
}
.order-detail {
  padding: 2px 0;
  color: #444;
}
</style>
