<template>
  <div class="wrapper">
    <the-header goback="true" :chatTitle="chatTitle"></the-header>
    <div class="main">
      <ul v-if="userDataList !== []">
        <li v-for="data in userDataList" :key="data._id">
          <div @click="enterUserCard(data._id)">
            <the-avatar :username="data.name" class="user-avatar"></the-avatar>
            <!-- <img :src="data.avator" alt="" /> -->
            <div class="content">
              <span> {{ data.name }} </span>
              <!-- <p> -->
              <!-- {{ data.name }} -->
              <!-- <svg v-if="(data.sex = 0)" class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon1"></use>
              </svg>
              <svg v-else class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon"></use>
              </svg> -->
              <!-- </p> -->
              <!-- <p>
              <svg v-if="data.place" class="icon" aria-hidden="true">
                <use xlink:href="#icon-placeholder"></use>
              </svg>
              {{ data.place }}
              <svg v-if="data.github" class="icon" aria-hidden="true">
                <use xlink:href="#icon-github"></use>
              </svg>
              {{ data.github }}
            </p> -->
            </div>
          </div>
        </li>
        <div v-if="groupDataList !== []">
          <li v-for="data in groupDataList" :key="data.id">
            <div @click="enterGroupCard(data.group_id)">
              <img :src="data.group_avator" alt="" />
              <div class="content">
                <p class="group-creater">
                  {{ data.group_name }}
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-group_fill"></use>
                  </svg>
                  <span> {{ data.group_creater }}</span>
                </p>
                <p>
                  <span>群公告：{{ data.group_notice }}</span>
                </p>
              </div>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const token = localStorage.getItem("token");

export default {
  components: {},
  data() {
    return {
      chatTitle: "查找中...",
      userDataList: [],
      groupDataList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    getChatTitle() {
      const username = this.$route.params.username;
      const groupname = this.$route.params.groupname;
      if (username) {
        this.chatTitle = "搜尋结果(使用者)";
        this.findPeople(username);
      } else if (groupname) {
        this.chatTitle = "搜尋结果(群組)";
        this.findGroup(groupname);
      }
    },
    //找人
    findPeople(username) {
      console.log(token);
      axios
        .get("http://localhost:3000/api/find_people", {
          params: {
            name: username,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("findPeople", res);
          this.userDataList.push(res.data.userInfo);
        });
    },
    //找群
    findGroup(groupname) {
      axios
        .get("/api/v1/get_group_info", {
          params: {
            groupName: groupname,
          },
        })
        .then((res) => {
          console.log("findGroup", res);
          this.groupDataList = res.data.data.groupInfo;
        });
    },
    enterUserCard(val) {
      this.$router.push(`/user_info/${val}`);
    },
    enterGroupCard(val) {
      this.$router.push(`/group_info/${val}`);
    },
  },
  mounted() {
    this.getChatTitle();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  // .can-find {
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
  .main {
    height: 92.5%;
    ul {
      // margin-top: 0.2rem;
      li {
        padding: 0.2rem 0.2rem;
        cursor: pointer;
        background-color: #fff;
        list-style-type: none;
        margin-bottom: 0.16rem;
        // position: relative;
        display: flex;
        width: 100%;
        img {
          width: 0.8rem;
          height: 0.8rem;
        }
        .content {
          padding-left: 0.25rem;
          display: inline-block;
          font-size: 1rem;
          // display: flex;
          // align-items: center;
          // p:nth-child(1) {
          //   font-size: 1rem;
          //   .icon {
          //     width: 0.26rem;
          //     height: 0.26rem;
          //     margin-left: 0.1rem;
          //   }
          // }
          // p:nth-child(2) {
          //   font-size: 0.2rem;
          //   line-height: 0.8rem;
          //   color: #555;
          //   .icon {
          //     width: 0.36rem;
          //     height: 0.36rem;
          //     margin: 0 0.1rem;
          //   }
          // }
          .group-creater {
            .icon {
              width: 0.4rem !important;
              height: 0.4rem !important;
            }
            span {
              font-size: 0.22rem;
            }
          }
        }
      }
    }
  }
}
</style>
