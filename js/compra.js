function saveCart(cartArray){
    localStorage.setItem("compra", JSON.stringify(cartArray));
    console.log("Carrito guardado: ", cartArray);
}

function getCart(){
    const cart = localStorage.getItem("compra");
    return cart ? JSON.parse(cart) : [];
}

function addToCart(idMerch, talla = null, cantidad = 1) {
    const item = merch.find((m) => m.id == idMerch);
    const cartItem = {
        id: item.id,
        name: item.nombre,
        price: item.precio,
        talla: talla,
        quantity: cantidad,
    };
    let cartArray = getCart();

    // Buscar si el item existe en el carrito (considerando talla)
    const indexItem = cartArray.findIndex((merch) => merch.id === idMerch && merch.talla === talla);

    if (indexItem !== -1) {
        cartArray[indexItem].quantity += cantidad;
        toastr.info(`Cantidad de "${cartItem.name}" (${talla ? 'Talla ' + talla : 'Sin talla'}) actualizada a ${cartArray[indexItem].quantity}`,
            'Carrito Actualizado');
    } else {
        cartArray.push(cartItem);
        toastr.success(
            `"${cartItem.name}"${talla ? ' (Talla ' + talla + ')' : ''} agregado al carrito`,
            'Producto Agregado'
        );
    }

    saveCart(cartArray);
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }