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
import { getStoredFoodList, saveFoodList } from '../../common/food-data.js'

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
    loadFoods() {
      this.foodList = getStoredFoodList()
    },
    addFood() {
      if (!this.foodName || !this.foodDesc) {
        uni.showToast({ title: '请完整填写菜品信息', icon: 'none' })
        return
      }

      const newFood = {
        _id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: this.foodName,
        desc: this.foodDesc,
        category: '素菜',
        img: this.foodImg || 'https://via.placeholder.com/200',
        isDelete: false
      }
      this.foodList.unshift(newFood)
      saveFoodList(this.foodList)

      this.foodName = ''
      this.foodDesc = ''
      this.foodImg = ''
      uni.showToast({ title: '菜品已上架', icon: 'success' })
      this.loadFoods()
    },
    toggleFood(item) {
      const index = this.foodList.findIndex(food => food._id === item._id)
      if (index === -1) return

      this.foodList[index].isDelete = !this.foodList[index].isDelete
      saveFoodList(this.foodList)
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
