//importacion
const { response, request } = require('express');

const Categoria = require('../models/categorias');

const obtenerCategorias = async(req = request, res = response) =>{
    const query = { estado: true };

    const listaCategorias = await Promise.all([
        
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);
    
    res.json ({
        msg: 'GET API de categoria',
        listaCategorias
    })
}

const obtenerCategoriasPorId = async(req = request, res = response) =>{
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json ({
        msg: 'Hola estas en el get categorias',
        categoria
    })
}

const crearCategorias = async(req = request, res = response) =>{
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre})
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoriaAgregada = new Categoria(data);

    //Guardar en la DB
    await categoriaAgregada.save();

    res.status(201).json ({
        msg: 'POST categoria',
        categoriaAgregada
    })
}

const actualizarCategorias = async(req = request, res = response) =>{
    const {id} = req.params;
    const {_id, estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();//Cambiamos el nombre a mayusculas
    data.usuario = req.usuario._id;// Hacemos referencia al usuario que hizo el put por medio del token

    //Edicion de categorias                                       // new: true sirve para enviar el nuevo documento actualizado
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json ({
        msg: 'PUT categoria',
        categoria
    })
}

const eliminarCategoria = async(req = request, res = response) =>{
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndDelete(id, {estado: false}, {new: true})
    res.json ({
        msg: 'DELETE categoria',
        categoriaBorrada
    })
}


module.exports = {
    obtenerCategorias,
    obtenerCategoriasPorId,
    crearCategorias,
    actualizarCategorias,
    eliminarCategoria
}