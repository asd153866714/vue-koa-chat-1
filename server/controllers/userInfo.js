const User = require("../models/user");

/**
 * 通過 user_id 取得使用者資訊
 */

let getUserInfo = async (ctx) => {
  const userId = ctx.query.id;
  console.log(userId);
  try {
    const userInfo = await User.findById(userId);
    console.log(userInfo);

    ctx.body = {
      userInfo: userInfo,
    };
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
};

module.exports = {
  getUserInfo,
};
