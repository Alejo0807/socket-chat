
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');


const generateJWT = (uid = '') => {
    return new Promise( (resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETTOPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        })
    });
};

const verifyJWT = async(token = '') => {

    try {
        
        if (token.length < 15) return null;

        const { uid } = jwt.verify(token, process.env.SECRETTOPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if(!usuario || !usuario.estado) return null;

        return usuario;

    } catch (error) {
        return null;
    }
};



module.exports = {
    generateJWT,
    verifyJWT
}