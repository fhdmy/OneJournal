// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let prom=await db.collection(event.dataBase).doc(event.uid).remove();
  const his = await db.collection(event.dataBase+'History').where({
    classUid: event.uid
  }).get();
  return his;
}