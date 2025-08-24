document.addEventListener("DOMContentLoaded", () => {
    // Lista de productos
    displayMerch(merch);
    // Lista de categorías
    displayCategorias();
    const filterSelect = document.getElementById("filter");
    filterSelect.addEventListener("change", () => {
        // Valor de la categoría seleccionada
        const category = filterSelect.value;
        // Lista de productos filtrados
        let filteredMerch;
        if (category === "all") {
            // Todos los productos
            filteredMerch = merch;
        } else {
            // Alguna categoría específica
            filteredMerch = merch.filter(item =>
                item.categories && item.categories.includes(category)
            );
        }
        displayMerch(filteredMerch);
    });
});

function displayBooks(data){
    //Div de lista de libros
    const bookList=document.getElementById("book-list")
    //Limpiar el contenido de la lista
    bookList.innerHTML=""
    
    data.forEach(book => {
       const col=document.createElement("div") 
       col.innerHTML=`<div class="card h-100 d-flex flex-column shadow-sm libro-item">
        <img src="${book.thumbnailUrl}" class="card-img-top img-fluid"
          style="max-height: 200px; width: auto; object-fit: contain;" onerror="this.src='img/image-not-found.jpg';"
          alt="Portada de ${book.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-center text-shadow-custom libro-name">${book.title}</h5>
          <p class="card-text text-center"><b>ISBN</b>:${book.isbn}</p>
          <h5 class="card-text text-info text-center fw-bold mb-0">&cent;${book.price}</h5>
          <div class="input-group mb-3">
            <span class="input-group-text">Cantidad</span>
            <input type="number" class="form-control libro-quantity" value="1" min="1">
          </div>
          <div class="mt-auto d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-success" onclick="comprarLibro(${book._id})">
              <i class="bi bi-cart-plus"></i>
            </button>
            <button class="btn btn-primary" onclick="detalleLibro(${book._id})" data-id="${book._id}">
              <i class="bi bi-three-dots" ></i>
            </button>
          </div>
        </div>
      </div>`
        bookList.appendChild(col)
    });
}

function displayMerch(data){
    const merchList = document.getElementById("merch-list");
    merchList.innerHTML = "";

    data.forEach(item => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-4 mb-4";
        col.innerHTML = `<div class="producto">
            <img src="${item.imagen}" alt="Imagen de ${item.nombre}">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <div class="precio">&cent;${item.precio}</div>
            <br>
            ${item.tallas ? `
                <div class="tallas-lista mb-3">
                    ${item.tallas.map(talla => `<button type="button" class="talla-btn">${talla}</button>`).join("")}
                </div>` : ""}
            <div class="input-group mb-3">
                <span class="input-group-text">Cantidad</span>
                <input type="number" class="form-control merch-quantity" value="1" min="1">
            </div>
            <div class="mt-auto d-flex gap-3 justify-content-center">
                <button class="btn-carrito" onclick="comprarMerch(${item.id})">
                    <img src="../img/anadir-al-carrito.png" alt="Añadir al carrito">
                </button>
                <button class="btn-info" onclick="detalleMerch(${item.id})" data-id="${item.id}">
                    <img src="../img/informacion.png" alt="Información">
                </button>
            </div>
        </div>`;
        merchList.appendChild(col);
    });
}

function displayCategorias(){
    // Cargar las categorias
    const select = document.getElementById("filter");
    select.innerHTML = ""; // Limpiar opciones previas

    // Agregar opción "Todos"
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Todos";
    select.appendChild(allOption);

    // Obtener categorías únicas de merch
    const categories = new Set();
    merch.forEach(item => {
        if (item.categories) {
            item.categories.forEach(category => {
                categories.add(category);
            });
        }
    });

    // Cargar las categorías en el select
    for (const category of categories) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    }
}
