const Item = require("../models/Item");

// ➤ Créer un Item
exports.createItems = async (req, res) => {
    try {
        const newItem = new Item({
            name: req.body.name,
            description: req.body.description
        });

        await newItem.save();
        console.log("✅ Données enregistrées !");
        return res.redirect("/accueil");
    } catch (err) {
        console.log("❌ Erreur lors de l'ajout !");
        return res.redirect("/accueil");
    }
};


// ➤ Supprimer un Item
exports.deleteItems = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        console.log("Item supprimé");
        return res.redirect("/accueil");

    } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        return res.redirect("/accueil");
    }
};

// ➤ Trouver un Item
exports.searchItems = async (req, res) => {
    try {
        const foundItem = await Item.findById(req.params.id);
        if (!foundItem) {
            console.log("Item non trouvé");
            return res.redirect("/accueil");
        }
        return res.status(200).json(foundItem);

    } catch (err) {
        console.error("Erreur lors de la recherche :", err);
        return res.redirect("/accueil");
    }
};

// ➤ Mettre à jour un Item
exports.updateItems = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log("Item mis à jour :", updatedItem);
        return res.redirect("/accueil");

    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        return res.redirect("/accueil");
    }
};
