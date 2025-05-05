const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const { validateCreateProject, validateUpdateProject } = require("../validators/projects");
const handleValidator = require("../utils/handleValidator");
const {
  createProjectCtrl,
  getProjectsCtrl,
  getProjectByIdCtrl,
  updateProjectCtrl,
  archiveProjectCtrl,
  getArchivedProjectsCtrl,
  restoreProjectCtrl,
  deleteProjectCtrl
} = require("../controllers/projects");

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Gestión de proyectos
 */
router.use(requireAuth);

/**
 * @swagger
 * /api/project/archive/{id}:
 *   patch:
 *     summary: Archivar (soft delete) un proyecto
 *     tags: [Project]
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
 *         description: Proyecto archivado
 *       403:
 *         description: No autorizado
 */
router.patch("/archive/:id", archiveProjectCtrl);

/**
 * @swagger
 * /api/project/archive:
 *   get:
 *     summary: Obtener proyectos archivados
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos archivados
 *       403:
 *         description: No autorizado
 */
router.get("/archive", getArchivedProjectsCtrl);

/**
 * @swagger
 * /api/project/restore/{id}:
 *   patch:
 *     summary: Restaurar un proyecto archivado
 *     tags: [Project]
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
 *         description: Proyecto restaurado
 *       403:
 *         description: No autorizado
 */
router.patch("/restore/:id", restoreProjectCtrl);

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, client]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               client:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proyecto creado
 *       409:
 *         description: Proyecto ya existe
 */
router.post("/", validateCreateProject, handleValidator, createProjectCtrl);

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Obtener todos los proyectos activos
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *       403:
 *         description: No autorizado
 */
router.get("/", getProjectsCtrl);

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Project]
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
 *         description: Detalles del proyecto
 *       403:
 *         description: No autorizado
 */
router.get("/:id", getProjectByIdCtrl);

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Actualizar datos de un proyecto
 *     tags: [Project]
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
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       403:
 *         description: No autorizado
 */
router.put("/:id", validateUpdateProject, handleValidator, updateProjectCtrl);

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Eliminar (hard delete) un proyecto
 *     tags: [Project]
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
router.delete("/:id", deleteProjectCtrl);

module.exports = router;