//index.js
const app = getApp()

Page({
  data: {
    deleteLoading: false,
    loading: false,
    id: 0,
    pageType: "",
    db: "",
    classes: "",
    tempClasses: "",
    sum: 0,
    use: 0,
    date: "2018-02-01",
    remark: "",
    tempRemark: "",
    useRange: [
      ['+', '-'],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      [0, 0.5]
    ],
    hiddenmodalput: true,
    borderColor: "rgb(36,220,255)",
    hiddenMP: true,
    userType: "editor",
    classUid: "",
    originUse: 0
  },
  onLoad: function (options) {
    let _this = this;
    let time = new Date();
    _this.setData({
      id: options.id,
      pageType: options.id == -1 ? 'addClasses' : 'editRemain',
      db: options.db,
      userType: app.globalData.userType,
      classes:options.classes==''?'品类':options.classes,
      sum: options.sum == '' ? 0 : parseFloat(options.sum),
      use: options.use == '' ? 0 : parseFloat(options.use),
      originUse: options.use == '' ? 0 : parseFloat(options.use),
      date: options.use == '' ? (time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()):options.date,
      classUid:options.classUid==''?"":options.classUid,
      remark:options.remark==''?"无":options.remark
    });
  },
  changeDate: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  changeUse: function (e) {
    let sign = e.detail.value[0] == 0 ? '+' : '-';
    let intNum = e.detail.value[1];
    let floatNum = e.detail.value[2] == 0 ? "" : ".5";
    this.setData({
      use: parseFloat(sign + intNum + floatNum)
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true,
      remark: this.data.tempRemark,
      tempRemark: ""
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
      tempRemark: ""
    })
  },
  openModel: function () {
    this.setData({
      hiddenmodalput: false,
      tempRemark: this.data.remark
    })
    let len = this.data.tempRemark.length;
    let g = 250 - len * 15;
    if (g < 0)
      g = 0;
    this.setData({
      borderColor: "rgb(36, " + g + ", 255)"
    })
  },
  changeRemark: function (e) {
    this.setData({
      tempRemark: e.detail.value
    });
    let len = this.data.tempRemark.length;
    let g = 250 - len * 15;
    if (g < 0)
      g = 0;
    this.setData({
      borderColor: "rgb(36, " + g + ", 255)"
    })
  },
  openModelMP: function () {
    if (!((this.data.pageType != 'editRemain' || this.data.userType == 'admin' || ((this.data.db == 'cladding' || this.data.db == 'claddingHistory') && this.data.userType == 'claddingAdmin') || ((this.data.db == 'compt' || this.data.db == 'comptHistory') && this.data.userType == 'comptAdmin')) && (this.data.db != 'claddingHistory' && this.data.db != 'comptHistory')))
      return;
    this.setData({
      hiddenMP: false,
      tempClasses: this.data.classes
    })
    let len = this.data.tempClasses.length;
    let g = 250 - len * 50;
    if (g < 0)
      g = 0;
    this.setData({
      borderColor: "rgb(36, " + g + ", 255)"
    })
  },
  confirmMP: function () {
    this.setData({
      hiddenMP: true,
      classes: this.data.tempClasses,
      tempClasses: ""
    })
  },
  cancelMP: function () {
    this.setData({
      hiddenMP: true,
      tempClasses: ""
    })
  },
  changeMP: function (e) {
    this.setData({
      tempClasses: e.detail.value
    });
    let len = this.data.tempClasses.length;
    let g = 250 - len * 50;
    if (g < 0)
      g = 0;
    this.setData({
      borderColor: "rgb(36, " + g + ", 255)"
    })
  },
  submitInform: function () {
    let _this = this;
    if (_this.data.classes.length == 0) {
      wx.showToast({
        title: '请输入品名',
        image: '/images/about.png'
      })
      return;
    }
    if (!(_this.data.userType == 'admin' || ((_this.data.db == 'cladding' || _this.data.db == 'claddingHistory') && _this.data.userType == 'claddingAdmin') || ((_this.data.db == 'compt' || _this.data.db == 'comptHistory') && _this.data.userType == 'comptAdmin')) && _this.data.use>0){
      wx.showToast({
        title: '无法增加库存',
        image: '/images/about.png'
      })
      return;
    }
    //添加品类
    if (_this.data.pageType == 'addClasses') {
      if (_this.data.use < 0) {
        wx.showToast({
          title: '请输入正增量',
          image: '/images/about.png'
        })
        return;
      }
      _this.setData({
        loading: true
      })
      if (_this.data.db == 'cladding' || _this.data.db == 'compt') {
        wx.cloud.callFunction({
          name: 'addGoodsClasses',
          data: {
            classes: _this.data.classes,
            sum: _this.data.use,
            use: _this.data.use,
            date: _this.data.date,
            remark: _this.data.remark,
            belongName: app.globalData.nickName,
            belongAvatar: app.globalData.avatar,
            belongOpenId: app.globalData.openId,
            belongUid: app.globalData.uid,
            dataBase: _this.data.db
          },
          fail: (res) => {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          },
          success: (res) => {
            _this.setData({
              loading: false
            })
            wx.navigateBack({
              delta: 1,
            })
          }
        });
      }
    }
    // 更改账目
    else if (_this.data.pageType == 'editRemain') {
      if (_this.data.use < 0 && _this.data.use + _this.data.sum < 0) {
        wx.showToast({
          title: '库存不足',
          image: '/images/about.png'
        })
        return;
      }
      _this.setData({
        loading: true
      })
      if (_this.data.db == 'cladding' || _this.data.db == 'compt') {
        if (!(_this.data.userType == 'admin' || _this.data.userType == 'editor' ||  _this.data.userType == 'claddingAdmin' || _this.data.userType == 'comptAdmin')) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '无修改权限',
            image: '/images/about.png'
          })
          return;
        }
        wx.cloud.callFunction({
          name: 'editGoods',
          data: {
            classes: _this.data.classes,
            sum: _this.data.sum,
            use: _this.data.use,
            date: _this.data.date,
            remark: _this.data.remark,
            claddingUid: _this.data.id,
            dataBase: _this.data.db,
            belongName: app.globalData.nickName,
            belongAvatar: app.globalData.avatar,
            belongOpenId: app.globalData.openId,
            belongUid: app.globalData.uid,
          },
          fail: (res) => {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          },
          success: (res) => {
            _this.setData({
              loading: false
            })
            wx.navigateBack({
              delta: 1,
            })
          }
        });
      }
      else if (_this.data.db == 'claddingHistory' || _this.data.db == 'comptHistory') {
        if (!(_this.data.userType == 'admin' || (_this.data.db == 'claddingHistory' && _this.data.userType == 'claddingAdmin') || (_this.data.db == 'comptHistory' && _this.data.userType == 'comptAdmin'))) {
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '无修改权限',
            image: '/images/about.png'
          })
          return;
        }
        else if (_this.data.classUid.length==0){
          _this.setData({
            loading: false
          })
          wx.showToast({
            title: '品类已被删除',
            image: '/images/about.png'
          })
          return;
        }
        wx.cloud.callFunction({
          name: 'editGoodsHistory',
          data: {
            classes: _this.data.classes,
            sum: _this.data.sum,
            use: _this.data.use,
            date: _this.data.date,
            remark: _this.data.remark,
            claddingUid: _this.data.id,
            classUid: _this.data.classUid,
            originUse: _this.data.originUse,
            dataBase: _this.data.db.split("History")[0]
          },
          fail: (res) => {
            _this.setData({
              loading: false
            })
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          },
          success: (res) => {
            _this.setData({
              loading: false
            })
            wx.navigateBack({
              delta: 1,
            })
          }
        });
      }
    }
  },
  deleteInform: function () {
    let _this = this;
    wx.showModal({
      title: '删除',
      content: '你确定要删除此项吗',
      confirmColor: "#4B221E",
      success: (res) => {
        if (res.confirm) {
          _this.setData({
            deleteLoading: true
          })
          if (_this.data.db == 'cladding' || _this.data.db == 'compt') {
            wx.cloud.callFunction({
              name: 'deleteGoods',
              data: {
                uid: _this.data.id,
                dataBase: _this.data.db
              },
              fail: (res) => {
                _this.setData({
                  deleteLoading: false
                })
                wx.showToast({
                  title: '网络传输故障',
                  image: '/images/about.png'
                })
              },
              success: (res) => {
                var m = [];
                for (let i = 0; i < res.result.data.length; i++) {
                  m.push(new Promise(function (resolve, reject) {
                  wx.cloud.callFunction({
                    name: 'deleteRelatedHistory',
                    data: {
                      uid: res.result.data[i]._id,
                      dataBase: _this.data.db
                    },
                    fail: (res) => {
                      _this.setData({
                        deleteLoading: false
                      })
                      wx.showToast({
                        title: '网络传输故障',
                        image: '/images/about.png'
                      })
                      reject(i);
                    },
                    success: (r) => {
                      resolve(i);
                    }
                  });
                  }));
                }
                Promise.all(m).then(function(){
                  _this.setData({
                    deleteLoading: false
                  })
                  wx.navigateBack({
                    delta: 1,
                  })
                })
              }
            });
          }
          else if (_this.data.db == 'claddingHistory' || _this.data.db == 'comptHistory') {
            wx.cloud.callFunction({
              name: 'deleteGoodsHistory',
              data: {
                uid: _this.data.id,
                dataBase: _this.data.db.split("History")[0],
                classUid: _this.data.classUid,
                use: _this.data.originUse,
              },
              fail: (res) => {
                _this.setData({
                  deleteLoading: false
                })
                wx.showToast({
                  title: '网络传输故障',
                  image: '/images/about.png'
                })
              },
              success: (res) => {
                _this.setData({
                  deleteLoading: false
                })
                wx.navigateBack({
                  delta: 1,
                })
              }
            });
          }
        }
      }
    })
  }
})
