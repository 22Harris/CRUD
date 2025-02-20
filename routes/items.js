const express = require("express");
const router = express.Router();
const path = require("path");
const Item = require("../models/Item");
const controller = require("../controllers/itemControllers");

// ➤ Afficher tous les Items
router.get("/all-items", async (req, res) => {
    try {
        const allItems = await Item.find();
        return res.status(200).json(allItems);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// ➤ Retourner la page d'accueil
router.get("/accueil", (req, res) => {
    return res.sendFile(path.join(__dirname, "../public/accueil.html"));
});

// ➤ CRUD Routes
router.post("/create", controller.createItems);
router.delete("/delete/:id", controller.deleteItems);
router.get("/search/:id", controller.searchItems);
router.put("/update/:id", controller.updateItems);

module.exports = router;
