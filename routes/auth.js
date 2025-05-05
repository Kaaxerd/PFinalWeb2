const express = require("express");
const { validateRegister, validateLogin, validateGetUser } = require("../validators/auth");
const { 
  registerCtrl,
  loginCtrl,
  verifyEmailCtrl,
  getUserCtrl,
  updateUserCtrl,
  getUserFromTokenCtrl,
  deleteUserCtrl,
  forgotPasswordCtrl,
  resetPasswordCtrl
} = require("../controllers/auth");
const handleValidator = require("../utils/handleValidator");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestión de usuarios y autenticación
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, autonomous]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               autonomous:
 *                 type: boolean
 *               nif:
 *                 type: string
 *                 description: Obligatorio si autonomous es false
 *     responses:
 *       201:
 *         description: Usuario creado
 *       409:
 *         description: Usuario ya existe
 */
router.post("/register", validateRegister, handleValidator, registerCtrl);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verificar cuenta mediante código enviado por email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, verificationCode]
 *             properties:
 *               email:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verificación correcta
 *       400:
 *         description: Código inválido o expirado
 */
router.post("/verify-email", verifyEmailCtrl);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Devuelve JWT
 *       403:
 *         description: Credenciales incorrectas o usuario no verificado
 */
router.post("/login", validateLogin, loginCtrl);

/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Actualizar datos de un usuario por ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               lastname: { type: string }
 *               email: { type: string }
 *               nif: { type: string }
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       403:
 *         description: No autorizado
 */
router.put("/:id", updateUserCtrl);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *       401:
 *         description: No autenticado
 */
router.get("/me", requireAuth, getUserFromTokenCtrl);

/**
 * @swagger
 * /api/auth/me:
 *   delete:
 *     summary: Eliminar cuenta del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Eliminación soft/hard de la cuenta
 *       401:
 *         description: No autenticado
 */
router.delete("/me", requireAuth, deleteUserCtrl);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar token de recuperación de contraseña
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Token enviado a email
 *       401:
 *         description: No autenticado
 */
router.post("/forgot-password", requireAuth, forgotPasswordCtrl);

/**
 * @swagger
 * /api/auth/reset-password:
 *   patch:
 *     summary: Restablecer la contraseña
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Contraseña restablecida
 *       401:
 *         description: Token inválido o no autenticado
 */
router.patch("/reset-password", requireAuth, resetPasswordCtrl);

module.exports = router;