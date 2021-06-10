const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = require("../config.js").secret;
const avatarUtil = require("../utils/avatar");

class authController {
  postSignup = async (ctx) => {
    console.log(ctx.request.body);
    const { name, password } = ctx.request.body;
    const randomColor = avatarUtil.createRandomColor();
    const avatarName = avatarUtil.CreateRandomAvatarName(name, "user");
    try {
      let hasUser = await User.findOne({ name: name });
      if (hasUser) {
        ctx.throw(400, "Username has been use!");
      }
      let newUser = await new User({
        name: name,
        password: bcrypt.hashSync(password, 12),
        avatarName: avatarName,
        avatarColor: randomColor,
        groups: [],
      }).save();

      ctx.status = 201;
      ctx.body = {
        message: "Sign up successfully",
      };
    } catch (error) {
      ctx.throw(error.statusCode, error.message);
    }
  };

  postLogin = async (ctx) => {
    console.log(ctx.request.body);
    const { name, password } = ctx.request.body;
    try {
      const hasUser = await User.findOne({ name: name });

      if (hasUser && bcrypt.compareSync(password, hasUser.password)) {
        // JWT Token Authentication
        const token = jwt.sign(
          {
            name: hasUser.name,
            userId: hasUser._id.toString(),
          },
          secret,
          { expiresIn: "30d" }
        );

        ctx.status = 200;
        ctx.body = {
          message: "Login success.",
          token: token.toString(),
          expire: new Date().getTime() + 3600 * 24 * 30 * 1000,
          userInfo: {
            name: hasUser.name,
            id: hasUser._id,
            avatarColor: hasUser.avatarColor,
            avatarName: hasUser.avatarName,
          },
        };
      } else {
        ctx.throw(400, "Invalid username or password.");
      }
    } catch (error) {
      ctx.throw(error.statusCode, error.message);
    }
  };

  postLogout = (ctx) => {
    ctx.body = {
      message: "Logout success.",
    };
  };
}

module.exports = new authController();
