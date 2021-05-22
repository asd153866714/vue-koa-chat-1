// const MsgList = require("../models/message");
const PrivateLatest = require("../models/privateLatest");

let getRoomList = async (ctx) => {
  try {
    const userId = ctx.state.userId;
    const privateList = await PrivateLatest.find({
      userId: userId,
    });
    console.log("訊息列表：", privateList);

    ctx.status = 200;
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
