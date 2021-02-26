// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let d = new Date();
  let userT;
  if(d>new Date("2019-07-4")){
    userT='none';
  }
  else {
    userT='watcher'
  }
  const promiseInform = db.collection('user').where({
    openId: wxContext.OPENID
  }).get();
  let inform = await promiseInform;
  if (inform.data.length == 0) {
    const promiseAdd = db.collection('user').add({
      data: {
        userName: event.nickName,
        openId: wxContext.OPENID,
        avatar: event.avatar,
        userType: userT
      },
    })
    const uid = (await promiseAdd)._id
    return {
      data:[{
        _id: uid,
        openId: wxContext.OPENID,
        userType: userT,
        userName: event.nickName,
        avatar: event.avatar
      }]
    }
  }
  else return inform
}