const url = (window.location.hostname.includes('localhost'))
        ? 'http://localhost:8080/api/auth/'
        : 'https://restserver-node-nm.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');

const validarJWT = async() => {

    const token = localStorage.getItem('token');

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token}
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.nombre

    // console.log(userDB, tokenDB);
    await connectSocket();
};

const connectSocket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('get-messages', (payload) => {
        paintMessages(payload);
    });

    socket.on('active-users', (payload) => {
        paintUsers(payload);
    });

    socket.on('private-message', ({de, mesaje}) => {

    });

    
};


txtMessage.addEventListener('keyup', ({ keyCode }) => {
    
    const mensaje = txtMessage.value;
    const uid = txtUid.value;

    if (keyCode !== 13) {return;}
    if (mensaje.length === 0) {return;}

    socket.emit('send-message', {mensaje, uid});
    txtMessage.value = '';

})


const paintUsers = (usuarios = []) => {
    let usersHtml = '';

    usuarios.forEach( ({nombre, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class= "text-success">${nombre}</h5>
                    <span class= "fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });
    ulUsuarios.innerHTML = usersHtml;
};

const paintMessages = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach( ({nombre, uid, mensaje}) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class= "text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMessages.innerHTML = mensajesHtml;
};

const paintMessages = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach( ({nombre, uid, mensaje}) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class= "text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMessages.innerHTML = mensajesHtml;
};

const paintPrivateMessages = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach( ({nombre, uid, mensaje}) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class= "text-primary">${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });
    ulMessages.innerHTML = mensajesHtml;
};

const main = async() => {

    await validarJWT();
};



main();