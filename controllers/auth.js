const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }  
        
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado'
            });
        } 

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT 
        const token = await generateJWT(usuario.id);



        res.json({
            usuario, 
            token 
        });        
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });    
    }
}


const google = async(req, res = response) => {
    
    const { id_token } = req.body;
    try {
    
        const { correo, nombre, img } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({ correo });
        
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':c',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generateJWT(usuario.id);

        res.json({
            usuario,
            token
        });
            
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Token de google no es válido'
        });
    }
}


const postponeToken = async(req, res = response) => {

    const { usuario } = req;

    // Generar el JWT 
    const token = await generateJWT(usuario.id);

    res.json({
        usuario,
        token
    });

}

module.exports = {
    login,
    google,
    postponeToken
};