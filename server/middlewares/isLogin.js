const jwt = require("jsonwebtoken");
const secret = require("../config.js").secret;

module.exports = async (ctx, next) => {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    ctx.throw(401, "User not authenticated!");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  console.log("測試請求 token 欄位：", token);
  decodedToken = jwt.verify(token, secret);
  console.log("JWT Token:", decodedToken);
  // try {
  //   decodedToken = jwt.verify(token, secret);
  // } catch (error) {
  //   ctx.throw(error.status, error.message);
  // }
  if (!decodedToken) {
    ctx.throw(401, "User not authenticated!");
  }
  ctx.state.userId = decodedToken.userId;
  await next();
};
