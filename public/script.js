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

        if (response.ok) {
            fetchItems(); // Recharger la liste après suppression
        } else {
            alert("Erreur lors de la suppression !");
        }
    }
}

// Fonction pour mettre à jour un item
async function updateItem(id) {
    const newName = prompt("Nouveau nom :");
    const newDescription = prompt("Nouvelle description :");

    if (newName && newDescription) {
        const response = await fetch(`/api/items/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, description: newDescription })
        });

        if (response.ok) {
            fetchItems(); // Recharger la liste après modification
        } else {
            alert("Erreur lors de la mise à jour !");
        }
    }
}
