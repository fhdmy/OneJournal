//index.js
const app = getApp()

Page({
  data: {
    login: false,
    loading: false,
    userType: "none",
    classes: [
    ],
    searchContent:"",
    displayClasses:[]
  },
  onLoad: function () {
    let _this = this;
    if (wx.getStorageSync("openId")) {
      wx.cloud.callFunction({
        name: 'getInform',
        data: {
          nickName: "",
          avatar: ""
        },
        success: (res) => {
          if (app.globalData.userType != res.result.data[0].userType) {
            _this.setData({
              userType: res.result.data[0].userType
            })
            app.globalData.userType = res.result.data[0].userType;
            wx.setStorageSync("userType", res.result.data[0].userType);
          }
          else {
            _this.setData({
              userType: app.globalData.userType
            })
          }
          if (_this.data.userType != 'none') {
            _this.setData({
              login: true,
            })
            app.globalData.login = true;
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '网络传输故障',
            image: '/images/about.png'
          })
        }
      });
    }
  },
  onShow: function () {
    let _this = this;
    wx.cloud.callFunction({
      name: 'getGoods',
      data: {
        dataBase: 'cladding'
      },
      success: (res) => {
        let len=_this.data.classes.length;
        let n=0;
        for (let i = 0; i < res.result.data.length; i++) {
          _this.data.classes[i] = {
            classes: res.result.data[i].classes,
            remain: res.result.data[i].sum,
            claddingUid: res.result.data[i]._id,
          }
          n++;
        }
        _this.setData({
          displayClasses: _this.data.classes
        })
        if(n<len){
          let temp = _this.data.classes;
          temp.splice(n,len-n);
          _this.data.classes=temp;
          _this.setData({
            displayClasses:temp
          })
        }
        this.sortClasses();
        // this.dosearch();
      },
      fail: (res) => {
        wx.showToast({
          title: '网络传输故障',
          image: '/images/about.png'
        })
      }
    });
  },
  onGotUserInfo: function (e) {
    let _this = this;
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      return;
    }
    let avatar = e.detail.userInfo.avatarUrl;
    let nickName = e.detail.userInfo.nickName;
    _this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'getInform',
      data: {
        nickName: nickName,
        avatar: avatar
      },
      success: (res) => {
        app.globalData.openId = res.result.data[0].openId;
        app.globalData.userType = res.result.data[0].userType;
        app.globalData.uid = res.result.data[0]._id;
        app.globalData.avatar = avatar;
        app.globalData.nickName = nickName;
        wx.setStorageSync("openId", res.result.data[0].openId);
        wx.setStorageSync("userType", res.result.data[0].userType);
        wx.setStorageSync("uid", res.result.data[0]._id);
        wx.setStorageSync("avatar", avatar);
        wx.setStorageSync("nickName", nickName);
        if (res.result.data[0].userType == 'none') {
          _this.setData({
            loading: false,
            userType: 'none'
          })
          wx.showToast({
            title: '无访问权限',
            image: '/images/about.png'
          })
        }
        else {
          app.globalData.login = true;
          _this.setData({
            login: true,
            loading: false,
            userType: res.result.data[0].userType
          })
        }
      },
      fail: (res) => {
        _this.setData({
          loading: false
        })
        wx.showToast({
          title: '网络传输故障',
          image: '/images/about.png'
        })
      }
    });
  },
  addClasses: function () {
    if (this.data.userType != 'admin' && this.data.userType!='claddingAdmin') {
      wx.showToast({
        title: '无访问权限',
        image: '/images/about.png'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?id=-1&db=cladding&classes=&sum=&use=&date=&classUid=&remark=',
    })
  },
  editRemain: function (e) {
    let id = e.target.id;
    if (this.data.userType != 'admin' && this.data.userType != 'editor' && this.data.userType!='claddingAdmin' && this.data.userType!='comptAdmin') {
      wx.showToast({
        title: '无访问权限',
        image: '/images/about.png'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + this.data.displayClasses[id].claddingUid + '&db=cladding&classes=' + this.data.displayClasses[id].classes + '&sum=' + this.data.displayClasses[id].remain + "&use=&date=&classUid=&remark=",
    })
  },
  openHistory: function () {
    wx.navigateTo({
      url: '/pages/history/history?db=cladding',
    })
  },
  confirmLogout: function () {
    let _this = this;
    wx.showModal({
      title: '注销',
      content: '你确定要注销吗',
      confirmColor: "#626B4C",
      success: (res) => {
        if (res.confirm) {
          _this.setData({
            login: false,
            userType: 'none'
          })
          app.globalData.openId = "";
          app.globalData.userType = "none";
          app.globalData.uid = "";
          app.globalData.avatar = "";
          app.globalData.nickName = "";
          app.globalData.login = false;
          wx.clearStorageSync();
        }
      }
    })
  },
  changePermission: function () {
    wx.navigateTo({
      url: '/pages/permission/permission',
    })
  },
  searchChange:function(e){
    let content=e.detail.value;
    this.setData({
      searchContent:content
    })
    this.dosearch();
    this.sortClasses();
  },
  clearSearch:function(){
    this.setData({
      searchContent:""
    })
    this.dosearch();
    this.sortClasses();
  },
  dosearch: function () {
    let sc = this.data.searchContent;
    let k = 0;
    for (let i = 0; i < this.data.classes.length; i++) {
      if (this.data.classes[i].classes.search(sc) != -1) {
        console.log("i: "+i)
        console.log(this.data.classes[i]);
        let dc = "displayClasses[" + k + "]";
        this.setData({
          [dc]: this.data.classes[i]
        })
        k++;
      }
    }
    if (k < this.data.displayClasses.length) {
      let temp=[];
      for (let j = 0; j < this.data.displayClasses.length;j++){
        temp[j] = this.data.displayClasses[j]
      }
      temp.splice(k, this.data.displayClasses.length - k);
      this.setData({
        displayClasses: temp
      })
    }
  },
  sortClasses:function(){
    let temp=this.data.displayClasses;
    let finish = true;
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp.length - i - 1; j++) {
        if (temp[j].classes.localeCompare(temp[j+1].classes)>0) {
          let t = temp[j];
          temp[j] = temp[j + 1];
          temp[j + 1] = t;
          finish = false;
        }
      }
      if (finish)
        break;
    }
    this.setData({
      displayClasses:temp
    })
  }
})
