// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const editGoods = await db.collection(event.dataBase+'History').doc(event.uid).update({
    data: {
      classUid:""
    }
  })
  return editGoods;
}