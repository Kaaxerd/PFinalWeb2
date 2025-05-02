const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const {
    createProjectCtrl,
    updateProjectCtrl,
    getAllProjectsCtrl,
    getProjectByIdCtrl,
    archiveProjectCtrl,
    deleteProjectCtrl,
    getArchivedProjectsCtrl,
    restoreProjectCtrl
  } = require("../controllers/projects");

router.use(requireAuth);

router.get("/archive", getArchivedProjectsCtrl);
router.patch("/restore/:id", restoreProjectCtrl);
router.patch("/archive/:id", archiveProjectCtrl);

router.get("/", getAllProjectsCtrl);
router.get("/:id", getProjectByIdCtrl);
router.post("/", createProjectCtrl);
router.put("/:id", updateProjectCtrl);
router.delete("/:id", deleteProjectCtrl);

module.exports = router;