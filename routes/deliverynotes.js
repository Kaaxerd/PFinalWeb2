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

router.use(requireAuth);

router.post("/", createDeliveryNoteCtrl);
router.get("/", getAllDeliveryNotesCtrl);
router.get("/:id", getDeliveryNoteByIdCtrl);
router.get("/pdf/:id", getDeliveryNotePdfCtrl);
router.post("/sign/:id", requireAuth, upload.single("signature"), signDeliveryNoteCtrl);
router.delete("/:id", deleteDeliveryNoteCtrl);

module.exports = router;