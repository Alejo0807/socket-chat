class Mensaje {

    constructor(uid, nombre, mensaje) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

class MessagesChat {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get last10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usersArr() {
        return Object.values(this.usuarios);
    }

    sendMessage(uid, nombre, mensaje) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    connectUser(usuario) {
        this.usuarios[usuario.id] = usuario;
    }

    disconnectUser(id) {
        delete this.usuarios[id];
    }
}

module.exports = MessagesChat;