const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { obtenerCategorias, obtenerCategoriasPorId, actualizarCategorias, crearCategorias, eliminarCategoria } = require('../controllers/categoria');
const { esRoleValido, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();


//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por el id - publico
router.get('/:id',[
    check('id').custom( existeCategoriaPorId ),
    check('id', 'No es un id de mongo valido').isMongoId(),
    validarCampos
], obtenerCategoriasPorId);

//Crear categoria - privado - cualquier persona con un token valido
router.post('/crear',[
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], crearCategorias);

//Actualizar categoria - privado- se requiere id y un token valido
router.put('/editar/:id',[
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategorias);

//Borrar una categoria - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], eliminarCategoria);


module.exports = router;
