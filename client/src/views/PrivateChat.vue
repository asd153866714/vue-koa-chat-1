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

      <v-col cols="12" md="4" class="hidden-sm-and-down" style="height:100%">
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
      <v-col cols="12" md="8" style="height:100%;">
        <v-card class="chat-card" style="height:100%;" outlined tile>
          <the-right-header
            :roomName="someOneInfoGetter.name"
          ></the-right-header>
          <div class="msg-list" ref="messages">
            <v-list subheader>
              <v-list-item
                v-for="item in privateChatDetail"
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
                  <v-card
                    color="light-blue lighten-5 rounded-xl rounded-tl-0"
                    outlined
                  >
                    <v-card-text class="text-body-1">
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

          <v-form class="input-form blue-grey lighten-5 pa-5">
            <v-textarea
              outlined
              class="input-textarea"
              name="input-7-4"
              label="Outlined textarea"
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
export default {
  components: { TheRightHeader },
  sockets: {
    connect: function() {
      console.log("socket to notification channel connected");
    },
  },
  data() {
    return {
      roomList: [],
      privateChatDetail: [],
      inputMsg: "",
      fromUserInfo: {},
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
    searchResult: function(val) {
      console.log("WWwatch:", val);
    },
  },
  computed: {
    ...mapGetters(["someOneInfoGetter", "roomListGetter"]),
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
    // 取得私聊紀錄
    async getPrivateMsg() {
      const token = localStorage.getItem("token");

      axios
        .get("http://localhost:3000/api/private_detail", {
          params: {
            toUserId: this.$route.params.user_id,
            // from_user: this.fromUserInfo.user_id
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("private msgs from server:", res.data);
            this.privateChatDetail = res.data.privateChatDetail;
            if (this.privateChatDetail.length == 0) return;
            this.privateChatDetail.forEach((element) => {
              element.time = toNormalTime(element.time);
              // element.message = element.message.split(":")[1];
            });
            console.log("PrivateDetails: ", this.privateChatDetail);
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
        to: this.toUserInfo.userId,
        message: this.inputMsg,
        time: Date.parse(new Date()),
      };

      this.sendMsgBySocket(data);

      console.log("send Message:", data);
    },
    // 透過 socket.io 傳送訊息
    sendMsgBySocket(data) {
      this.$socket.emit("sendPrivateMsg", data);
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
          // console.log("saveMsgByDBdata", data);
          // this.privateChatDetail.push(data);
          // this.getRoomList();
          this.$store.dispatch("roomListAction");
          console.log("save1");
        });
    },
    // 接收 socket.io 訊息
    getMsgBySocket() {
      this.$socket.on("getPrivateMsg", (data) => {
        console.log("sockets getPrivateMsg");
        if (data.from) {
          this.getRoomList();
          console.log(data);
          data.time = toNormalTime(data.time);
          this.privateChatDetail.push(data);
        } else {
          return;
        }
      });
    },
    updateSocketId(userId) {
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
  async mounted() {
    console.log("MOUINETETETD");
    this.toUserInfo.userId = this.$route.params.user_id;
    this.fromUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getPrivateMsg();
    this.getMsgBySocket();
    this.updateSocketId(this.fromUserInfo.id);
    this.$store.dispatch("someOneInfoAction", this.toUserInfo.userId);
    this.$store.dispatch("roomListAction");
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
