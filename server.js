require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ➤ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ➤ Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static("public"));
console.log("📂 Fichiers statiques servis depuis 'public/'");

const path = require("path");

app.get("/accueil", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "accueil.html"));
});




// ➤ Import des routes
const itemRoutes = require("./routes/items");
app.use("/api/items", itemRoutes);

// ➤ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch(err => console.log("❌ Erreur MongoDB :", err));

// ➤ Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
