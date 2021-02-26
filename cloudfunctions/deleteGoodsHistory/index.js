// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.classUid) {
    const promiseInform =await db.collection(event.dataBase).where({
      _id: event.classUid
    }).get();
    const editGoods = await db.collection(event.dataBase).doc(event.classUid).update({
      data: {
        sum: promiseInform.data[0].sum-event.use
      }
    });
  }
  let prom = await db.collection(event.dataBase + 'History').doc(event.uid).remove();
  return prom;
}