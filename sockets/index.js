const chatSocket = require('../models/socketModel');
const userModel = require('../models/userModel');
const { generateMessageID } = require('../utils/util');
const handleChatMessage = async (socket, data) => {
    if (!data) {
        return socket.emit('error', { message: 'No message data provided' });
    }
    const sessionID = socket.sessionID;
    const user = await userModel.getUserBySessionID(sessionID);

    const { content, groupID, createAt } = data;
  
    if (!sessionID || !content || !groupID || !createAt) {
      return socket.emit('error', { message: 'All fields are required' });
    }
  
    const messageID = generateMessageID();
  
    try {
      const chatMessage = await chatSocket.addChatMessage(
        sessionID,
        content,
        messageID,
        groupID,
        createAt
      );
      if (!chatMessage) {
        return socket.emit('error', { message: 'Failed to send message' });
      }
    // Emit the message to the specific group
      socket.to(groupID).emit('receive-message', {
        messageID: chatMessage[0].MessageID,
        content: chatMessage[0].Content,
        groupID: chatMessage[0].GroupID,
        createAt: chatMessage[0].CreateAt,
        sender: {
          username: user.Username,
          fullName: user.FullName,
          role: user.Role
        }
      });
    } catch (err) {
      console.error(err.message);
      socket.emit('error', { message: err.message });
    }
  };
  
module.exports = {
    handleChatMessage
}