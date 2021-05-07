<template>
  <!--  注册 -->
  <div class="login">
    <message
      :type="this.message.type"
      :message="this.message.message"
    ></message>
    <message-box
      :visible="this.messageBox.visible"
      :messageBoxEvent="this.messageBox.messageBoxEvent"
      @confirm="confirm"
      :hasCancel="false"
    >
      <p slot="content">{{ this.messageBox.message }}</p>
    </message-box>
    <div class="wrapper fadeInDown">
      <div id="formContent">
        <router-link to="/login">
          <h2 class="inactive">登入</h2>
        </router-link>
        <h2 class="active">註冊</h2>

        <div class="fadeIn first">
          <img src="../assets/icon.svg" id="icon" alt="User Icon" />
        </div>

        <form>
          <input
            type="text"
            class="fadeIn second"
            v-model="name"
            placeholder="帳號"
          />
          <input
            type="password"
            class="fadeIn third"
            v-model="password"
            placeholder="密碼"
          />
          <input
            type="password"
            class="fadeIn fifth"
            v-model="rpassword"
            placeholder="密碼確認"
          />
          <input
            type="button"
            @click="register"
            class="fadeIn fourth"
            value="註冊"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  sockets: {
    connect: function() {
      console.log("socket to notification channel connected");
    },
  },
  data() {
    return {
      name: "",
      password: "",
      rpassword: "",
      message: {
        type: "",
        message: "",
      },
      messageBox: {
        visible: false,
        message: "", //弹窗内容
        hasCancel: true, //弹窗是否有取消键
        messageBoxEvent: "", // 弹窗事件名称
      },
    };
  },
  methods: {
    register() {
      if (this.name !== "" && this.password !== "" && this.rpassword !== "") {
        if (this.password == this.rpassword){
                 axios
          .post("http://localhost:3000/api/auth/signup", {
            name: this.name,
            password: this.password,
          })
          
          .then((res) => {
            console.log(res);
            if (res) {
              if (res.status === 201) {
                //弹窗
                this.messageBox.messageBoxEvent = "register";
                this.messageBox.visible = true;
                this.messageBox.message = "您已註冊成功";
              } else {
                // this.$message({
                //   message: res.data.message,
                //   type: "error",
                // });
              }
            }
          })
          .catch((err) => {
            console.log(err);
            console.log(err.response);
            this.message.type = "error";
            this.message.message = err.response.data;
            // this.$message({
            //   message: "服务器出错啦",
            //   type: "error",
            // });
          });
      }
      else{
        this.messageBox.messageBoxEvent = "warn";
        this.messageBox.visible = true;
        this.messageBox.message = "確認密碼錯誤";
      }
    }
  else {
        // const message = this.name === "" ? "请输入用户名" : "请输入密码";
        // this.$message({
        //   message: message,
        //   type: "warn",
        // });
      }
    },
    confirm(value) {
      if (value === "register") {
        this.messageBox.visible = false;
        this.$router.push("/login");
      }
      if (value === "warn"){
        this.messageBox.visible = false;
        this.$router.push("/signup");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/login.scss";
</style>
