function saveCart(cartArray){
    localStorage.setItem("compra", JSON.stringify(cartArray));
    console.log("Carrito guardado: ", cartArray);
}

function getCart(){
    const cart = localStorage.getItem("compra");
    return cart ? JSON.parse(cart) : [];
}

function addToCart(idMerch){
    // Obtener merch completo
    const item = merch.find((m) => m.id == idMerch);
    // Objeto a guardar
    const cartItem = {
        id: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: 1,
    };
    let cartArray = getCart();
    // Buscar si el item existe en el carrito
    const indexItem = cartArray.findIndex((merch) => merch.id === idMerch);

    if (indexItem !== -1) {
        // Item existente
        cartArray[indexItem].quantity += 1;
        toastr.info(`Cantidad de "${cartItem.name}" actualizada a ${cartArray[indexItem].quantity}`,
            'Carrito Actualizado');
    } else {
        // Si el item no existe, lo agrega al carrito
        cartArray.push(cartItem);
        toastr.success(
            `"${cartItem.name}" agregado al carrito`,
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