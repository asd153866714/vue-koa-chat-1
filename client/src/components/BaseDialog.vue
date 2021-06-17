<template>
  <div v-if="type === `newGroup`">
    <v-dialog v-model="show" width="500" persistent>
      <v-card>
        <v-card-title class="white--text text-h5 blue">
          新增群組
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Group Name"
                  v-model="inputGroupName"
                  autocomplete="false"
                  :rules="inputGroupNameRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tryClose">
            close
          </v-btn>
          <v-btn color="primary" text @click="createGroup">
            create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else-if="type === `contacts`">
    <v-dialog v-model="show" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          聯絡人
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tryClose">
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else-if="type === `setting`">
    <v-dialog v-model="show" width="500" persistent>
      <v-card>
        <v-img class="white--text blue" height="150px">
          <v-app-bar flat color="rgba(0, 0, 0, 0)">
            <v-toolbar-title class="text-h6 white--text pl-0">
              設定
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu left bottom offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="white">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="tryLogout()">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-app-bar>

          <v-card-title class="">
            <v-avatar size="60" :color="myInfo.avatarColor">
              <span class="white--text title">
                {{ myInfo.avatarName }}
              </span>
            </v-avatar>
            <p class="ml-3">
              {{ myInfo.name }}
            </p>
          </v-card-title>
        </v-img>
        <v-card-title class="text-subtitle-2">
          <div>Discription</div>
        </v-card-title>
        <!-- <v-subheader inset>logout</v-subheader>
        <v-divider inset></v-divider> -->
        <v-card-text>
          暫時無個人介紹
        </v-card-text>

        <!-- <v-card-text class="">
          <v-btn class="text-xs-center white--text red">
            Logout
          </v-btn>
        </v-card-text> -->

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tryClose">
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else-if="type === `tryLogout`">
    <v-dialog v-model="show" width="300" persistent>
      <v-card>
        <!-- <v-card-title class="white--text text-h5 blue"> </v-card-title> -->
        <br />
        <v-card-subtitle class="text-subtitle-1">
          確定要登出嗎?
        </v-card-subtitle>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tryClose">
            取消
          </v-btn>
          <v-btn color="primary" text @click="confimLogout">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else-if="type === `groupInfo`">
    <v-dialog v-model="show" width="500" persistent>
      <v-card>
        <v-img class="white--text" height="200px" :src="settingImgSrc[0]">
          <v-app-bar flat color="rgba(0, 0, 0, 0)">
            <v-toolbar-title class="text-h6 white--text pl-0">
              群組資訊
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>

          <v-card-title class="">
            <v-avatar size="60" color="green">
              <span class="white--text title">
                {{ groupInfoGetter.avatarColor }}
              </span>
            </v-avatar>
            <p class="ml-3">
              {{ groupInfoGetter.name }}
            </p>
          </v-card-title>
        </v-img>
        <v-card-title class="text-subtitle-2">
          <div>Discription</div>
        </v-card-title>
        <!-- <v-subheader inset>logout</v-subheader>
        <v-divider inset></v-divider> -->
        <v-card-text>
          暫時無個人介紹
        </v-card-text>

        <!-- <v-card-text class="">
          <v-btn class="text-xs-center white--text red">
            Logout
          </v-btn>
        </v-card-text> -->

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tryClose">
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "BaseDialog",
  props: {
    type: {
      type: String,
      required: true,
      default: "",
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      dialog: this.show,
      inputGroupName: "",
      inputGroupNameRules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters",
      ],
      settingImgSrc: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTecJXscDX6oaQat6_u3XzTP4jTxVo3F0NwA&usqp=CAU",
        "data:image/jpeg;base64,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",
      ],
    };
  },
  watch: {
    dialog(val) {
      console.log("Dialog: ", val);
    },
  },
  computed: {
    ...mapGetters(["groupInfoGetter"]),
    myInfo() {
      let data = JSON.parse(localStorage.getItem("userInfo"));
      return data;
    },
  },
  methods: {
    tryClose() {
      this.inputGroupName = "";
      this.$emit("closeDialog");
    },
    createGroup() {
      if (this.inputGroupName.trim == "" || this.inputGroupName.length < 3) {
        this.inputGroupName = "";
        return;
      }
      const token = localStorage.getItem("token");
      console.log("Creat Group:", this.inputGroupName);

      axios
        .post(
          `${process.env.VUE_APP_API}/api/create_group`,
          {
            name: this.inputGroupName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log("CLIENT create group res:", res.data);
            this.inputGroupName = "";
            this.$emit("closeDialog");
            // this.$emit("updateRoomList");
            this.$socket.emit("createGroup", res.data.newGroupInfo._id);
            let data = {
              to: res.data.newGroupInfo._id,
              message: "群組已建立",
              time: Date.parse(new Date()),
              fromSys: true,
            };
            this.$socket.emit("sendGroupMsg", data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tryLogout() {
      let data = "tryLogout";
      this.$emit("updateDialogStatus", data);
    },
    confimLogout() {
      this.tryClose();
      this.$store.dispatch("logoutAction");
    },
  },
};
</script>
