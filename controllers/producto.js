//importacion
const { response, request } = require('express');
//Modelos
const Producto = require('../models/producto');

const obtenerProductos = async(req = request, res = response) => {

     //Condición, me busca solo los productos que tengan estado en true
     const query = { estado: true };

     const listaProductos = await Promise.all([
         Producto.countDocuments(query),
         Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
     ]);
 
     res.json({
         msg: 'GET API de usuarios',
         listaProductos
     });

}

const obtenerProductoPorId = async(req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                                            .populate('usuario', 'nombre')
                                            .populate('categoria', 'nombre');

    res.json({
        msg: 'categoria por id',
        producto
    });

}


const crearProducto = async (req = request, res = response) => {
                                //operador spread
        const { estado, usuario, ...body } = req.body;

        //validación si existe un producto en la db
        const productoEnDB = await Producto.findOne( { nombre: body.nombre } );

        if ( productoEnDB ) {
            return res.status(400).json({
                mensajeError: `El producto ${ productoEnDB.nombre } ya existe en la DB`
            });
        }


        //Generar data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }

        const producto = new Producto( data );

        //Guardar en DB
        await producto.save();

        res.status(201).json({
            msg: 'Post Producto',
            producto
        });


}


const actualizarProducto = async(req = request, res = response) => {
    const {id} = req.params;
    const { estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();//Cambiamos el nombre a mayusculas
    data.usuario = req.usuario._id;// Hacemos referencia al usuario que hizo el put por medio del token

    //Edicion de productos                                       // new: true sirve para enviar el nuevo documento actualizado
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json ({
        msg: 'PUT producto',
        producto
    })

}


const eliminarProducto = async(req = request, res = response) => {
    console.log('hola');
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndDelete(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete producto',
        productoBorrado
    });

}



module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}