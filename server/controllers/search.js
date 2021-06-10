const User = require("../models/user");
const Group = require("../models/group");

// 單一搜尋
let searchByName = async (ctx) => {
  try {
    const name = ctx.query.name;
    let userSearchResult = await User.find({ name: name })
      .select(["id", "name", "avatarColor", "avatarName"])
      .lean();
    let groupSearchResult = await Group.find({ name: name })
      .select(["id", "name", "avatarColor", "avatarName"])
      .lean();
    userSearchResult.forEach((e) => {
      e.type = "private";
    });
    groupSearchResult.forEach((e) => {
      e.type = "group";
    });
    // console.log(userSearchResult);
    const searchResult = userSearchResult.concat(groupSearchResult);
    // console.log(`Server search result { ${name} }`, searchResult);
    // if (searchResult.length <= 0) console.log(searchResult);
    ctx.body = {
      searchResult: searchResult,
    };
  } catch (error) {
    ctx.throw(error.statusCode, error.message);
  }
};
module.exports = {
  searchByName,
};
