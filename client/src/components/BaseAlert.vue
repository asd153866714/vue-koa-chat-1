<template>
  <div class="alert-container">
    <v-alert
      v-show="isShow"
      type="error"
      class="mb-5 "
      dense
      outlined
      transition="scale-transition"
    >
      {{ message }}
    </v-alert>
  </div>
</template>
<script>
export default {
  name: "BaseAlert",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "error",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.alert-container {
  position: absolute;
  top: 10vh;
}
</style>
