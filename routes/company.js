const express = require("express");
const { validateCompany, validateCompanyUpdate } = require("../validators/company");
const { createCompanyCtrl, updateCompanyCtrl } = require("../controllers/company");
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/", requireAuth, validateCompany, createCompanyCtrl);
router.patch("/:id", requireAuth, validateCompany, updateCompanyCtrl);
router.patch("/:id/logo", requireAuth, upload.single("logo"), validateCompanyUpdate, updateCompanyCtrl);

module.exports = router;