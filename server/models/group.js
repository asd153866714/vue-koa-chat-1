const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  avatarColor: {
    type: String,
    required: true,
  },
  avatarName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Group", groupSchema);
