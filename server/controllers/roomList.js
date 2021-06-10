// const MsgList = require("../models/message");
const PrivateLatest = require("../models/privateLatest");
const GroupLatest = require("../models/groupLatest");
const User = require("../models/user");

let getRoomList = async (ctx) => {
  try {
    const userId = ctx.state.userId;
    let privateChatList = await PrivateLatest.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "withUserId",
          foreignField: "_id",
          as: "roomInfo",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messageId",
          foreignField: "_id",
          as: "messageInfo",
        },
      },
      {
        $unwind: "$roomInfo",
      },
      {
        $unwind: "$messageInfo",
      },
      {
        $project: {
          roomInfo: {
            _id: 1,
            name: 1,
            avatarName: 1,
            avatarColor: 1,
          },
          messageInfo: {
            message: 1,
            time: 1,
          },
          type: "private",
        },
      },
    ]);
    // console.log("privateChatList:", privateChatList);

    // 查詢 User Model 的 groups 陣列
    let UserInfo = await User.findOne({ _id: userId }).select("groups");
    let userGroups = UserInfo.groups;
    let groupChatList = [];
    // 判斷 userGroups 是否為空陣列
    if (userGroups.length <= 0) {
      groupChatList = [];
    } else if (userGroups.length > 0) {
      let groupChatLatestQuery = userGroups.map((x) => {
        return {
          groupId: x,
        };
      });
      // console.log("groupChatLatestQuery:", groupChatLatestQuery);
      groupChatList = await GroupLatest.aggregate([
        {
          $match: {
            $or: groupChatLatestQuery,
          },
        },
        {
          $lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "roomInfo",
          },
        },
        {
          $lookup: {
            from: "groupmessages",
            localField: "messageId",
            foreignField: "_id",
            as: "messageInfo",
          },
        },
        {
          $unwind: "$roomInfo",
        },
        {
          $unwind: "$messageInfo",
        },
        {
          $project: {
            roomInfo: 1,
            messageInfo: 1,
            type: "group",
          },
        },
      ]);
    }
    // 將 User Model 的 groups 陣列轉換成 $or 查詢的狀態
    // console.log("groupChatList: ", groupChatList);

    let roomList = privateChatList.concat(groupChatList);
    roomList.sort((a, b) => {
      return b.messageInfo.time - a.messageInfo.time;
    });

    ctx.status = 200;
    ctx.body = {
      roomList: roomList,
    };
  } catch (error) {
    ctx.throw(error.statusCode, error.message);
  }
};

module.exports = {
  getRoomList,
};
