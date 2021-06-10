<template>
  <v-list
    v-if="!isSearching && roomList"
    one-line
    subheader
    style="flex:1; overflow-y: scroll;"
  >
    <v-list-item
      v-for="item in roomListGetter"
      :key="item._id"
      @click="enterChat(item.type, item.roomInfo._id)"
      link
    >
      <v-list-item-avatar :color="item.roomInfo.avatarColor" size="50">
        <span class="white--text title">
          {{ item.roomInfo.avatarName }}
        </span>
      </v-list-item-avatar>

      <!-- <v-list-item-avatar
        v-if="item.type == `group`"
        :color="item.withGroupId.avatarColor"
        size="50"
      >
        <span class="white--text title">
          {{ item.withGroupId.name }}
        </span>
      </v-list-item-avatar>
      <v-list-item-avatar
        v-if="item.type == `private`"
        :color="item.withUserId.avatarColor"
        size="50"
      >
        <span class="white--text title">
          {{ item.withUserId.name }}
        </span>
      </v-list-item-avatar> -->

      <v-list-item-content>
        <v-list-item-title class="font-weight-bold mb-2">{{
          item.roomInfo.name
        }}</v-list-item-title>
        <v-list-item-subtitle>{{
          item.messageInfo.message
        }}</v-list-item-subtitle>
      </v-list-item-content>

      <!-- <v-list-item-content v-if="item.type == `group`">
        <v-list-item-title class="font-weight-bold mb-2">{{
          item.withGroupId.name
        }}</v-list-item-title>
        <v-list-item-subtitle>{{
          item.messageId.message
        }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content v-if="item.type == `private`">
        <v-list-item-title class="font-weight-bold mb-2">{{
          item.withUserId.name
        }}</v-list-item-title>
        <v-list-item-subtitle>{{
          item.messageId.message
        }}</v-list-item-subtitle>
      </v-list-item-content> -->

      <v-list-item-action>
        <v-list-item-action-text
          v-text="item.messageInfo.time"
        ></v-list-item-action-text>
        <v-badge color="" content="" inline> </v-badge>
      </v-list-item-action>
    </v-list-item>
  </v-list>
  <v-list v-else-if="searchResult.length <= 0">
    <v-list-item>
      <div class="text-body" v-text="`Not Found`"></div>
    </v-list-item>
  </v-list>
  <v-list v-else one-line subheader style="flex:1; overflow-y: scroll;">
    <v-list-item
      v-for="item in searchResult"
      :key="item._id"
      link
      @click="enterChat(item.type, item._id)"
    >
      <v-list-item-avatar :color="item.avatarColor" size="50">
        <span class="white--text title">
          {{ item.avatarName }}
        </span>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="font-weight-bold mb-2">{{
          item.name
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["isSearching"],
  data() {
    return {
      roomList: [],
    };
  },
  computed: {
    ...mapGetters(["groupInfoGetter", "roomListGetter"]),
    ...mapGetters({
      searchResult: "searchResultGetter",
    }),
  },
  methods: {
    enterChat(type, chatId) {
      let path;
      // this.isSearching = false;
      this.searchKeyword = [];
      if (type === "group") {
        path = `/group_chat/${chatId}`;
      } else if (type === "private") {
        path = `/private_chat/${chatId}`;
      }
      if (path === this.$route.path) return;
      this.$router.push({ path: path });
    },
  },
};
</script>
