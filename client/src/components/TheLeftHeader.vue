<template>
  <v-toolbar class="elevation-0" color="blue" style="flex:0;">
    <v-text-field
      hide-details
      prepend-inner-icon="mdi-magnify"
      solo
      v-model="searchKeyword"
      clearable
    ></v-text-field>

    <!-- <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon> -->
    <v-menu left bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="white">mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="onClick(item.type)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
// import BaseDialog from "./BaseDialog.vue";
export default {
  name: "TheLeftHeader",
  props: [],
  data() {
    return {
      items: [
        { title: "新增群組", type: "newGroup" },
        { title: "設定", type: "setting" },
      ],
      dialog: false,
      searchKeyword: "",
    };
  },
  watch: {
    searchKeyword(val) {
      this.$emit("updateSearchStatus", val);
      console.log("Emit: ", val);
    },
  },
  methods: {
    onClick(data) {
      console.log("click option:", data);
      this.$emit("updateDialogStatus", data);
    },
    onSearch() {},
  },
  updated() {},
};
</script>
