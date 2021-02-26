// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const editCladding = await db.collection(event.dataBase).doc(event.claddingUid).update({
    data: {
      classes: event.classes,
      sum: event.sum+event.use,
      remark: event.remark,
    }
  })
  const addHistory = db.collection(event.dataBase+'History').add({
    data: {
      classes: event.classes,
      sum: event.sum,
      remain: event.sum+event.use,
      use: event.use,
      date: event.date,
      remark: event.remark,
      belongName: event.belongName,
      belongAvatar: event.belongAvatar,
      belongOpenId: event.belongOpenId,
      belongUid: event.belongUid,
      classUid: event.claddingUid,
    },
  })
  let h = await addHistory;
  return h;
}