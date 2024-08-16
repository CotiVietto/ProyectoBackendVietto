const Message = require('../models/Message.js');

class MessageManager {
  async getAllMessages() {
    return await Message.find().exec();
  }

  async getMessageById(id) {
    return await Message.findById(id).exec();
  }

  async createMessage(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }

  async updateMessage(id, updateData) {
    return await Message.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteMessage(id) {
    return await Message.findByIdAndDelete(id).exec();
  }
}

module.exports = MessageManager;
