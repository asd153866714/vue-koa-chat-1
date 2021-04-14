<template>
  <!-- 我 -->
  <div class="wrapper">
    <message-box
      :messageBoxEvent="this.messageBox.messageBoxEvent"
      :visible="this.messageBox.visible"
      :hasCancel="this.messageBox.hasCancel"
      @cancel="cancel"
      @confirm="confirm"
    >
      <p slot="content">{{ this.messageBox.message }}</p>
    </message-box>
    <the-header :currentTab="currentTab"></the-header>
    <div class="main">
      <ul class="content">
        <li class="info" @click="goInfo">
          <!-- <img :src="userInfo.avator" alt="" /> -->
          <the-avatar :username="userInfo.name"></the-avatar>
          <span>{{ userInfo.name }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-right"></use>
          </svg>
        </li>
        <!-- <img :src="userInfo.avator" alt="">
                    <p>用户名：{{userInfo.name}}</p>
                    <p>性别：{{userInfo.sex}}</p>
                    <p>来自：{{userInfo.place}}</p> -->
      </ul>
      <div class="action" @click="logout">
        <span class="logout">登出</span>
      </div>
    </div>

    <the-footer :currentTab="currentTab"></the-footer>
  </div>
</template>

<script>
import TheAvatar from "../components/TheAvatar.vue";
export default {
  name: "setting",
  data() {
    return {
      currentTab: 4,
      messageBox: {
        visible: false,
        message: "", //弹窗内容
        hasCancel: true, //弹窗是否有取消键
        messageBoxEvent: "", //弹窗事件名称
      },
      userInfo: {},
    };
  },
  components: { TheAvatar },
  methods: {
    goInfo() {
      const path = `/user_info/${this.userInfo.id}`;
      this.$router.push(path);
    },
    logout() {
      this.messageBox.messageBoxEvent = "logOut";
      this.messageBox.visible = true;
      this.messageBox.message = "確定退出？";
    },
    cancel() {
      this.messageBox.visible = false;
    },
    confirm(value) {
      if (value === "logOut") {
        //登出
        // socket.emit("logout", this.userInfo.user_id);
        this.$socket.emit("logout", this.userInfo.id);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        let self = this;
        setTimeout(function() {
          self.$router.push({
            path: "/login",
          });
        }, 1000);
      }
    },
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  // width: 50%;
  // display: flex;
  // align-items: center;
  // justify-content: center;

  // padding-top: 1rem;
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: space-between;
    padding: 0.5rem;
    overflow-y: scroll;
    ul {
      flex: 2;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      li {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 20%;
      }
    }
    .action {
      flex: 1;
      position: relative;
      // bottom: 10%;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        font-size: 0.75rem;
        padding: 0.25rem 0;
        width: 50%;
        cursor: pointer;
      }
      .logout {
        background-color: #4290f7;
        color: #fff;
      }
    }
  }
  // ul {
  //   position: relative;
  //   li {
  //     background-color: #fff;
  //     color: #333;
  //     list-style-type: none;
  //     display: flex;
  //     display: -webkit-flex;
  //     padding: 0.16rem;
  //   }
  //   .info {
  //     img {
  //       width: 0.8rem;
  //       height: 0.8rem;
  //       margin-left: 0.2rem;
  //       line-height: 0.46rem;
  //     }
  //     span {
  //       font-size: 0.28rem;
  //       position: absolute;
  //       left: 1.3rem;
  //       top: 50%;
  //       transform: translateY(-50%);
  //       -moz-transform: translateY(-50%); //Mozilla内核浏览器：firefox3.5+
  //       -webkit-transform: translateY(
  //         -50%
  //       ); //Webkit内核浏览器：Safari and Chrome
  //       -o-transform: translateY(-50%); //Opera
  //       -ms-transform: translateY(-50%); //IE9
  //     }
  //     .icon {
  //       font-size: 0.4rem;
  //       position: absolute;
  //       right: 0.2rem;
  //       top: 50%;
  //       transform: translateY(-50%);
  //       -moz-transform: translateY(-50%); //Mozilla内核浏览器：firefox3.5+
  //       -webkit-transform: translateY(
  //         -50%
  //       ); //Webkit内核浏览器：Safari and Chrome
  //       -o-transform: translateY(-50%); //Opera
  //       -ms-transform: translateY(-50%); //IE9
  //     }
  //   }
  // }
  // .action {
  //   position: absolute;
  //   width: 100%;
  //   top: 7.6rem;
  //   text-align: center;
  //   span {
  //     display: inline-block;
  //     font-size: 0.26rem;
  //     line-height: 0.46rem;
  //     padding: 0.16rem 0;
  //     width: 40%;
  //     cursor: pointer;
  //   }
  //   .logout {
  //     background-color: #4290f7;
  //     color: #fff;
  //   }
  // }
  // .content {
  //   left: 50%;
  //   transform: translateX(-50%);
  //   position: absolute;
  //   img {
  //     width: 2rem;
  //     height: 2rem;
  //     border-radius: 50%;
  //     margin: 2rem auto;
  //   }
  //   p {
  //     font-size: 0.32rem;
  //     line-height: 0.8rem;
  //     color: #4290F7;
  //   }
  // }
}
</style>
