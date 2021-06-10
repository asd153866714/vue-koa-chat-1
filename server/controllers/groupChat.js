const GroupMessage = require("../models/groupMessage");
const GroupLatest = require("../models/groupLatest");

let getGroupChatDetail = async (ctx) => {
  const toGroupId = ctx.query.toGroupId;
  const groupChatDetail = await GroupMessage.find({
    to: toGroupId,
  })
    .populate({
      path: "from",
      select: ["name", "avatarColor", "avatarName"],
    })
    .sort({ time: 1 });

  // console.log("Server gpMsgDetail:", groupChatDetail);

  ctx.body = {
    groupChatDetail: groupChatDetail,
  };
};

module.exports = {
  getGroupChatDetail,
};
