//app.js
App({
  onLaunch: function () {
    let _this = this;
    wx.cloud.init({
      traceUser: true
    })
    if (wx.getStorageSync("openId")) {
      _this.globalData.openId = wx.getStorageSync("openId");
      _this.globalData.userType = wx.getStorageSync("userType");
      _this.globalData.uid = wx.getStorageSync("uid");
      _this.globalData.avatar = wx.getStorageSync("avatar");
      _this.globalData.nickName = wx.getStorageSync("nickName");
    }
  },
  globalData: {
    nickName: "",
    avatar: "",
    openId: "",
    userType: "none",
    uid: "",
    login: false
  },
})
