// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const promiseInform = await db.collection(event.dataBase).where({
    _id: event.classUid
  }).get();
  const updateCladding = await db.collection(event.dataBase).doc(event.classUid).update({
    data: {
      sum: promiseInform.data[0].sum + event.use - event.originUse,
    }
  })
  const historyCladding = await db.collection(event.dataBase+'History').doc(event.claddingUid).update({
    data: {
      classes: event.classes,
      sum: event.sum,
      remain: event.sum + event.use,
      use: event.use,
      date: event.date,
      remark: event.remark,
      classUid: event.classUid
    }
  })
  return historyCladding;
}