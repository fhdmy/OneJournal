//index.js
const app = getApp()

Page({
  data: {
    userData:[]
  },
  onLoad: function(options) {
    let _this=this;
    wx.cloud.callFunction({
      name:'getUserPermission',
      fail:(res)=>{
        wx.showToast({
          title: '网络传输故障',
          image: '/images/about.png'
        })
      },
      success:(res)=>{
        for (let i = 0; i < res.result.data.length; i++) {
          let m = "userData[" + i + "]";
          _this.setData({
            [m]: {
              avatar: res.result.data[i].avatar,
              openId: res.result.data[i].openId,
              userName: res.result.data[i].userName,
              userType: res.result.data[i].userType,
              userUid: res.result.data[i]._id
            }
          })
        }
      }
    });
  },
  changeType:function(e){
    let _this=this;
    let index=e.target.id;
    let list = ['none', 'watcher', 'editor','admin','claddingAdmin','comptAdmin'];
    wx.showActionSheet({
      itemList: ['none', 'watcher', 'editor', 'admin', 'claddingAdmin', 'comptAdmin'],
      success(e) {
        wx.cloud.callFunction({
          name:'changeUserType',
          data:{
            type: list[e.tapIndex],
            uid: _this.data.userData[index].userUid
          },
          fail:(res)=>{
            wx.showToast({
              title: '网络传输故障',
              image: '/images/about.png'
            })
          },
          success:(res)=>{
            let m = 'userData[' + index +'].userType';
            _this.setData({
              [m]: list[e.tapIndex]
            })
            wx.showToast({
              title: '更改成功',
            })
          }
        });
      }
    })
  },
  deleteUser:function(e){
    let _this = this;
    let index = e.target.id;
    wx.showModal({
      title: '删除用户',
      content: '你确定要删除该用户？',
      confirmColor:"#FF0000",
      success:(res)=>{
        if(res.confirm){
          wx.cloud.callFunction({
            name:'deleteUser',
            data:{
              userUid:_this.data.userData[index].userUid
            },
            fail: (res) => {
              wx.showToast({
                title: '网络传输故障',
                image: '/images/about.png'
              })
            },
            success: (res) => {
              let m = _this.data.userData;
              m.splice(index,1);
              _this.setData({
                userData:m
              })
            }
          });
        }
      }
    })
  }
})
