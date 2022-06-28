<template>
  <v-container class="grey lighten-3" style="height:100vh;">
    <v-row no-gutters style="height:100%;">
      <base-dialog
        :type="dialog.type"
        :show="dialog.show"
        @closeDialog="closeDialog"
        @updateRoomList="getRoomList"
        @updateDialogStatus="updateDialogStatus"
      ></base-dialog>

      <v-col cols="12" md="4" :class="leftStyle" style="height:100%">
        <v-card
          style="height:100%; display: flex; flex-direction: column;"
          outlined
          tile
        >
          <the-left-header
            @updateSearchStatus="updateSearchStatus"
            @updateDialogStatus="updateDialogStatus"
          ></the-left-header>
          <left-room-list
            :isSearching="isSearching"
            :searchResult="searchResult"
          ></left-room-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" :class="rightStyle" style="height:100%;">
        <v-card class="chat-card" style="height:100%;" outlined tile>
          <the-right-header :roomName="groupInfoGetter.name"></the-right-header>
          <div class="msg-list" ref="messages">
            <v-list subheader>
              <v-list-item
                v-for="item in groupChatDetail"
                :key="item._id"
                class="d-flex"
              >
                <v-list-item-avatar
                  v-if="!item.fromSys"
                  :color="item.from.avatarColor"
                  size="50"
                  class="align-self-start"
                >
                  <span class="white--text title">
                    {{ item.from.avatarName }}
                  </span>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    v-if="!item.fromSys"
                    class="font-weight-bold mb-2"
                    >{{ item.from.name }}</v-list-item-title
                  >
                  <v-card color="rounded-xl rounded-tl-0" outlined>
                    <v-card-text
                      class="text-body-1 black--text font-weight-regular"
                    >
                      {{ item.message }}
                    </v-card-text>
                  </v-card>
                </v-list-item-content>

                <v-list-item-action class="align-self-end">
                  <v-list-item-action-text
                    v-text="item.time"
                  ></v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>

          <v-form
            v-if="isGroupMemberGetter"
            class="input-form blue-grey lighten-5 pa-5"
          >
            <v-textarea
              outlined
              class="input-textarea"
              name="input-7-4"
              label="textarea"
              hide-details="auto"
              rows="1"
              prepend-icon="mdi-paperclip"
              append-outer-icon="mdi-send"
              @click:prepend="uploadFile"
              @click:append-outer="sendMessage"
              @keydown.enter.exact.prevent="sendMessage"
              v-model="inputMsg"
            ></v-textarea>
          </v-form>
          <div v-else class="pa-5">
            <v-btn block color="secondary" @click="joinGroup">
              Join Group
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { toNormalTime } from "../utils/transformTime";
import TheRightHeader from "../components/TheRightHeader.vue";
import LeftRoomList from "../components/LeftRoomList.vue";

export default {
  components: { TheRightHeader, LeftRoomList },
  // sockets: {
  //   connect: function() {
  //     console.log("socket to notification channel connected");
  //   },
  // },
  data() {
    return {
      isEnterChat: true,
      roomList: [],
      groupChatDetail: [],
      inputMsg: "",
      fromUserInfo: {},
      toGroupInfo: {},
      toUserInfo: {},
      searchKeyword: "",
      isSearching: false,
      dialog: {
        show: false,
        type: "",
        title: "",
        content: "",
      },
    };
  },
  watch: {
    // $route(to, from) {
    //   console.log("WATCH route change", from, to);
    //   this.getGroupMsg(to.params.group_id);
    //   this.$store.dispatch("groupInfoAction", to.params.group_id);
    // },
    searchResult: function(val) {
      console.log("WWwatch:", val);
    },
  },
  computed: {
    leftStyle() {
      return this.isEnterChat === true ? "hidden-sm-and-down" : "";
    },
    rightStyle() {
      return this.isEnterChat !== true ? "hidden-sm-and-down" : "";
    },
    ...mapGetters(["groupInfoGetter", "roomListGetter", "isGroupMemberGetter"]),
    ...mapGetters({
      searchResult: "searchResultGetter",
    }),
  },
  methods: {
    getRoomList() {
      this.$store.dispatch("roomListAction");
    },
    updateSearchStatus(val) {
      this.searchKeyword = val;
      this.isSearching = val !== null && val !== "" ? true : false;
      console.log("isSearching:", this.isSearching);
      console.log("searchKeyword:", this.searchKeyword);
      if (this.isSearching == true) {
        // this.findPeople(val);
        this.$store.dispatch("searchResultAction", val);
      }
    },
    enterChat(type, chatId) {
      let path;
      this.isSearching = false;
      this.searchKeyword = [];
      if (type === "group") {
        path = `/group_chat/${chatId}`;
      } else if (type === "private") {
        path = `/private_chat/${chatId}`;
      }
      if (path === this.$route.path) return;
      this.$router.push({ path: path });
    },
    updateDialogStatus(data) {
      console.log("updateDialogStatus:", data);
      // this.dialog = data;
      this.dialog.show = true;
      this.dialog.type = data;
      console.log(this.dialog);
    },
    closeDialog() {
      this.dialog.show = false;
    },
    // 取得群組訊息紀錄
    async getGroupMsg(toGroupId) {
      const token = localStorage.getItem("token");
      axios
        .get(`${process.env.VUE_APP_API}/api/group_detail`, {
          params: {
            toGroupId: toGroupId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("group msgs from server:", res.data);
            this.groupChatDetail = res.data.groupChatDetail;
            if (this.groupChatDetail.length == 0) return;
            this.groupChatDetail.forEach((element) => {
              element.time = toNormalTime(element.time);
              // element.message = element.message.split(":")[1];
            });
            console.log("GroupDetails: ", this.groupChatDetail);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 傳送訊息的事件
    sendMessage() {
      console.log("sendMessage");
      if (this.inputMsg.trim() == "") return;
      let data = {
        from: this.fromUserInfo.id,
        to: this.toGroupInfo.groupId,
        message: this.inputMsg,
        time: Date.parse(new Date()),
      };

      this.sendMsgBySocket(data);
      // this.saveMsgByDB(data);

      console.log("send Message:", data);
    },
    // 透過 socket.io 傳送訊息
    sendMsgBySocket(data) {
      this.$socket.emit("sendGroupMsg", data);
      console.log("sendGroupMsg");
      this.inputMsg = "";
    },
    // 資料庫儲存訊息
    saveMsgByDB(data) {
      const token = localStorage.getItem("token");
      axios
        .post("http://localhost:3000/api/private_save_msg", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          this.inputMsg = "";
          data.avatarColor = this.fromUserInfo.avatarColor;
          data.time = toNormalTime(data.time);
          this.$store.dispatch("roomListAction");
          console.log("save1");
        });
    },
    // 接收 socket.io 訊息
    getMsgBySocket() {
      this.$socket.on("getGroupMsg", (data) => {
        console.log("CLIENT SOCKET getGroupMsg", data);
        if (data.to === this.toGroupInfo.groupId) {
          data.time = toNormalTime(data.time);
          this.groupChatDetail.push(data);
        }
        this.getRoomList();
      });
    },
    joinGroup() {
      const token = localStorage.getItem("token");
      let userId = this.fromUserInfo.id;
      let groupId = this.toGroupInfo.groupId;
      axios
        .post(
          `${process.env.VUE_APP_API}/api/join_group`,
          {
            userId: userId,
            groupId: groupId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log("CLIENT join group res:", res.data);
            // 重新取得 group info 更新狀態
            this.$store.dispatch("groupInfoAction", res.data.joinGroupId);
            // 讓 server 端的 socket join 該群組，才能收到加入的訊息並更新 room list
            this.$socket.emit("joinGroup", res.data.joinGroupId);
            // 送出使用者加入群組的通知訊息到該群組
            let data = {
              to: res.data.joinGroupId,
              message: `${this.fromUserInfo.name}已加入群組`,
              time: Date.parse(new Date()),
              fromSys: true,
            };
            this.$socket.emit("sendGroupMsg", data);
          }
        });
    },
    updateSocketId(userId) {
      console.log("updateSocketId");
      this.$socket.emit("update", userId);
    },
    uploadFile() {
      console.log("test");
    },
    scrollToBottom() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    },
  },
  created() {},
  mounted() {
    console.log("MOUINETETETD");
    this.toGroupInfo.groupId = this.$route.params.group_id;
    this.fromUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getRoomList();
    this.getGroupMsg(this.$route.params.group_id);
    this.getMsgBySocket();
    this.updateSocketId(this.fromUserInfo.id);
    this.$store.dispatch("groupInfoAction", this.toGroupInfo.groupId);
    // this.$store.dispatch("roomListAction");
    // this.$socket.emit("joined", this.fromUserInfo.id);
  },
  updated() {
    this.scrollToBottom();
  },
};
</script>
<style lang="scss" scoped>
.chat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  header {
    flex: 0;
  }
  .msg-list {
    flex: 1;
    overflow-y: scroll;
  }
  .input-form {
    flex: 0;
    width: 100%;
  }
}
</style>
