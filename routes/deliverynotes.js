const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const {
    createDeliveryNoteCtrl,
    getAllDeliveryNotesCtrl,
    getDeliveryNoteByIdCtrl,
    getDeliveryNotePdfCtrl,
    signDeliveryNoteCtrl,
    deleteDeliveryNoteCtrl
} = require("../controllers/deliverynotes");
const multer = require("multer");
const upload = multer({ dest: "tmp/" });

/**
 * @swagger
 * tags:
 *   name: DeliveryNote
 *   description: Gestión de albaranes
 */

router.use(requireAuth);

/**
 * @swagger
 * /api/deliverynote:
 *   post:
 *     summary: Crear un nuevo albarán (horas o materiales)
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, project]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [hours, materials]
 *               project:
 *                 type: string
 *               people:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     hours: { type: integer }
 *               materials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     quantity: { type: integer }
 *     responses:
 *       201:
 *         description: Albarán creado
 *       403:
 *         description: No autorizado
 */
router.post("/", createDeliveryNoteCtrl);

/**
 * @swagger
 * /api/deliverynote:
 *   get:
 *     summary: Listar todos los albaranes
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 *       403:
 *         description: No autorizado
 */
router.get("/", getAllDeliveryNotesCtrl);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   get:
 *     summary: Obtener un albarán por ID
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalles del albarán
 *       403:
 *         description: No autorizado
 */
router.get("/:id", getDeliveryNoteByIdCtrl);

/**
 * @swagger
 * /api/deliverynote/pdf/{id}:
 *   get:
 *     summary: Generar PDF de un albarán
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: PDF generado
 *         content:
 *           application/pdf: {}
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Albarán no encontrado
 */
router.get("/pdf/:id", getDeliveryNotePdfCtrl);

/**
 * @swagger
 * /api/deliverynote/sign/{id}:
 *   post:
 *     summary: Firmar un albarán subiendo una firma
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Albarán firmado
 *       403:
 *         description: No autorizado o albarán ya firmado
 */
router.post("/sign/:id", upload.single("signature"), signDeliveryNoteCtrl);

/**
 * @swagger
 * /api/deliverynote/{id}:
 *   delete:
 *     summary: Eliminar un albarán (solo si no está firmado)
 *     tags: [DeliveryNote]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Albarán eliminado
 *       403:
 *         description: No autorizado o albarán firmado
 *       404:
 *         description: Albarán no encontrado
 */
router.delete("/:id", deleteDeliveryNoteCtrl);

module.exports = router;