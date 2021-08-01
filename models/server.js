const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');
require('dotenv').config();


class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require("http").createServer(this.app);
        this.io = require("socket.io")(this.server);

        this.path = {
            auth: '/api/auth',
            categories: '/api/categorias',
            products: '/api/productos',
            search: '/api/buscar',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        };
        

        //Conectar a base de datos
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();

        //Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Parse body
        this.app.use(express.json());

        // directorio publico
        this.app.use( express.static('public'));

        // Fileupload
        this.app.use(fileUpload({
                useTempFiles: true,
                tempFileDir: '/tmp/',
                createParentPath: true
            })
        );
        
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.categories, require('../routes/categories'));
        this.app.use(this.path.products, require('../routes/products'));
        this.app.use(this.path.search, require('../routes/search'));
        this.app.use(this.path.usuarios, require('../routes/user'));
        this.app.use(this.path.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket,this.io)); 
    }

    listen() {
        this.server.listen(this.port, () => {
        console.log(`Example app listening at http://localhost:${this.port}`)
        })
    }
}


module.exports = Server;