import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Setting from "../views/Setting.vue";
import UserInfo from "../views/UserInfo.vue";
import RoomList from "../views/RoomList.vue";
import Add from "../views/Add.vue";
import AddSearch from "../views/AddSearch.vue";
import PrivateChat from "../views/PrivateChat.vue";
import News from "../views/News.vue";
import NewsDetail from "../views/NewsDetail.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: RoomList,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/room_list",
    component: RoomList,
  },
  {
    //加人或进群
    path: "/add",
    component: Add,
  },
  {
    //搜人
    path: "/add_search/user/:username",
    component: AddSearch,
  },
  {
    //搜群
    path: "/add_search/group/:groupname",
    component: AddSearch,
  },
  {
    path: "/setting",
    component: Setting,
  },
  {
    path: "/user_info/:user_id",
    component: UserInfo,
  },
  {
    //私聊
    path: "/private_chat/:user_id",
    component: PrivateChat,
  },
  {
    path: "/news",
    component: News,
  },
  {
    path: "/newsdetail",
    name: "newsdetail",
    component: NewsDetail,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router protect
router.beforeEach((to, from, next) => {
  console.log(localStorage);

  // 判斷是否有 token，是否登入
  if (localStorage.token) {
    // 判斷 token 是否過期
    if (localStorage.expire - new Date().getTime() > 0) {
      // 判斷目標路由是否為登入或註冊，避免二次登入
      if (to.path === "/login" || to.path === "/signup") {
        next("/");
      } else {
        next();
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expire");
      next("/login");
    }
  } else {
    if (to.path === "/login" || to.path === "/signup") {
      next();
    } else {
      next("/login");
    }
  }

  // if (!localStorage.token) {
  //   if (to.path === "/login" || to.path === "/signup") {
  //     next();
  //   } else {
  //     next("/login");
  //   }
  // } else {
  //   if (to.path === "/login" || to.path === "/signup") {
  //     next("/message");
  //   } else {
  //     next();
  //   }
  // }

  // 判斷前端 token 是否過期
  // if (localStorage.expire - new Date().getTime() > 0) {
  //   console.log("aslkdajlkdlksajl");
  //   next();
  // } else {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userInfo");
  //   localStorage.removeItem("expire");
  //   next("/login");
  // }
});

export default router;
