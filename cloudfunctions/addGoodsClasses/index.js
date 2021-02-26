// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const addCladding = await db.collection(event.dataBase).add({
    data: {
      classes: event.classes,
      sum: event.sum,
    },
  })
  const addHistory = db.collection(event.dataBase+'History').add({
    data: {
      classes: event.classes,
      sum: 0,
      remain: event.use,
      use: event.use,
      date: event.date,
      remark: event.remark,
      belongName: event.belongName,
      belongAvatar: event.belongAvatar,
      belongOpenId: event.belongOpenId,
      belongUid: event.belongUid,
      classUid: addCladding._id,
    },
  })
  let h = await addHistory;
  return h;
}