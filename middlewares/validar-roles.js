const {request, response} = require('express')

const esAdminRole = (req = request, res = response, next)=>{
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    //Verificacion solo el rol de admin puede realizar la eliminacion
    // Si cumple con el rol de admin se envia al contrllador deleteUsuario
    const {rol, nombre} = req.usuario
    if (rol !== 'ADMIN_ROLE') {
        return res.status(500).json({
            msg: `${nombre} no es admin- no puede hacer esto`
        })
    }

    next();
}

module.exports = {
    esAdminRole
} 