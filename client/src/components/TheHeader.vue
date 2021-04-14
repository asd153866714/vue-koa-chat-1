<template>
  <div class="header">
    <svg v-show="goback" class="icon goback" aria-hidden="true" @click="goBack">
      <use xlink:href="#icon-back"></use>
    </svg>
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <svg
      v-show="currentTab === 1 || currentTab === 3"
      class="icon add"
      aria-hidden="true"
      @click="add"
    >
      <use xlink:href="#icon-add">123</use>
    </svg>
    <svg
      v-show="groupInfo"
      class="icon add"
      aria-hidden="true"
      @click="lookGroupInfo"
    >
      <use xlink:href="#icon-group_fill-copy"></use>
    </svg>
    <svg
      v-show="userInfo"
      class="icon add"
      aria-hidden="true"
      @click="lookUserInfo"
    >
      <use xlink:href="#icon-group_fill-copy"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: ["currentTab", "chatTitle", "goback", "groupInfo", "userInfo"],
  data() {
    return {};
  },
  computed: {
    title() {
      if (this.currentTab === 1) {
        return "消息";
      } else if (this.currentTab === 2) {
        return "新聞";
      } else if (this.currentTab === 3) {
        return "通訊錄";
      } else if (this.currentTab === 4) {
        return "我";
      } else if (this.currentTab === 5) {
        return "我的好友";
      } else {
        return this.chatTitle;
      }
    },
  },
  methods: {
    add() {
      this.$router.push("/add");
    },
    lookGroupInfo() {
      const path = `/group_info/${this.$route.params.group_id}`;
      this.$router.push(path);
    },
    lookUserInfo() {
      const path = `/user_info/${this.$route.params.user_id}`;
      this.$router.push(path);
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 5%;

  // line-height: 2rem;
  background: #1e90ff;
  color: white;
  font-size: 1rem;
  letter-spacing: 0.04rem;
  width: 100%;
  position: relative;
  top: 0;
  z-index: 9;
  .title {
    // background-color: red;
    display: flex;
    align-items: center;
    text-align: center;
    // line-height: 2.5rem;
  }
  .icon {
    position: absolute;
    right: 10%;
    top: 50%;
    font-size: 1rem;
    cursor: pointer;
    // top: 50%;
    transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
  }
  .add {
    right: 0.2rem;
  }
  .goback {
    left: 0.2rem;
  }
}
</style>
