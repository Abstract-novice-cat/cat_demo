<template>
  <view class="page-wrap">
    <view class="header">
      <text class="title">管理员模块</text>
      <button size="mini" plain @click="goBack">返回</button>
    </view>

    <view class="card">
      <text>当前身份：{{ isAdmin ? '管理员' : '非管理员' }}</text>
      <text v-if="!isAdmin" class="hint">仅允许指定 openid 的账号进入菜品管理</text>
    </view>

    <view v-if="isAdmin" class="panel">
      <view class="form-row">
        <input v-model="foodName" placeholder="菜品名称" />
      </view>
      <view class="form-row">
        <input v-model="foodDesc" placeholder="菜品描述" />
      </view>
      <view class="form-row">
        <input v-model="foodImg" placeholder="图片链接" />
      </view>
      <button class="primary-btn" @click="addFood">上架菜品</button>
    </view>

    <view v-if="isAdmin" class="panel">
      <text class="section-title">当前菜品</text>
      <view v-if="foodList.length === 0" class="empty">暂无菜品</view>
      <view v-else>
        <view v-for="item in foodList" :key="item._id" class="food-item">
          <view class="food-main">
            <text class="food-name">{{ item.name }}</text>
            <text class="food-desc">{{ item.desc }}</text>
          </view>
          <button size="mini" :type="item.isDelete ? 'default' : 'warn'" @click="toggleFood(item)">
            {{ item.isDelete ? '恢复' : '下架' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false,
      foodName: '',
      foodDesc: '',
      foodImg: '',
      foodList: []
    }
  },
  onLoad() {
    const openid = uni.getStorageSync('openid') || ''
    this.isAdmin = openid === 'opDMSxk5VfRYJVyqjmuH3eoCLL-A'
    this.loadFoods()
  },
  methods: {
    async loadFoods() {
      const db = uniCloud.database()
      const res = await db.collection('foods').orderBy('createTime', 'desc').get()
      this.foodList = res.data || []
    },
    async addFood() {
      if (!this.foodName || !this.foodDesc) {
        uni.showToast({ title: '请完整填写菜品信息', icon: 'none' })
        return
      }

      const db = uniCloud.database()
      await db.collection('foods').add({
        name: this.foodName,
        desc: this.foodDesc,
        img: this.foodImg || 'https://via.placeholder.com/200',
        isDelete: false,
        createTime: Date.now()
      })

      this.foodName = ''
      this.foodDesc = ''
      this.foodImg = ''
      uni.showToast({ title: '菜品已上架', icon: 'success' })
      this.loadFoods()
    },
    async toggleFood(item) {
      const db = uniCloud.database()
      await db.collection('foods').doc(item._id).update({
        isDelete: !item.isDelete
      })
      uni.showToast({ title: item.isDelete ? '菜品已恢复' : '菜品已下架', icon: 'success' })
      this.loadFoods()
    },
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
.card, .panel {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}
.hint {
  display: block;
  color: #999;
  margin-top: 4px;
}
.form-row {
  margin-bottom: 10px;
}
.form-row input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 10px;
}
.primary-btn {
  background: #f44336;
  color: #fff;
}
.section-title {
  display: block;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}
.empty {
  color: #999;
  text-align: center;
  padding: 10px 0;
}
.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #eee;
}
.food-main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.food-name {
  font-weight: bold;
}
.food-desc {
  color: #666;
  font-size: 12px;
  margin-top: 2px;
}
</style>
