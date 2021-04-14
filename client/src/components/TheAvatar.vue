<template>
  <div class="user-avatar" :style="innerStyle">
    <span>{{ username[0] }}</span>
  </div>
</template>
<script>
export default {
  name: "Avatar",
  props: {
    username: {
      type: String,
      required: true,
      default: "",
    },
    size: {
      type: Number,
      default: 60,
    },
    borderRadius: {
      type: String,
      default: "50%",
    },
  },
  data() {
    return {
      color: "",
      defaultColors: [
        "#2ecc71", // emerald
        "#3498db", // peter river
        "#8e44ad", // wisteria
        "#e67e22", // carrot
        "#e74c3c", // alizarin
        "#1abc9c", // turquoise
        "#2c3e50", // midnight blue
      ],
    };
  },
  computed: {
    innerStyle() {
      return {
        "text-align": "center",
        width: `${this.size}px`,
        height: `${this.size}px`,
        "border-radius": this.borderRadius,
        // "line-height": 0.5,
        "background-color": this.color,
        color: "white",
        display: "inline-block",
      };
    },
  },
  methods: {
    createRandomColor() {
      let sum = 0;
      for (let i = 0; i < this.username.length; i += 1) {
        sum += this.username.charCodeAt(i);
      }
      this.color = this.defaultColors[sum % this.defaultColors.length];
    },
  },
  mounted() {
    this.createRandomColor();
  },
};
</script>
<style lang="scss" scoped>
.user-avatar {
  position: relative;
  font-size: 40px;
}
</style>
