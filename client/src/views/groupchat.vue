<template>
    <div class="wrapper">
        <the-header
            goback="true"
            userInfo="true"
            :chatTitle="groupchat"
        ></the-header>
        <ul>
      <li v-for="item in privateDetail" :key="item.id">
        <chat-item
          v-if="fromUserInfo.user_id === item.from_user"
          :href="item.from_user"
          :img="item.avator"
          me="true"
          :msg="item.message"
          :name="item.name"
          :time="item.time"
        ></chat-item>
        <chat-item
          v-else
          :img="item.avator"
          :msg="item.message"
          :href="item.from_user"
          :name="item.name"
          :time="item.time"
        ></chat-item>
      </li>
    </ul>
    <div class="input-msg">
      <textarea
        v-model="inputMsg"
        @keydown.enter.prevent="sendMessage"
        ref="message"
      ></textarea>
      <p class="btn" :class="{ enable: inputMsg != '' }" @click="sendMessage">
        {{ btnInfo }}
      </p>
    </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { toNormalTime } from "../utils/transformTime";
const token = localStorage.getItem("token");

export default {
  components: {},
  sockets: {
    connect: function() {
      console.log("socket to notification channel connected");
    },
  },
  data() {
    return {
      inputMsg: "",
      privateDetail: [], //私聊相关
      toUserInfo: {
        //被私聊者
        to_user: "",
        avator: "",
        sex: "",
        place: "",
        status: "",
      },
      isMyFriend: false, //他是否是我的好友
      isHisFriend: false, //我是否是他的好友
      fromUserInfo: {}, //用户自己
      btnInfo: "發送",
    };
  },
  computed: {
    ...mapGetters(["someOneInfoGetter"]),
  },
  watch: {
    privateDetail() {
      this.refresh();
    },
  },
  methods: {
    //获取数据库的消息
    getPrivateMsg() {
      axios
        .get("http://localhost:3000/api/private_detail", {
          params: {
            to_user: this.toUserInfo.to_user,
            // from_user: this.fromUserInfo.user_id
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          console.log("msgList", res.data.privateDetail);
          if (res.status === 200) {
            this.privateDetail = res.data.privateDetail;
            if (this.privateDetail.length == 0) return;
            this.privateDetail.forEach((element) => {
              element.time = toNormalTime(element.time);
              // element.message = element.message.split(":")[1];
            });
          }
        })
        .catch((err) => {
          console.log(err);
          // const errorMsg = err.response.data.error;
          // this.$message({
          //   message: errorMsg,
          //   type: "error",
          // });
        });
    },
    //发送信息
    sendMessage() {
      if (this.inputMsg.trim() == "") return;
      // if (!this.isMyFriend) {
      //   console.log("isnotMyFriend");
      //   // this.$message({
      //   //   message: "ta不是您的好友，请先加ta为好友",
      //   //   type: "error",
      //   // });
      //   return;
      // }
      // if (!this.isHisFriend) {
      //   console.log("isnoHisFriend");
      //   // this.$message({
      //   //   message: "您不是ta的好友，请先加ta为好友",
      //   //   type: "error",
      //   // });
      //   return;
      // }
      this.sendMsgBySocket();
      this.saveMsgByDB();
    },
    //用socket发消息
    sendMsgBySocket() {
      const data = {
        from_user: this.fromUserInfo.user_id, //自己的id
        to_user: this.toUserInfo.to_user, //对方id
        name: this.fromUserInfo.name, //自己的昵称
        avator: this.fromUserInfo.avator, //自己的头像
        message: this.inputMsg, //消息内容
        type: "private",
        status: "1", //是否在线 0为不在线 1为在线
        time: Date.parse(new Date()) / 1000, //时间
      };
      // socket.emit("sendPrivateMsg", data);
      this.$socket.emit("sendPrivateMsg", data);
      this.$store.commit("updateListMutation", data);
    },
    //用数据库存消息
    saveMsgByDB() {
      const data = {
        from_user: this.fromUserInfo.user_id, //自己的id
        to_user: this.toUserInfo.to_user, //对方的id
        name: this.fromUserInfo.name, //自己的昵称
        avator: this.fromUserInfo.avator, //自己的头像
        message: this.inputMsg, //消息内容
        status: "1", //是否在线 0为不在线 1为在线
        time: Date.parse(new Date()) / 1000, //时间
      };
      // 存此条私聊信息到数据库
      axios
        .post("http://localhost:3000/api/private_save_msg", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          this.inputMsg = "";
          // 存此条私聊信息到本地
          data.time = toNormalTime(data.time);
          console.log("saveMsgByDBdata", data);
          this.privateDetail.push(data);
        });
    },
    // 获取socket消息
    getMsgBySocket() {
      // this.sockets.removeAllListeners("getPrivateMsg");
      this.sockets.subscribe("getPrivateMsg", (data) => {
        console.log("聊天内获取私聊消息AAAAAAAAAAAAAAA", data);
        this.privateDetail.push(data);

        //如果收到的soket信息不是发给自己的 放弃这条soket 没必要了 因为私聊是点对点发送的
        // if(data.to_user != this.fromUserInfo.user_id) return
        //如果收到的soket信息不是来自当前聊天者 写入首页信息列表 并return
        // console.log(data.from_user, '!=', this.toUserInfo.to_user)
        // 	//soket信息不是来自当前聊天者 vuex添加此条信息 有未读提示
        if (data.from_user != this.toUserInfo.to_user) {
          console.log(data, "updateListMutationdata");
          data.chatOfNow = false;
          this.$store.commit("updateListMutation", data);
          return;
        } else {
          //soket信息来自当前聊天者 vuex添加此条信息 没未读提示
          data.chatOfNow = true;
          this.$store.commit("updateListMutation", data);
        }
        //本地添加此条信息
        // this.privateDetail.push(data);
      });
    },
    // 查询此用户与我的关系
    isFriend() {
      axios
        .get("/api/v1/is_friend", {
          params: {
            // user_id: this.fromUserInfo.user_id,
            other_user_id: this.toUserInfo.to_user,
          },
        })
        .then((res) => {
          this.isMyFriend =
            res.data.data.isMyFriend.length !== 0 ? true : false;
          this.isHisFriend =
            res.data.data.isHisFriend.length !== 0 ? true : false;
        })
        .catch((err) => {
          console.log(err);
          // const errorMsg = err.response.data.error;
          // this.$message({
          //   message: errorMsg,
          //   type: "error",
          // });
        });
    },
    //将未读信息归零
    resetUnred() {
      this.$store.commit("resetUnredMutation", this.toUserInfo.to_user);
    },
    // 消息置底
    refresh() {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight + 10000);
      }, 0);
    },
  },
  mounted() {
    this.toUserInfo.to_user = this.$route.params.user_id;
    this.fromUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    // this.isFriend();
    // this.resetUnred();
    this.getPrivateMsg();
    this.getMsgBySocket();
    this.$store.dispatch("someOneInfoAction", this.toUserInfo.to_user);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/chat.scss";
</style>
