const User = require("../models/user");

class socketController {
  saveUserSocketId = async (userId, socketId) => {
    try {
      let data = await User.findOneAndUpdate(
        { _id: userId },
        { socketId: socketId },
        {
          new: true,
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  getUserSocketId = async (userId) => {
    try {
      let data = await User.findById(userId);
      return data.socketId;
    } catch (error) {}
  };
}

module.exports = new socketController();
