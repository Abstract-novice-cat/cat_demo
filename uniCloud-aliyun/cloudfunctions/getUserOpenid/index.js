exports.main = async (event) => {
  const https = require('https')
  const { code } = event

  // 从环境变量读取小程序凭证，确保不要将真实凭证提交到仓库
  const APPID = process.env.WX_APPID
  const APP_SECRET = process.env.WX_APP_SECRET

  // 如未配置环境变量，则返回错误，避免在代码中保留明文凭证
  if (!APPID || !APP_SECRET) {
    return { success: false, msg: '服务器未配置微信 APPID 或 APP_SECRET，请在环境变量中设置 WX_APPID 和 WX_APP_SECRET' }
  }

  return new Promise((resolve) => {
    // 直接调用微信官方登录凭证校验接口
    const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`

    https.get(requestUrl, (res) => {
      let responseData = ''
      // 拼接响应数据流
      res.on('data', (chunk) => {
        responseData += chunk
      })
      // 响应接收完成
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData)
          if (result.openid) {
            resolve({
              success: true,
              openid: result.openid,
              sessionKey: result.session_key
            })
          } else {
            resolve({
              success: false,
              msg: result.errmsg || '获取openid失败'
            })
          }
        } catch (parseErr) {
          resolve({
            success: false,
            msg: '接口响应解析失败'
          })
        }
      })
    }).on('error', (requestErr) => {
      resolve({
        success: false,
        msg: '网络请求失败：' + requestErr.message
      })
    })
  })
}