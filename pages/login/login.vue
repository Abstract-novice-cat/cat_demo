<template>
  <view style="padding:20px">
    <view style="margin-bottom:20px">
      <text>管理员登录（本地校验，非安全方式，仅用于开发/离线场景）</text>
    </view>
    <input type="password" v-model="password" placeholder="请输入管理员密码" />
    <view style="margin-top:16px; display:flex; gap:8px">
      <button @click="tryAdminLogin" type="primary">管理员登录</button>
      <button @click="enterAsGuest" type="default">游客进入点餐页面</button>
    </view>
    <view style="margin-top:12px;color:#888;font-size:12px">提示：管理员密码请在本地安全保存；该实现不会调用云函数。</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      password: ''
    }
  },
  onLoad() {
    const openid = uni.getStorageSync('openid')
    if (openid) {
      // 已登录则直接跳转到首页，避免已登录用户看到登录页
      uni.reLaunch({ url: '/pages/index/index' })
    }
  },
  methods: {
    tryAdminLogin() {
      // 本地管理员密码（请根据需要修改）。注意：将密码放在客户端存在泄露风险。
      const ADMIN_PASSWORD = 'admin123' // 可修改为你希望的本地管理员密码
      const ADMIN_OPENID = 'opDMSxk5VfRYJVyqjmuH3eoCLL-A' // 与 index 中用于判断管理员的 openid 保持一致

      if (!this.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
      }

      if (this.password === ADMIN_PASSWORD) {
        // 设置本地 openid 为管理员 id，后续 index 页面会识别并显示管理员入口
        uni.setStorageSync('openid', ADMIN_OPENID)
        uni.reLaunch({ url: '/pages/admin/admin' })
      } else {
        uni.showToast({ title: '密码错误，您没有管理员权限', icon: 'none' })
        this.password = ''
      }
    },
    enterAsGuest() {
      // 游客直接进入点餐页面，不写入 openid（或可写入特定 guest id）
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>