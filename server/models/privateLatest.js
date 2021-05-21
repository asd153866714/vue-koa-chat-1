const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const privateLatestSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  withUserId: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PrivateLatest", privateLatestSchema);
