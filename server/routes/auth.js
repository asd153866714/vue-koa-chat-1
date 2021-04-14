const Router = require("koa-router");

const authCtrl = require("../controllers/auth");
const userInfoCtrl = require("../controllers/userInfo");
// const msgListCtrl = require("../controllers/msgList");
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
  // .get("/message_list", isLogin, msgListCtrl.msgList) // 首頁訊息列表
  .get("/private_detail", isLogin, privateChatCtrl.getPrivateDetail) // 获取私聊相关内容
  .post("/private_save_msg", isLogin, privateChatCtrl.savePrivateMsg) //保存私聊信息
  .get("/user_info", isLogin, userInfoCtrl.getUserInfo) // 获取用户资料
  // .get("/is_friend", isLogin, userInfoCtrl.isFriend) // 是否是好友
  // .post("/be_friend", isLogin, userInfoCtrl.agreeBeFriend) // 加为好友
  // .delete("/del_friend", isLogin, userInfoCtrl.delFriend) // 删除好友
  // .put("/shield_friend", isLogin, userInfoCtrl.shieldFriend) // 屏蔽好友
  // .put("/editor_remark", isLogin, userInfoCtrl.editorRemark) // 修改备注
  // .put("/editor_info", isLogin, userInfoCtrl.editorInfo) // 修改我的信息
  .get("/find_people", isLogin, userInfoCtrl.findUIByName); //通过用户名搜索加人，此接口返回用户信息
// .get("/get_newfriends", isLogin, friendsCtrl.getNewFriends) // 获取新朋友通知
// .post("/insert_newfriends", isLogin, friendsCtrl.insertNewFriends) // 添加我的新好友通知
// .put("/update_newfriends", isLogin, friendsCtrl.updateNewFriends); // 更新 新好友状态  是否已被同意加好友

module.exports = router;
