// const MsgList = require("../models/message");
const PrivateLatest = require("../models/privateLatest");

let getRoomList = async (ctx) => {
  try {
    const userId = ctx.state.userId;
    const privateChatList = await PrivateLatest.find({
      userId: userId,
    })
      .populate("withUserId", "name")
      .populate({
        path: "messageId",
        select: ["name", "message", "time"],
      })
      // .sort({ time: -1 })
      .exec();

    // Mongoose sort 無效，先用 JS 的排序方法處理
    privateChatList.sort((a, b) => b.messageId.time - a.messageId.time);

    console.log("訊息列表：", privateChatList);

    // 多人聊天室
    let groupChatList = [];
    let roomList = [...privateChatList, ...groupChatList];
    console.log("聊天室列表：", roomList);

    ctx.status = 200;
    ctx.body = {
      roomList: roomList,
    };
  } catch (error) {
    ctx.throw(error.statusCode, error.message);
  }
};

// let msgList = async (ctx) => {
//   try {
//     const res1 = await MsgList.getPrivateList(ctx.user_id);
//     const privateList = JSON.parse(JSON.stringify(res1));
//     const res2 = await MsgList.getGroupList(ctx.user_id);
//     const groupList = JSON.parse(JSON.stringify(res2));
//     ctx.body = {
//       success: true,
//       data: {
//         privateList: privateList,
//         groupList: groupList,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = {
  getRoomList,
};
