// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 100
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const countResult = await db.collection(event.dataBase + 'History').count()
  const total = countResult.total
  if(total==0)
    return await db.collection(event.dataBase + 'History').get();
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(event.dataBase + 'History').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))
  
  // const promiseInform = db.collection(event.dataBase+'History').get();
  // let inform = await promiseInform;
  // return inform;
}