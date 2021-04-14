const Koa = require("koa");
const koaBody = require("koa-body");
const koaLogger = require("koa-logger");
const cors = require("@koa/cors");
const mongoose = require("mongoose");

require("dotenv").config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Vue-Koa-Chat";

const app = new Koa();

const server = require("http").createServer(app.callback());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
const socketCtrl = require("./controllers/socket");

// init middleware
app.use(koaBody());
app.use(koaLogger());

app.use(
  cors({
    origin: function (ctx) {
      return "*";
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// init routes
const authRoutes = require("./routes/auth");
app.use(authRoutes.routes());

// init socket.io
let users = [];

io.on("connection", (socket) => {
  console.log("connected");
  const socketId = socket.id;

  // login
  socket.on("login", async (userId) => {
    await socketCtrl.saveUserSocketId(userId, socketId);
  });
  // update socketId
  socket.on("update", async (userId) => {
    console.log("HAHAHA: ", userId);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    await socketCtrl.saveUserSocketId(userId, socketId);
  });
  // private chat
  socket.on("sendPrivateMsg", async (data) => {
    console.log(data);
    console.log(socket.id);
    const toUserSocketId = await socketCtrl.getUserSocketId(data.to_user);
    console.log("toUserSocketId: ", toUserSocketId);
    io.to(toUserSocketId).emit("getPrivateMsg", data);
  });
  // group chat
  // socket.on("sendGroupMsg", async (data) => {
  //   io.sockets.emit("getGroupMsg", data);
  // });

  // add friend request
  socket.on("sendRequest", async (data) => {
    console.log("sendRequest", data);
    const arr = await socketCtrl.getUserSocketId(data.to_user);
    const toUserSocketId = await socketCtrl.getUserSocketId(data.to_user);
    io.to(toUserSocketId).emit("getResponse", data);
    // const RowDataPacket = arr[0];
    // const socketId = JSON.parse(JSON.stringify(RowDataPacket)).socketId;
    // console.log("给谁的socketId", socketId);
    // io.to(socketId).emit("getresponse", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    const user = users.find((user) => user.id === socket.id);
    const index = users.indexOf(user);
    users.splice(index, 1);
    console.log(users);
  });
});

// connect to mongodb
mongoose.connect(`${MONGODB_URI}`, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = server.listen(PORT, () => {
  console.log(`Server run on http://localhost:${PORT}`);
});
