const User = require("../models/user");

let saveUserSocketId = async (userId, socketId) => {
  try {
    let data = await User.findOneAndUpdate(
      { _id: userId },
      { socketId: socketId },
      {
        new: true,
      }
    );
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};
let getUserSocketId = async (userId) => {
  try {
    let data = await User.findById(userId);
    return data.socketId;
  } catch (error) {}
};
let getUserGroupList = (userId) => {
  return new Promise(async (resolve, reject) => {
    let result = await User.find({ _id: userId }).select({ groups: 1 });
    // console.log("GG:", result);
    let groupList = result[0].groups;
    // console.log("GG2", groupList);
    if (groupList) {
      resolve(groupList);
    }
    reject("Fail");
  });
  // try {
  //   let result = await User.find({ _id: userId }).select({ groups: 1 });
  //   console.log("GG:", result);
  //   let groupList = result[0].groups;

  //   return groupList;
  // } catch (error) {
  //   console.log(error);
  // }
};
let findUserBySocketId = async (socketId) => {};

// module.exports = new socketController();
module.exports = {
  saveUserSocketId,
  getUserSocketId,
  getUserGroupList,
};
