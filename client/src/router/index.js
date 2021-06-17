import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import RoomList from "../views/RoomList.vue";
import PrivateChat from "../views/PrivateChat.vue";
import GroupChat from "../views/GroupChat.vue";
import PageNotFound from "../views/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
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
    path: "/private_chat/:user_id",
    component: PrivateChat,
  },
  {
    path: "/group_chat/:group_id",
    component: GroupChat,
  },
  { path: "*", component: PageNotFound },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router protect
router.beforeEach((to, from, next) => {
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
