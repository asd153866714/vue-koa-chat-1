const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secret = require("../config.js").secret;

class authController {
  postSignup = async (ctx) => {
    console.log(ctx.request.body);
    let { name, password } = ctx.request.body;
    try {
      let hasUser = await User.findOne({ name, name });
      if (hasUser) {
        ctx.throw(400, "Username has been use!");
      }
      let newUser = await new User({
        name: name,
        password: bcrypt.hashSync(password, 12),
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
          { expiresIn: "5h" }
        );

        ctx.status = 200;
        ctx.body = {
          message: "Login success.",
          token: token.toString(),
          userInfo: {
            name: hasUser.name,
            id: hasUser._id,
            socketId: hasUser.sockedId,
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
