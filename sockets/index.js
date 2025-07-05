const chatSocket = require('../models/socketModel');

// const handleChatMessage = async (socket, data) => {
//     const { sessionID, sender, message } = data;

//     try {
//         const newMessage = await chatSocket.addChatMessage(sessionID, sender, message);
//         socket.emit('chatMessage', newMessage);
//     } catch (error) {
//         console.error('Error adding chat message:', error);
//         socket.emit('error', { message: 'Failed to send message' });
//     }
// }
module.exports = {
    //handleChatMessage
}