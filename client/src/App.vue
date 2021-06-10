<template>
  <v-app>
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  sockets: {
    connect: function() {
      console.log("socket to notification channel connected");
    },
  },
  data: () => ({}),
  created() {
    // this.$socket.emit(
    //   "update",
    //   JSON.parse(localStorage.getItem("userInfo")).id
    // );
    // console.log("APP update socketid");
  },
};
</script>
