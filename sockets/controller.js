const { verifyJWT } = require("../helpers");
const { MessagesChat } = require("../models");


const chatMensajes = new MessagesChat();

const socketController = async(socket, io) => {
    
    const token = socket.handshake.headers['x-token'];
    const usuario = await verifyJWT(token);

    if (!usuario) return socket.disconnect();

    console.log(`Se conectó ${usuario.nombre}`);

    
    chatMensajes.connectUser(usuario);
    io.emit('active-users', chatMensajes.usersArr);
    socket.emit('get-messages', chatMensajes.last10);


    // 3 SALAS = global, socket.id, usuario.id
    //Conectar a un breakout room
    socket.join( usuario.id );

    socket.on('disconnect', () => {
        chatMensajes.disconnectUser(usuario.id);
        io.emit('active-users', chatMensajes.usersArr);
    });

    socket.on('send-message', ({mensaje, uid}) => {
        if (uid) {
            socket.to(uid).emit('private-message',{de: usuario.nombre, mensaje});
        } else {
            chatMensajes.sendMessage(usuario.id, usuario.nombre, mensaje);
            io.emit('get-messages', chatMensajes.last10);
        }
        
    });

};


module.exports = {
    socketController
};