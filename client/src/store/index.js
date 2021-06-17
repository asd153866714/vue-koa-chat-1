import Vue from "vue";
import Vuex from "vuex";
import router from "../router";
import axios from "axios";
import { toNormalTime } from "../utils/transformTime";

const token = localStorage.getItem("token");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    roomList: [],
    searchResult: [],
    groupInfo: {}, // 群組資訊
    isGroupMember: true,
    someOneInfo: {}, // 某個 user 的資訊
    myInfo: {}, // 我的個人資訊
  },
  getters: {
    roomListGetter: (state) => state.roomList,
    myInfoGetter: (state) => state.myInfo,
    searchResultGetter: (state) => state.searchResult,
    someOneInfoGetter: (state) => state.someOneInfo,
    groupInfoGetter: (state) => state.groupInfo,
    isGroupMemberGetter: (state) => state.isGroupMember,
    toUserInfoGetter: (state) => state.toUserInfo,
  },
  mutations: {
    roomListMutation(state, data) {
      state.roomList = data;
    },
    searchResultMutation(state, data) {
      state.searchResult = data;
      console.log("search mutation:", state.searchResult);
    },
    // 我的個人資料
    myInfoMutation(state, data) {
      state.myInfo = data;
    },
    // 群組資訊
    groupInfoMutation(state, data) {
      state.groupInfo = data;
    },
    isGroupMemberMutation(state, data) {
      state.isGroupMember = data;
    },
    // 某個 user 的資訊
    someOneInfoMutation(state, data) {
      state.someOneInfo = data;
    },
  },
  actions: {
    // 登出
    logoutAction() {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expire");
      router.push("/login");
    },
    // 取得左側聊天室列表
    async roomListAction({ commit }) {
      console.log("getRoomListAction");
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.VUE_APP_API}/api/room_list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status == 200) {
        console.log("VUEX dispatch RoomListAction");
        let roomList = res.data.roomList;
        roomList.forEach((e) => {
          e.messageInfo.time = toNormalTime(e.messageInfo.time);
        });
        // const groupList = res.data.groupList;
        // const privateList = res.data.privateList;
        // groupList.forEach((e) => {
        //   e.type = "group";
        //   // e.messageId.time = toNormalTime(e.messageId.time);
        // });
        // privateList.forEach((e) => {
        //   e.type = "private";
        //   // e.messageId.time = toNormalTime(e.messageId.time);
        // });

        // const roomList = groupList.concat(privateList);

        // roomList.sort((a, b) => {
        //   return b.messageId.time - a.messageId.time;
        // });

        // roomList.forEach((e) => {
        //   e.messageId.time = toNormalTime(e.messageId.time);
        // });
        console.log("VUEX roomList:", roomList);

        commit("roomListMutation", roomList);
      }
    },
    // 取得搜尋結果
    async searchResultAction({ commit }, keyword) {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.VUE_APP_API}/api/search_by_name`,
        {
          params: {
            name: keyword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        const searchResult = res.data.searchResult;
        console.log("VUEX search result:", searchResult);

        commit("searchResultMutation", searchResult);
      }
    },
    // 取得群組資訊
    async groupInfoAction({ commit }, group_id) {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("userInfo")).id;
      const res = await axios.get(`${process.env.VUE_APP_API}/api/group_info`, {
        params: {
          groupId: group_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        const groupInfo = res.data.groupInfo;
        console.log("VUEX groupInfo:", groupInfo);
        commit("groupInfoMutation", groupInfo);
        // 判斷是否是群組成員
        let isGroupMember = groupInfo.members.includes(userId);
        console.log("Vuex isGroupMember", isGroupMember);
        commit("isGroupMemberMutation", isGroupMember);
      }
    },
    // 加入群組
    async joinGroupAction(context, payload) {
      // console.log("VUEX joinGroup", userId, groupId);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.VUE_APP_API}/api/join_group`,
        {
          userId: payload.userId,
          groupId: payload.groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log(res);
        // const groupInfo = res.data.groupInfo;
        this.$socket.emit("joinGroup");
        // 更新 room list
        // store.dispatch("roomListAction")
      }
    },
    // 某個 user 的資料
    async someOneInfoAction({ commit }, user_id) {
      // console.log("user_id666", user_id);
      const res = await axios.get(`${process.env.VUE_APP_API}/api/user_info`, {
        params: {
          id: user_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      commit("someOneInfoMutation", res.data.userInfo);
    },
  },
});
export default store;
