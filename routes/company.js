const express = require("express");
const { validateCompany, validateCompanyUpdate } = require("../validators/company");
const { createCompanyCtrl, updateCompanyCtrl } = require("../controllers/company");
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../middlewares/upload");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Gestión de empresas
 */

/**
 * @swagger
 * /api/company:
 *   post:
 *     summary: Crear una nueva compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cif
 *               - street
 *               - number
 *               - postal
 *               - city
 *               - province
 *             properties:
 *               name:
 *                 type: string
 *               cif:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: integer
 *               postal:
 *                 type: integer
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compañía creada
 *       409:
 *         description: Compañía ya existe
 */
router.post("/", requireAuth, validateCompany, createCompanyCtrl);

/**
 * @swagger
 * /api/company/{id}:
 *   patch:
 *     summary: Actualizar datos de una compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               cif:  { type: string }
 *               street: { type: string }
 *               number: { type: integer }
 *               postal: { type: integer }
 *               city: { type: string }
 *               province: { type: string }
 *     responses:
 *       200:
 *         description: Compañía actualizada
 *       403:
 *         description: No autorizado
 */
router.patch("/:id", requireAuth, validateCompany, updateCompanyCtrl);

/**
 * @swagger
 * /api/company/{id}/logo:
 *   patch:
 *     summary: Subir o actualizar logo de la compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo subido correctamente
 *       403:
 *         description: No autorizado
 */
router.patch("/:id/logo", requireAuth, upload.single("logo"), validateCompanyUpdate, updateCompanyCtrl);

module.exports = router;