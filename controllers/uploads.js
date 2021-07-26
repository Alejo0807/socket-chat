const { response } = require("express");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require("../helpers");
const { Usuario, Product } = require("../models");



const uploadFiles = async(req, res = response) => {

    try {
        const nombre = await uploadFile(req.files, ['txt', 'md']);
        res.json({
            nombre
        });
            
    } catch (error) {
        res.status(400).json({error})
    }

};

const updateFile = async(req, res = response) => {

    const {id, coleccion} = req.params;

    res.json({
        id,
        coleccion
    });
};

const updateImage = async(req, res = response) => {
    
    const { id, coleccion} = req.params;

    let model;

    switch (coleccion) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con id ${id }`
                });
            }
            break;
        case 'productos':
            model = await Product.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un producto con id ${id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Comuniquese con el administrador'
            })
    }

    if(model.img) {
        const pathImage = path.join(__dirname, '../uploads', coleccion, model.img);
        if(fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }


    model.img = await uploadFile(req.files, undefined, coleccion);
    await model.save();

    res.json({
        model
    });
}

const showImage = async(req, res = response) => {

    const { id, coleccion} = req.params;

    let model;

    switch (coleccion) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con id ${id }`
                });
            }
            break;
        case 'productos':
            model = await Product.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un producto con id ${id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Comuniquese con el administrador'
            })
    }

    if(model.img) {
        const pathImage = path.join(__dirname, '../uploads', coleccion, model.img);
        if(fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
        
    }
    const pathAlternativeImage = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(pathAlternativeImage);
    // res.json({
    //     msg: 'Falta placeholder'
    // });
};

const updateImageCloudinary = async(req, res = response) => {
    
    const { id, coleccion} = req.params;

    let model;

    switch (coleccion) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con id ${id }`
                });
            }
            break;
        case 'productos':
            model = await Product.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un producto con id ${id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Comuniquese con el administrador'
            })
    }

    if(model.img) {
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length -1];
        const [publicId] = name.split('.');

        cloudinary.uploader.destroy(publicId);

        // const pathImage = path.join(__dirname, '../uploads', coleccion, model.img);
        // if(fs.existsSync(pathImage)) {
        //     fs.unlinkSync(pathImage);
        // }
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    model.img = secure_url;
    // model.img = await uploadFile(req.files, undefined, coleccion);
    await model.save();

    res.json({
        model
    });
};


module.exports = {
    uploadFiles,
    updateFile,
    updateImage,
    showImage,
    updateImageCloudinary
};