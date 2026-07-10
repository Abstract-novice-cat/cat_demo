<template>
  <view>
    <button @click="wxLogin">微信一键登录</button>
  </view>
</template>

<script>
export default {
  onLoad() {
    const openid = uni.getStorageSync('openid')
    if (openid) {
      // 已登录则直接跳转到首页，避免已登录用户看到登录页
      uni.reLaunch({ url: '/pages/index/index' })
    }
  },
  methods: {
    // 必须加 async
    async wxLogin() {
      try {
        // 1. 获取微信登录 code
        const loginRes = await uni.login({
          provider: 'weixin'
        })
        const code = loginRes.code
        console.log('前端拿到登录code：', code)
    
        // 2. 调用 uniCloud 云函数（核心：不走 wx.cloud，走 uniCloud 阿里云通道）
        const cloudRes = await uniCloud.callFunction({
          name: 'getUserOpenid',
          data: { code: code }
        })
    
        // 3. 处理返回结果
        if (cloudRes.result.success) {
          const openid = cloudRes.result.openid
          console.log('当前用户openid：', openid)
          uni.setStorageSync('openid', openid)
          uni.reLaunch({ url: '/pages/index/index' })
        } else {
          console.log('获取openid失败：', cloudRes.result.msg)
          uni.showToast({ title: '登录失败', icon: 'none' })
        }
      } catch (err) {
        console.log('登录流程报错：', err)
        uni.showToast({ title: '登录异常', icon: 'none' })
      }
    }
  }
}
</script>