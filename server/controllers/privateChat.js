const Message = require("../models/message");
const PrivateLatest = require("../models/privateLatest");
const User = require("../models/user");

/**
 * 取得單人聊天室訊息
 */

let getPrivateDetail = async (ctx) => {
  const toUserId = ctx.query.toUserId;
  const fromUserId = ctx.state.userId;
  const privateChatDetail = await Message.find({
    $or: [
      { from: fromUserId, to: toUserId },
      { from: toUserId, to: fromUserId },
    ],
  })
    .populate({
      path: "from",
      select: ["name", "avatarColor", "avatarName"],
    })
    .sort({ time: 1 });

  console.log("get Private Chat Detail[0]:", privateChatDetail[0]);

  ctx.body = {
    privateChatDetail: privateChatDetail,
  };
};

/**
 * 儲存單人聊天室訊息
 */
let savePrivateMsg = async (ctx) => {
  const from_user = ctx.state.userId;
  const to_user = ctx.request.body.to_user;
  const message = ctx.request.body.message;
  // const name = ctx.request.body.name;
  // const avatarColor = ctx.request.body.avatarColor;
  const time = ctx.request.body.time;
  try {
    let newMessage = await new Message({
      from: from_user,
      to: to_user,
      message: message,
      time: time,
    }).save();
    console.log("儲存訊息成功, newMessage:", await newMessage);

    // PrivateLatest 儲存最新一筆資料
    await PrivateLatest.findOneAndUpdate(
      {
        userId: from_user,
        withUserId: to_user,
      },
      {
        messageId: newMessage._id,
      },
      {
        new: true,
        upsert: true,
      }
    );

    await PrivateLatest.findOneAndUpdate(
      {
        userId: to_user,
        withUserId: from_user,
      },
      {
        messageId: newMessage._id,
      },
      {
        new: true,
        upsert: true,
      }
    );

    console.log("更新最新一筆紀錄成功");
    ctx.status = 200;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getPrivateDetail,
  savePrivateMsg,
};
