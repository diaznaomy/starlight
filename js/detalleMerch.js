document.addEventListener("DOMContentLoaded", () => {
    // Obtener los parámetros
    const urlParams = new URLSearchParams(window.location.search);
    // Obtener el parámetro id
    const idParam = urlParams.get("id");
    console.log("Merch ID", idParam);
    if (!idParam) {
        merchNoEncontrado();
        return;
    }
    // Obtener el producto merch
    const item = merch.find((m) => m.id == idParam);

    if (!item) {
        merchNoEncontrado();
        return;
    }
    console.log("Merch encontrado", item);
    // Mostrar el producto en el HTML
    document.getElementById("title").textContent = item.nombre;
    document.getElementById("price").textContent = "$" + item.precio;
    document.getElementById("descripcion").textContent = item.descripcion || "Sin descripción";
    // Tallas
    document.getElementById("tallas").textContent = item.tallas?.join(", ") || "Sin tallas";
    // Categorías badges
    const categoriesContainer = document.getElementById("categories");
    categoriesContainer.innerHTML = "";
    if (item.categories?.length > 0) {
        item.categories.forEach((cat) => {
            const badge = document.createElement("span");
            badge.className = "badge bg-primary";
            badge.textContent = cat;
            categoriesContainer.appendChild(badge);
        });
    } else {
        categoriesContainer.textContent = "Sin categorías";
    }
    // Imagen principal
    const img = document.getElementById("image");
    if (item.imagen) {
        img.src = item.imagen;
        img.alt = item.nombre;
    }
    // Imagen secundaria (opcional)
    const img2 = document.getElementById("image2");
    if (img2 && item.imagen2) {
        img2.src = item.imagen2;
        img2.alt = item.nombre + " reverso";
    }
});

function merchNoEncontrado() {
    document.getElementById("detalle").classList.add("d-none");
    document.getElementById("alertNotFound").classList.remove("d-none");
}