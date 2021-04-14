<template>
  <div class="chat-item">
    <div v-if="!me" class="otherchat">
      <!-- <a :href="href" ><img :src="img" alt="" class="img"></a> -->
      <the-avatar :username="name" class="img"></the-avatar>
      <!-- <img :src="img" alt="" class="img" @click="lookInfo" /> -->
      <div class="nt">
        <span v-if="name">{{ name }}</span
        ><span v-if="time">{{ time }}</span>
      </div>
      <div class="msg">{{ msg }}</div>
    </div>

    <div v-if="me" class="mychat">
      <!-- <a :href="href"><img :src="img" alt="" class="img"></a> -->
      <the-avatar :username="name" class="img" @click="lookInfo"></the-avatar>
      <!-- <img :src="img" alt="" class="img" @click="lookInfo" /> -->
      <div class="nt">
        <span v-if="name">{{ name }}</span>
        <span v-if="time">{{ time }}</span>
      </div>
      <div class="msg">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat-item",
  props: ["me", "name", "img", "msg", "time", "href"],
  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    lookInfo() {
      console.log("href", this.href);
      this.$router.push(`/user_info/${this.href}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-item {
  width: 100%;
  margin: 0.7rem 0;
  // .otherchat {
  //   width: 100%;
  //   position: relative;
  //   .img {
  //     width: 0.6rem;
  //     height: 0.6rem;
  //     border-radius: 50%;
  //     position: absolute;
  //     top: 50%;
  //     left: 0.2rem;
  //     transform: translateY(-50%);
  //     cursor: pointer;
  //   }
  //   .nt {
  //     font-size: 0.2rem;
  //     left: 1rem;
  //     top: -0.4rem;
  //     position: absolute;
  //     color: #686868;
  //     span {
  //       padding-right: 0.1rem;
  //     }
  //     span:nth-child(2) {
  //       font-size: 0.1rem;
  //     }
  //   }
  //   .msg {
  //     float: left;
  //     max-width: 60%;
  //     // margin-top: 0.2rem;
  //     margin-left: 1rem;
  //     padding: 0.12rem;
  //     border-radius: 0.1rem;
  //     font-size: 0.24rem;
  //     line-height: 0.34rem;
  //     background-color: #fff;
  //   }
  // }
  .mychat {
    width: 100%;
    display: inline-block;
    position: relative;
    margin-top: 1.5%;
    .img {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0.2rem;
      transform: translateY(-50%);
    }
    .nt {
      font-size: 0.2rem;
      left: 4rem;
      top: -1.5rem;
      position: absolute;
      color: #686868;
      span {
        padding-left: 0.3rem;
      }
      span:nth-child(1) {
        color:  #686868;
        font-size: 1rem;
        font-weight: 700;
      }
    }
    .msg {
      float: left;
      
      max-width: 60%;
      margin-left:4.5rem;
      padding: 1rem;
      border-radius: 0.1rem;
      font-size: 0.3rem;
      line-height: 0.34rem;
      background-color: #4971a7;
      color: #fff;
    }
  }
  
}
</style>
