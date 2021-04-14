import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import Header from "./components/TheHeader.vue";
import Footer from "./components/TheFooter.vue";
import Message from "./components/Message.vue";
import MessageBox from "./components/MessageBox.vue";
import ChatItem from "./components/ChatItem.vue";
import Avatar from "./components/TheAvatar.vue";


Vue.config.productionTip = false;

Vue.component("the-header", Header);
Vue.component("the-footer", Footer);
Vue.component("message", Message);
Vue.component("message-box", MessageBox);
Vue.component("chat-item", ChatItem);
Vue.component("the-avatar", Avatar);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://localhost:3000"), //options object is Optional
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
