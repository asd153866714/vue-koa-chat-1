const Group = require("../models/group");
const GroupMessage = require("../models/groupMessage");
const GroupLatest = require("../models/groupLatest");
const User = require("../models/user");
const avatarUtil = require("../utils/avatar");

let createGroup = async (ctx) => {
  const userId = ctx.state.userId;
  const { name } = ctx.request.body;
  try {
    // let hasGroup = await Group.findOne({ name: name });
    // if (hasGroup) {
    //   ctx.throw(400, "Group name have been use!");
    // }
    const randomColor = avatarUtil.createRandomColor();
    const avatarName = avatarUtil.CreateRandomAvatarName(name, "group");

    let newGroup = await new Group({
      name: name,
      avatarColor: randomColor,
      avatarName: avatarName,
    }).save();
    let newMember = await Group.findOneAndUpdate(
      { _id: newGroup._id },
      {
        $push: { members: userId },
      }
    );
    let updateUserGroups = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: { groups: newGroup._id },
      },
      {
        new: true,
        upsert: true,
      }
    );

    ctx.status = 200;
    ctx.body = {
      message: "Create group successfully",
      newGroupInfo: newGroup,
    };
  } catch (error) {
    ctx.throw(error.statusCode, error.message);
  }
};

let getGroupInfo = async (ctx) => {
  const groupId = ctx.query.groupId;
  try {
    let groupInfo = await Group.find({ _id: groupId }).select([
      "name",
      "avatarColor",
      "members",
    ]);
    ctx.body = {
      groupInfo: groupInfo[0],
    };
  } catch (error) {
    ctx.throw(error.statusCode, error.message);
  }
};

let joinGroup = async (ctx) => {
  try {
    const { userId, groupId } = ctx.request.body;
    console.log(userId, groupId);
    let updateGroupMembers = await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $push: { members: userId },
      },
      {
        new: true,
      }
    );
    let updateUserGroups = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $push: { groups: updateGroupMembers._id },
      },
      {
        new: true,
      }
    );
    console.log("SERVER join group updated info:", updateGroupMembers);
    ctx.body = {
      joinGroupInfo: updateGroupMembers,
      joinGroupId: groupId,
    };
  } catch (error) {
    ctx.throw(error.statusCode, error.message);
  }
};

let leaveGroup = async (ctx) => {};

let updateGroupInfo = async (ctx) => {};

module.exports = {
  createGroup,
  getGroupInfo,
  joinGroup,
};
