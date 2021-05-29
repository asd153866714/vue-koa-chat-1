const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const privateLatestSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  withUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
});

module.exports = mongoose.model("PrivateLatest", privateLatestSchema);
