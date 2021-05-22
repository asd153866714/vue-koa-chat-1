const Router = require("koa-router");

const authCtrl = require("../controllers/auth");
const userInfoCtrl = require("../controllers/userInfo");
const roomListCtrl = require("../controllers/roomList");
const privateChatCtrl = require("../controllers/privateChat");
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
  .get("/user_info", isLogin, userInfoCtrl.getUserInfo) // 取得使用者資料
  // .get("/is_friend", isLogin, userInfoCtrl.isFriend) // 是否是好友
  // .post("/be_friend", isLogin, userInfoCtrl.agreeBeFriend) // 加为好友
  // .delete("/del_friend", isLogin, userInfoCtrl.delFriend) // 删除好友
  // .put("/shield_friend", isLogin, userInfoCtrl.shieldFriend) // 屏蔽好友
  // .put("/editor_remark", isLogin, userInfoCtrl.editorRemark) // 修改备注
  // .put("/editor_info", isLogin, userInfoCtrl.editorInfo) // 修改我的信息
  .get("/find_people", isLogin, userInfoCtrl.findUIByName); // 透過使用者名稱搜索

module.exports = router;
