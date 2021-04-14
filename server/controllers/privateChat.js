const Message = require("../models/message");

/**
 * 获取私聊相关内容
 * @param  to_user 信息发送者的id
 * @param  from_user 信息接收者的id
 * @return  from_user  此条信息的发送者
 *          message 私聊信息
 *          time 时间
 *          avator 发送者的头像
 *          sex 发送者的性别
 *          place 发送者居住地
 *         status 发送者的是否在线
 */

let getPrivateDetail = async (ctx) => {
  const to_user = ctx.query.to_user;
  const from_user = ctx.state.userId;
  const privateDetail = await Message.find({
    $or: [
      { from: from_user, to: to_user },
      { from: to_user, to: from_user },
    ],
  }).sort({ time: 1 });

  privateDetail;

  // const res1 = await Message.find({ from: from_user, to: to_user });
  // const res2 = await Message.find({ from: to_user, to: from_user });
  // const privateDetail = res1.concat(res2);
  privateDetail.forEach((e) => {
    console.log(e.time);
  });

  ctx.body = {
    privateDetail: privateDetail,
  };
};

/**
 * 存储私聊聊信息
 * @param   to_user  信息发送者的id
 * @param   from_user 信息接收者的id
 * @param   message  消息
 * @param   name 用户名
 * @param   time  时间
 * @return
 */
let savePrivateMsg = async (ctx) => {
  const from_user = ctx.state.userId;
  const to_user = ctx.request.body.to_user;
  const message = ctx.request.body.message;
  const name = ctx.request.body.name;
  const time = ctx.request.body.time;
  try {
    let newMessage = new Message({
      from: from_user,
      to: to_user,
      message: message,
      name: name,
      time: time,
    });
    await newMessage.save();

    console.log("儲存訊息成功");
    ctx.status = 200;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getPrivateDetail,
  savePrivateMsg,
};
