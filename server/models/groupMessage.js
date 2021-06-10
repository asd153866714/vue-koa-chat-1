const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupMessageSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  fromSys: {
    type: Boolean,
  },
});

module.exports = mongoose.model("GroupMessage", groupMessageSchema);
