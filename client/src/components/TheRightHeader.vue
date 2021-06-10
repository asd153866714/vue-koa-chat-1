<template>
  <v-toolbar class="elevation-0" color="blue">
    <v-btn icon class="hidden-md-and-up" color="white" @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <v-toolbar-title class="white--text">
      {{ roomName }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- <v-btn icon color="white">
      <v-icon>mdi-magnify</v-icon>
    </v-btn> -->
    <!-- <v-btn v-show="roomName" icon color="white">
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn> -->
  </v-toolbar>
</template>
<script>
export default {
  name: "TheRightHeader",
  props: {
    roomName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
  },
};
</script>
