import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Setting from "../views/Setting.vue";
import UserInfo from "../views/UserInfo.vue";
import Message from "../views/Message.vue";
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
    component: Message,
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
    path: "/message",
    component: Message,
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
    path: '/newsdetail',
    name: 'newsdetail',
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
  if (!localStorage.token) {
    if (to.path === "/login" || to.path === "/signup") {
      next();
    } else {
      next("/login");
    }
  } else {
    if (to.path === "/login" || to.path === "/signup") {
      next("/message");
    } else {
      next();
    }
  }
});

export default router;
