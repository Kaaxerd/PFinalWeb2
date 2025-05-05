const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const { validateCreateClient, validateUpdateClient } = require("../validators/clients");
const handleValidator = require("../utils/handleValidator");
const {
  createClientCtrl,
  updateClientCtrl,
  getClientsCtrl,
  getClientByIdCtrl,
  archiveClientCtrl,
  deleteClientCtrl,
  getArchivedClientsCtrl,
  restoreClientCtrl
} = require("../controllers/clients");

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Gestión de clientes
 */
router.use(requireAuth);

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nif, email]
 *             properties:
 *               name:
 *                 type: string
 *               nif:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 *       409:
 *         description: Cliente ya existe
 */
router.post("/", validateCreateClient, handleValidator, createClientCtrl);

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Actualizar datos de un cliente por ID
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       403:
 *         description: No autorizado
 */
router.put("/:id", validateUpdateClient, handleValidator, updateClientCtrl);

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Obtener todos los clientes activos
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       403:
 *         description: No autorizado
 */
router.get("/", getClientsCtrl);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del cliente
 *       403:
 *         description: No autorizado
 */
router.get("/:id", getClientByIdCtrl);

/**
 * @swagger
 * /api/client/archive/{id}:
 *   patch:
 *     summary: Archivar (soft delete) un cliente
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente archivado
 *       403:
 *         description: No autorizado
 */
router.patch("/archive/:id", archiveClientCtrl);

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Eliminar (hard delete) un cliente
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *       204:
 *       403:
 *         description: No autorizado
 */
router.delete("/:id", deleteClientCtrl);

/**
 * @swagger
 * /api/client/archived/all:
 *   get:
 *     summary: Obtener clientes archivados
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes archivados
 *       403:
 *         description: No autorizado
 */
router.get("/archived/all", getArchivedClientsCtrl);

/**
 * @swagger
 * /api/client/restore/{id}:
 *   patch:
 *     summary: Restaurar cliente archivado
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente restaurado
 *       403:
 *         description: No autorizado
 */
router.patch("/restore/:id", restoreClientCtrl);

module.exports = router;