const socketCtrl = require("./controllers/socket");
const PrivateMessage = require("./models/message");
const PrivateLatest = require("./models/privateLatest");
const GroupMessage = require("./models/groupMessage");
const GroupLatest = require("./models/groupLatest");
const User = require("./models/user");

function init(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    let socketId = socket.id;

    // user join all rooms
    async function socketJoinAllGroup(userId, socketId) {
      try {
        const groupList = await socketCtrl.getUserGroupList(userId);
        // console.log("SOCKET join groupList: ", groupList);
        // console.log("groupList: ", groupList);
        if (groupList.length > 0) {
          for (const item of groupList) {
            socket.join(`${item}`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    // socket.on("joined", (userId, socketId) => {
    //   socketJoinAllGroup(userId, socketId);
    // });

    // login
    socket.on("login", async (userId) => {
      console.log("SOCKET on login socket id");
      console.log("SOCKET save user's socketId");
      await socketCtrl.saveUserSocketId(userId, socketId);
      // socketJoinAllGroup(userId, socketId);
    });
    // update socketId
    socket.on("update", async (userId) => {
      console.log("SOCKET on update socketId");
      await socketCtrl.saveUserSocketId(userId, socketId);
      socketJoinAllGroup(userId, socketId);
    });
    // private chat
    socket.on("sendPrivateMsg", async (data) => {
      try {
        console.log("SERVER SOCKET on sendPrivateMsg");
        const toUserSocketId = await socketCtrl.getUserSocketId(data.to);
        console.log("fromUserSocketId:", socket.id);
        console.log("toUserSocketId: ", toUserSocketId);
        // 儲存到資料庫
        let savePrivateMsg;
        if (data.fromSys) {
          savePrivateMsg = await new PrivateMessage({
            to: data.to,
            message: data.message,
            time: data.time,
            fromSys: data.fromSys,
          }).save();
        } else {
          savePrivateMsg = await new PrivateMessage({
            from: data.from,
            to: data.to,
            message: data.message,
            time: data.time,
          }).save();
        }
        console.log("SERVER SOCKET save group messages:", savePrivateMsg);
        // 更新 PrivateLatest 最新一筆資料
        let fromUser = savePrivateMsg.from;
        let toUser = savePrivateMsg.to;
        await PrivateLatest.findOneAndUpdate(
          {
            userId: fromUser,
            withUserId: toUser,
          },
          {
            messageId: savePrivateMsg._id,
          },
          {
            new: true,
            upsert: true,
          }
        );

        await PrivateLatest.findOneAndUpdate(
          {
            userId: toUser,
            withUserId: fromUser,
          },
          {
            messageId: savePrivateMsg._id,
          },
          {
            new: true,
            upsert: true,
          }
        );

        // mongoose populate the record
        let sendBackPrivateMessage = await savePrivateMsg
          .populate({
            path: "from",
            select: ["name", "avatarColor", "avatarName"],
          })
          .execPopulate();

        io.to(socketId).emit("getPrivateMsg", sendBackPrivateMessage);

        // 傳給自己時避免重複傳送
        if (data.from != data.to) {
          io.to(toUserSocketId).emit("getPrivateMsg", sendBackPrivateMessage);
        }
        console.log("SERVER SOCKET emit getPrivateMsg");
      } catch (error) {
        console.log(error);
      }
    });
    // group chat
    socket.on("sendGroupMsg", async (data) => {
      try {
        console.log("SERVER SOCKET on sendGroupMsg");
        // 儲存到資料庫
        let saveGroupMessage;
        if (data.fromSys) {
          saveGroupMessage = await new GroupMessage({
            to: data.to,
            message: data.message,
            time: data.time,
            fromSys: data.fromSys,
          }).save();
        } else {
          saveGroupMessage = await new GroupMessage({
            from: data.from,
            to: data.to,
            message: data.message,
            time: data.time,
          }).save();
        }
        console.log("SERVER SOCKET save group messages:", saveGroupMessage);
        // 更新該群組的最新一筆訊息
        let updateGroupLatest = await GroupLatest.findOneAndUpdate(
          {
            groupId: saveGroupMessage.to,
          },
          {
            messageId: saveGroupMessage._id,
          },
          {
            new: true,
            upsert: true,
          }
        );
        // mongoose populate the record
        let sendBackGroupMessage = await saveGroupMessage
          .populate({
            path: "from",
            select: ["name", "avatarColor", "avatarName"],
          })
          .execPopulate();

        console.log(
          "SERVER SOCKET update group latest message:",
          sendBackGroupMessage
        );
        console.log("SERVER SOCKET emit getGroupMsg");
        io.in(data.to).emit("getGroupMsg", sendBackGroupMessage);
      } catch (error) {
        console.log(error);
      }
    });
    // create group
    socket.on("createGroup", async (groupId) => {
      console.log("SERVER SOCKET get create group");
      console.log("SOCKET join groupId:", groupId);
      socket.join(groupId);
    });
    // join group
    socket.on("joinGroup", async (groupId) => {
      console.log("SERVER SOCKET get join group");
      console.log(groupId);
      socket.join(groupId);
    });

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
    });
  });
}

module.exports = {
  init,
};
