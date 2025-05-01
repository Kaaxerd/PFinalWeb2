const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
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

router.use(requireAuth);
router.post("/", createClientCtrl);
router.put("/:id", updateClientCtrl);
router.get("/", getClientsCtrl);
router.get("/:id", getClientByIdCtrl);
router.patch("/archive/:id", archiveClientCtrl);
router.delete("/:id", deleteClientCtrl);
router.get("/archived/all", getArchivedClientsCtrl);
router.patch("/restore/:id", restoreClientCtrl);

module.exports = router;