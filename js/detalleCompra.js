function showDetail(){
    // Línea de compra HTML
    let cartRowHTML = '';
    let itemCount = 0;
    let total = 0;
    // Obtengo los items guardados
    const cart = getCart();
    if (cart.length > 0) {
        itemCount = cart.length;
        cart.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseFloat(item.quantity) || 0;
            const subtotal = price * quantity;
            cartRowHTML += `<div class="row mb-4 d-flex justify-content-between align-items-center">
                        <div class="col-md-3 col-lg-3 col-xl-3">
                          <h6 class="text-muted name-merch">${item.name}</h6>
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                          <input min="0" name="quantity" value="${item.quantity}" type="number"
                            class="form-control form-control-sm quantity-merch" onchange="updateCartItemQty(this)" data-id="${item.id}"  />
                        </div>
                        <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                          <h6 class="mb-0 price-merch">$ ${item.price.toFixed(2)}</h6>
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-1 ">
                          <button type="button" class="btn btn-secondary" onclick="eliminarItem(${item.id})"><i class="bi bi-trash"></i></button>
                        </div>
                        <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                          <h6 class="mb-0 subtotal-merch">$ ${subtotal.toFixed(2)}</h6>
                        </div>
                      </div>
                      <hr class="my-4">`;
            total += subtotal;
        });
    }
    document.getElementById("detail").innerHTML = cartRowHTML;
    document.getElementById("total-items").textContent = itemCount;
    document.getElementById("total-compra").textContent = "$" + total.toFixed(2);
}

function eliminarItem(idMerch){
    let cartArray = getCart();
    if (cartArray.length > 0) {
        cartArray = cartArray.filter((item) => item.id !== idMerch);
        toastr.warning("Producto eliminado", "Compra");
    } else {
        toastr.info("Seleccione productos a comprar", "Compra");
    }
    saveCart(cartArray);
    showDetail();
}

/**
 * Actualiza la cantidad de un item en el carrito.
 * @param {HTMLElement} element El input de cantidad que desencadenó el evento.
 */
function updateCartItemQty(element) {
    const idMerch = element.dataset.id;
    const newQuantity = parseInt(element.value, 10);
    if (isNaN(newQuantity)) {
        toastr.error("La cantidad no es un número válido.", "Error de Entrada");
        showDetail();
        return;
    }

    let cartArray = getCart();
    const itemIndex = cartArray.findIndex((obj) => obj.id == idMerch);

    if (itemIndex !== -1) {
        if (newQuantity < 0 || newQuantity == 0) {
            toastr.warning(
                "La cantidad no puede ser negativa o cero.",
                "Advertencia"
            );
            element.value = cartArray[itemIndex].quantity;
        } else {
            cartArray[itemIndex].quantity = newQuantity;
            saveCart(cartArray);
            showDetail();
            toastr.success(
                `Cantidad de "${cartArray[itemIndex].name}" actualizada a ${newQuantity}.`,
                "Cantidad Actualizada"
            );
        }
    } else {
        toastr.error("El producto no se encontró en el carrito.", "Error");
        showDetail();
    }
}