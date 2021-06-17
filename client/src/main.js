import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import socket from "./socket.js";
import BaseAlert from "./components/BaseAlert.vue";
import MessageBox from "./components/MessageBox.vue";
import ChatItem from "./components/ChatItem.vue";
import TheLeftHeader from "./components/TheLeftHeader.vue";
import TheRightHeader from "./components/TheRightHeader.vue";
import BaseDialog from "./components/BaseDialog.vue";
import LeftRoomList from "./components/LeftRoomList.vue";

Vue.config.productionTip = false;

Vue.component("the-left-header", TheLeftHeader);
Vue.component("the-right-header", TheRightHeader);
Vue.component("base-alert", BaseAlert);
Vue.component("message-box", MessageBox);
Vue.component("chat-item", ChatItem);
Vue.component("base-dialog", BaseDialog);
Vue.component("left-room-list", LeftRoomList);

// Vue.use(
//   new VueSocketIO({
//     debug: true,
//     connection: SocketIO("http://localhost:3000"), //options object is Optional
//     vuex: {
//       store,
//       actionPrefix: "SOCKET_",
//       mutationPrefix: "SOCKET_",
//     },
//   })
// );

Vue.prototype.$socket = socket;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
