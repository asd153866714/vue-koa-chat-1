const jwt = require("jsonwebtoken");
const secret = require("../config.js").secret;

module.exports = async (ctx, next) => {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    ctx.throw(401, "User not authenticated!");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;

  decodedToken = jwt.verify(token, secret);
  decodedToken = jwt.verify(token, secret);

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
