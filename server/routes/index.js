const Router = require("koa-router");

const authCtrl = require("../controllers/auth");
const userInfoCtrl = require("../controllers/userInfo");
const roomListCtrl = require("../controllers/roomList");
const privateChatCtrl = require("../controllers/privateChat");
const groupCtrl = require("../controllers/group");
const groupChatCtrl = require("../controllers/groupChat");
const searchCtrl = require("../controllers/search");
// const friendsCtrl = require("../controllers/friends");

const isLogin = require("../middlewares/isLogin");

const router = new Router({
  prefix: "/api",
});

router
  .post("/auth/signup", authCtrl.postSignup) // 註冊
  .post("/auth/login", authCtrl.postLogin) // 登入
  .post("/auth/logout", authCtrl.postLogout) // 登出
  .get("/room_list", isLogin, roomListCtrl.getRoomList) // 首頁訊息列表
  .get("/private_detail", isLogin, privateChatCtrl.getPrivateDetail) // 取得單人聊天室訊息紀錄
  .post("/private_save_msg", isLogin, privateChatCtrl.savePrivateMsg) // 儲存單人聊天訊息
  .get("/group_detail", isLogin, groupChatCtrl.getGroupChatDetail) // 取得多人聊天室訊息紀錄
  .get("/user_info", isLogin, userInfoCtrl.getUserInfo) // 取得使用者資料
  .get("/search_by_name", isLogin, searchCtrl.searchByName) // 透過使用者名稱搜索
  .post("/create_group", isLogin, groupCtrl.createGroup)
  .get("/group_info", isLogin, groupCtrl.getGroupInfo)
  .post("/join_group", isLogin, groupCtrl.joinGroup);

module.exports = router;
