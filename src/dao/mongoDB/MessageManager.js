import Message from '../../models/Message.js';

class MessageManager {
  async getAllMessages() {
    try {
      return await Message.find().exec();
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      return [];
    }
  }

  async getMessageById(id) {
    try {
      return await Message.findById(id).exec();
    } catch (error) {
      console.error('Error al obtener el mensaje por ID:', error);
      return null;
    }
  }

  async createMessage(messageData) {
    try {
      const message = new Message(messageData);
      return await message.save();
    } catch (error) {
      console.error('Error al crear el mensaje:', error);
      throw new Error('Error al crear el mensaje');
    }
  }

  async updateMessage(id, updateData) {
    try {
      return await Message.findByIdAndUpdate(id, updateData, { new: true }).exec();
    } catch (error) {
      console.error('Error al actualizar el mensaje:', error);
      return null;
    }
  }

  async deleteMessage(id) {
    try {
      return await Message.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error);
      return null;
    }
  }
}

export default MessageManager;
