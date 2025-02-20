document.addEventListener("DOMContentLoaded", () => {
    fetchItems(); // Charger les items au chargement de la page

    document.getElementById("addItemForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;

        const response = await fetch("/api/items/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description })
        });

        if (response.ok) {
            fetchItems(); // Recharger la liste après ajout
            document.getElementById("addItemForm").reset();
        } else {
            alert("Erreur lors de l'ajout !");
        }
    });
});

// Fonction pour récupérer et afficher les items
async function fetchItems() {
    const response = await fetch("/api/items/all-items");
    const items = await response.json();

    const tableBody = document.getElementById("itemsTable");
    tableBody.innerHTML = ""; // Réinitialiser la table

    items.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>
                <button onclick="updateItem('${item._id}')">Modifier</button>
                <button onclick="deleteItem('${item._id}')">Supprimer</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Fonction pour supprimer un item
async function deleteItem(id) {
    if (confirm("Voulez-vous vraiment supprimer cet item ?")) {
        const response = await fetch(`/api/items/delete/${id}`, { method: "DELETE" });

        fetchItems();
    }
}

// Fonction pour mettre à jour un item
async function updateItem(id) {
    try {
        // Récupérer l'item actuel
        const response = await fetch(`/api/items/search/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'item");

        const item = await response.json();

        // Demander à l'utilisateur de modifier (pré-remplir avec les valeurs actuelles)
        const newName = prompt("Nouveau nom :", item.name) || item.name;
        const newDescription = prompt("Nouvelle description :", item.description) || item.description;

        // Envoyer les modifications si au moins un champ a changé
        if (newName !== item.name || newDescription !== item.description) {
            const updateResponse = await fetch(`/api/items/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, description: newDescription })
            });

            //if (!updateResponse.ok) throw new Error("Erreur lors de la mise à jour");

            fetchItems(); // Recharger la liste après modification
        }

    } catch (error) {
        alert(`❌ ${error.message}`);
    }
}



document.getElementById("searchName").addEventListener("input", searchItem);

// Fonction pour rechercher un item par nom
async function searchItem() {
    const itemName = document.getElementById("searchName").value.trim();

    // Ne pas effectuer la recherche si le champ est vide
    if (!itemName) {
        document.getElementById("searchResult").innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`/api/items/search-by-name/${itemName}`);

        if (!response.ok) {
            throw new Error("Item non trouvé !");
        }

        const items = await response.json();

        if (items.length === 0) {
            document.getElementById("searchResult").innerHTML = `<p style="color: red;">❌ Aucun item trouvé avec ce nom.</p>`;
            return;
        }

        // Affichage des résultats
        let resultHTML = "<h3>Résultats de la recherche :</h3>";
        items.forEach(item => {
            resultHTML += `
                <p><strong>Nom :</strong> ${item.name}</p>
                <p><strong>Description :</strong> ${item.description}</p>
                <hr>
            `;
        });

        document.getElementById("searchResult").innerHTML = resultHTML;

    } catch (error) {
        document.getElementById("searchResult").innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
    }
}