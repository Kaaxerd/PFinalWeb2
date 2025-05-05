const { matchedData, body } = require("express-validator")
const { tokenSign } = require("../utils/handleJwt")
const { encrypt, compare } = require("../utils/handlePassword")
const {handleHttpError} = require("../utils/handleHttpError")
const {usersModel} = require("../models")
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require("bcrypt")
const { sendEmail } = require("../utils/handleEmail")

/**
 * Encargado de registrar un nuevo usuario
 * @param {*} req 
 * @param {*} res 
 */
const registerCtrl = async (req, res) => {
    try {
        req = matchedData(req);
        
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de verificación de 6 números

        // Valores por defecto
        let role = "user";
        let company = undefined;

        if (req.invitationToken) {
            const invitedCompany = await Company.findOne({ invitationToken: req.invitationToken });
            if (!invitedCompany) {
                return handleHttpError(res, "INVALID_INVITATION_TOKEN", 400);
            }
            role = "guest";
            company = invitedCompany._id;
        }

        const body = {...req, verificationCode, role, company}
        const dataUser = await usersModel.create(body); 
        dataUser.set('password', undefined, { strict: false });

        await sendEmail({
            to: req.email,
            subject: "Verify your account",
            text: `Your verification code is: ${verificationCode}`,
            from: process.env.EMAIL
        });

        const data = {
            token: await tokenSign(dataUser),
            user: dataUser,
            verificationCode: dataUser.verificationCode
        }
        
        res.send(data);
    }catch(err) {
        console.log(err);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
}

const verifyEmailCtrl = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        // Buscar al usuario por su correo electrónico
        const user = await usersModel.findOne({ email });
    console.log("🔍 Usuario encontrado para verificación:", user);

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);  // Si no existe el usuario, error 404
        }

        // Verificar si el código de verificación es correcto
        if (user.verificationCode !== verificationCode) {
            // Si el código no coincide, devolver un error 400 (Bad Request)
            return res.status(400).send({
                message: "Código de verificación incorrecto"
            });
        }

        // Si el código es correcto, actualizar el estado de verificación
        user.verified = true;
        await user.save();  // Guardar los cambios en la base de datos

        // Devolver una respuesta exitosa
        res.send({ message: "Correo electrónico verificado correctamente" });

    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_VERIFY_EMAIL");  // Si hay un error en el proceso, manejarlo
    }
};


/**
 * Encargado de hacer login del usuario
 * @param {*} req 
 * @param {*} res 
 */
const loginCtrl = async (req, res) => {
    console.log("Intento de login: ", req.body.email);

    try {
        req = matchedData(req)
            console.log("Datos del login después de matchedData: ", req);
        const user = await usersModel.findOne({ email: req.email }).select("password name role email verified")

        if(!user){ // Usuario no encontrado
            handleHttpError(res, "USER_NOT_EXISTS", 404)
            return
        }

        if(!user.verified){ // Usuario no verificado
            handleHttpError(res, "USER_NOT_VERIFIED", 403)
            return
        }
        
        console.log('Password provided:', req.password);
        console.log('Stored password hash:', user.password);

        // Comparar la contraseña proporcionada con el hash almacenado
        const isPasswordCorrect = await compare(req.password, user.password);

        console.log('Password match result:', isPasswordCorrect);  // Verifica si las contraseñas coinciden
        if (!isPasswordCorrect) {
            return handleHttpError(res, "INVALID_PASSWORD", 401);  // Si la contraseña no es correcta
        }

        user.set('password', undefined, { strict: false });  // No incluir la contraseña en la respuesta
        const data = {
            token: await tokenSign(user),  // Generar el token JWT
            user: user  // Devolver los datos del usuario
        };

        res.send(data);
    } catch(err) {
        console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")
    }
}

const getUserCtrl = async (req, res) => {
    try {
        const { id } = matchedData(req)
        const user = await usersModel.findById(id).select("-password -__v")

        if(!user) {
            handleHttpError(res, "USER_NOT_FOUND", 404)
            return
        }

        res.send(user)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_GET_USER")
    }
}

const updateUserCtrl = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el id desde los parámetros de la URL
        const updateData = req.body; // Filtra los datos válidos (esto incluirá el id si se pasa en el body, pero lo usaremos de params)
        
        // Actualizamos el usuario (asumiendo que el id en la base de datos es _id)
        const updatedUser = await usersModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedUser) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }
        
        res.send(updatedUser);
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_UPDATE_USER")
    }
}

const getUserFromTokenCtrl = async (req, res) => {
    console.log("Decoded token payload:", req.user);

    try {
        const userId = req.user._id;
        const user = await usersModel.findById(userId).select("-password")

        if(!user) {
            handleHttpError(res, "USER_NOT_FOUND", 404)
            return
        }

        res.send(user)
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_GET_USER")
    }
}

const deleteUserCtrl = async (req, res) => {
    try {
        const userId = req.user._id;
        const soft = req.query.soft;

        let result;
        if(soft) {
            result = await usersModel.deleteMany({ _id: userId}); // Eliminación soft
        } else {
            result = await usersModel.deleteOne({ _id: userId }); // Eliminación hard
        }

        if(result.deletedCount === 0) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        res.send({ message: soft ? "Usuario eliminado (soft delete)" : "Usuario eliminado permanentemente" });
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_DELETE_USER")
    }
}

const forgotPasswordCtrl = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await usersModel.findOne({ email }); // Buscar al usuario por email
        
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }
        
        // Generar token de reseteo y expiración
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpires = Date.now() + 3600000; // 1 hora
        
        // Guarda el token y la expiración en el usuario (asegúrate de tener estos campos en tu schema)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();
        
        // En lugar de enviar el email, devolvemos el token en la respuesta
        res.send({ message: "Token generado para recuperación", resetToken });
    } catch (err) {
        console.log(err)
        handleHttpError(res, "ERROR_FORGOT_PASSWORD")
    }
}

const resetPasswordCtrl = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Buscar al usuario con el token y que no haya expirado
        const user = await usersModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return handleHttpError(res, "INVALID_OR_EXPIRED_TOKEN", 400);
        }
        
        // Cifra la nueva contraseña
        const hashedPassword = await encrypt(newPassword);
        user.password = hashedPassword;
        
        // Limpiar los campos del token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();
        res.send({ message: "La contraseña ha sido restablecida correctamente" });
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_RESET_PASSWORD");
    }
};

module.exports = { registerCtrl, loginCtrl, verifyEmailCtrl, getUserCtrl, updateUserCtrl, getUserFromTokenCtrl, deleteUserCtrl, forgotPasswordCtrl, resetPasswordCtrl }