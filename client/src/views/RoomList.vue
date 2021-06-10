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
      <v-col cols="12" md="4" style="height:100%">
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
      <v-col cols="12" md="8" class="hidden-sm-and-down" style="height:100%;">
        <v-card class="chat-card" style="height:100%;" outlined tile>
          <the-right-header></the-right-header>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "RoomList",
  data() {
    return {
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
  computed: {
    // ...mapGetters("roomListGetter"),
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
    // 接收 socket.io 訊息
    getMsgBySocket() {
      this.$socket.on("getGroupMsg", () => {
        this.getRoomList();
      });
      this.$socket.on("getPrivateMsg", () => {
        this.getRoomList();
      });
    },

    updateSocketId(userId) {
      console.log("updateSocketId");
      this.$socket.emit("update", userId);
    },
  },
  mounted() {
    this.fromUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.getRoomList();
    this.getMsgBySocket();
    this.updateSocketId(this.fromUserInfo.id);
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
    // position: absolute;
    width: 100%;
    // bottom: 0px;
    .input-text-field {
      // width: 100%;
    }
  }
}
</style>
