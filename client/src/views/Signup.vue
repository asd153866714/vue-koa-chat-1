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
            v-if="nameHasUse"
            type="text"
            class="fadeIn second"
            v-model="name"
            placeholder="帳號"
          />
          <input
            v-else
            style="color: red; border: 1px solid red"
            type="text"
            class="fadeIn second"
            v-model="name"
            placeholder="帳號"
          />
          <br />
          <label v-if="!nameHasUse" style="color: red; font-size:0.65rem;"
            >帳號名稱已被使用</label
          >
          <input
            v-if="isPassword"
            type="password"
            class="fadeIn third"
            v-model="password"
            placeholder="密碼"
            @keyup="validatePassword"
          />
          <input
            v-else
            style="color: red; border:1px solid red;"
            type="password"
            class="fadeIn third"
            v-model="password"
            placeholder="密碼"
            @keyup="validatePassword"
          />
          <br />
          <label v-if="isPassword" style="color: gray; font-size:0.65rem;">
            請混合使用 8 個字元以上的英文字母、數字</label
          >
          <label v-else style="color: red; font-size:0.65rem;"
            >請混合使用 8 個字元以上的英文字母、數字</label
          >
          <input
            v-if="passwordConfirm"
            type="password"
            class="fadeIn fifth"
            v-model="confirm_password"
            placeholder="密碼確認"
            @keyup="confirmPassword"
          />
          <input
            v-else
            type="password"
            class="fadeIn fifth"
            v-model="confirm_password"
            placeholder="密碼確認"
            @keyup="confirmPassword"
            style="color: red; border: 1px solid red"
          />
          <br />
          <label v-if="!passwordConfirm" style="color: red; font-size:0.65rem;"
            >確認密碼錯誤</label
          >
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
      isPassword: true,
      confirm_password: "",
      passwordConfirm: true,
      nameHasUse: true,
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
      if (
        this.name !== "" &&
        this.password !== "" &&
        this.confirm_password !== ""
      ) {
        if (this.isPassword == true && this.passwordConfirm == true) {
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
                  this.passwordConfirm = true;
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
              this.nameHasUse = false;
              // this.$message({
              //   message: "服务器出错啦",
              //   type: "error",
              // });
            });
        }
      } else {
        // const message = this.name === "" ? "请输入用户名" : "请输入密码";
        // this.$message({
        //   message: message,
        //   type: "warn",
        // });
      }
    },
    validatePassword() {
      let reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (this.password != "" && !reg.test(this.password)) {
        this.isPassword = false;
      } else {
        this.isPassword = true;
      }
    },
    confirmPassword() {
      if (this.password != this.confirm_password) {
        this.passwordConfirm = false;
      } else {
        this.passwordConfirm = true;
      }
    },
    confirm(value) {
      if (value === "register") {
        this.messageBox.visible = false;
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/login.scss";
</style>
