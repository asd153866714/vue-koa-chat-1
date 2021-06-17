<template>
  <div class="login">
    <message-box
      :visible="this.messageBox.visible"
      :messageBoxEvent="this.messageBox.messageBoxEvent"
      @confirm="confirm"
      :hasCancel="false"
    >
      <p slot="content">{{ this.messageBox.message }}</p>
    </message-box>

    <div class="wrapper fadeInDown">
      <base-alert
        :isShow="this.alert.isShow"
        :message="this.alert.message"
        :type="this.alert.type"
      ></base-alert>
      <div id="formContent">
        <h2 class="active">登入</h2>
        <router-link to="/signup">
          <h2 class="inactive">註冊</h2>
        </router-link>
        <div class="fadeIn first">
          <img src="../assets/icon.svg" id="icon" alt="User Icon" />
        </div>

        <form>
          <input
            type="text"
            class="fadeIn second"
            placeholder="帳號"
            v-model="name"
          />
          <input
            type="password"
            class="fadeIn third"
            placeholder="密碼"
            v-model="password"
          />
          <input
            type="button"
            @click="login"
            class="fadeIn fourth"
            value="登入"
          />
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import BaseAlert from "../components/BaseAlert.vue";
export default {
  name: "login",
  components: { BaseAlert },
  sockets: {
    connect: function() {
      console.log("socket to notification channel connected");
    },
    disconnect: function() {
      this.$socket.emit("disconnect");
    },
  },
  data() {
    return {
      name: "",
      password: "",
      alert: {
        isShow: false,
        type: "",
        message: "",
      },
      messageBox: {
        visible: false,
        message: "",
        hasCancel: true,
        messageBoxEvent: "",
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    showAlert(type, message) {
      this.alert = {
        isShow: true,
        type: type,
        message: message,
      };
      // 幾秒後自動關閉
      let self = this;
      console.log(self);
      window.setTimeout(function() {
        self.alert.isShow = false;
      }, 2000);
    },
    login() {
      if (this.name !== "" && this.password !== "") {
        axios
          .post(`${process.env.VUE_APP_API}/api/auth/login`, {
            name: this.name,
            password: this.password,
          })
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data);
              // 保存soket.io
              this.$socket.emit("login", res.data.userInfo.id);
              localStorage.setItem("token", res.data.token);
              localStorage.setItem(
                "userInfo",
                JSON.stringify(res.data.userInfo)
              );
              // 設置 token 時效，毫秒為單位
              localStorage.setItem("expire", res.data.expire);
              console.log(res.data.expire);
              // 談窗
              this.messageBox.messageBoxEvent = "login";
              this.messageBox.visible = true;
              this.messageBox.message = "您已登入成功";
            } else {
              this.showAlert("error", res.data.message);
            }
          })
          .catch((err) => {
            this.showAlert("error", err.response.data);
          });
      } else {
        this.showAlert("error", "帳號密碼不能為空白");
      }
    },
    confirm(value) {
      console.log("confirm", value);
      if (value === "login") {
        this.messageBox.visible = false;
        this.$router.push("/");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/login.scss";
</style>
