const MsgList = require("../models/message");

let msgList = async (ctx) => {
  try {
    const res1 = await MsgList.getPrivateList(ctx.user_id);
    const privateList = JSON.parse(JSON.stringify(res1));
    const res2 = await MsgList.getGroupList(ctx.user_id);
    const groupList = JSON.parse(JSON.stringify(res2));
    ctx.body = {
      success: true,
      data: {
        privateList: privateList,
        groupList: groupList,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  msgList,
};
