const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupLatestSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: "GroupMessage",
    required: true,
  },
});

module.exports = mongoose.model("GroupLatest", groupLatestSchema);
