const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    default: "",
    required: false,
  },
  avatarColor: {
    type: String,
    required: true,
  },
  avatarName: {
    type: String,
    required: true,
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
