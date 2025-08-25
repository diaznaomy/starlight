document.addEventListener('DOMContentLoaded', function() {
    const numTarjetaInput = document.getElementById('numTarjeta');
    const vencimientoInput = document.getElementById('vencimiento');
    const cvvInput = document.getElementById('cvv');
    const nombreTarjetaInput = document.getElementById('nombreTarjeta');
    const correoInput = document.getElementById('correo');
    const direccionInput = document.getElementById('direccion');
    const pagarBtn = document.querySelector('button');
    const envioPostalInput = document.getElementById('envioPostal');
    const direccionEnvioInput = document.getElementById('direccionEnvio');

    let envioAplicado = false;
    const COSTO_ENVIO = 2500;

    if (envioPostalInput) {
        envioPostalInput.addEventListener('change', function() {
            if (this.checked && !envioAplicado) {
                agregarCostoEnvio();
                envioAplicado = true;
                direccionEnvioInput.classList.remove('hidden');
            } else if (!this.checked && envioAplicado) {
                quitarCostoEnvio();
                envioAplicado = false;
                direccionEnvioInput.classList.add('hidden');
            }
        });
    }

    function obtenerTotalSinEnvio() {
        // Calcula el total del carrito sin el costo de envío
        const cart = JSON.parse(localStorage.getItem("compra")) || [];
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        return total;
    }

    function agregarCostoEnvio() {
        const totalCompra = document.getElementById('total-compra');
        let total = obtenerTotalSinEnvio();
        total += COSTO_ENVIO;
        totalCompra.textContent = `$${total.toFixed(2)}`;
    }

    function quitarCostoEnvio() {
        const totalCompra = document.getElementById('total-compra');
        let total = obtenerTotalSinEnvio();
        totalCompra.textContent = `$${total.toFixed(2)}`;
    }

    // Función para mostrar errores
    function mostrarError(elemento) {
        // Cambiar borde a rojo
        elemento.classList.add('border-red-500');
        elemento.classList.remove('border-green-500');
    }

    // Función para quitar errores
    function quitarError(elemento) {
        const error = elemento.parentNode.querySelector('.error-msg');
        if (error) {
            error.remove();
        }
        elemento.classList.remove('border-red-500');
        elemento.classList.add('border-green-500');
    }

    // Validación del número de tarjeta (16 dígitos exactos)
    function validarNumeroTarjeta(numero) {
        // Remover espacios y caracteres no numéricos
        const numeroLimpio = numero.replace(/\D/g, '');
        
        // Debe tener exactamente 16 dígitos
        if (numeroLimpio.length !== 16) {
            return false;
        }
        
        return true;
    }

    // Validación de fecha de caducidad
    function validarFechaCaducidad(fecha) {
        // Para input type="month" el formato es YYYY-MM
        if (!fecha) return false;
        
        const [año, mes] = fecha.split('-');
        const añoNum = parseInt(año);
        const mesNum = parseInt(mes);
        
        // Validar mes (01-12)
        if (mesNum < 1 || mesNum > 12) {
            return false;
        }
        
        // Validar que no sea anterior al año actual
        const fechaActual = new Date();
        const añoActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1;
        
        if (añoNum < añoActual || (añoNum === añoActual && mesNum < mesActual)) {
            return false;
        }
        
        return true;
    }

    // Validación del CVV (3 o 4 dígitos)
    function validarCVV(cvv) {
        const cvvLimpio = cvv.replace(/\D/g, '');
        
        // Debe tener 3 o 4 dígitos (3 para Visa/Mastercard, 4 para American Express)
        if (cvvLimpio.length !== 3 && cvvLimpio.length !== 4) {
            return false;
        }
        
        return true;
    }

    // Validación del nombre del titular
    function validarNombreTitular(nombre) {
        // Regex para aceptar letras, espacios, tildes, ñ, apóstrofes y guiones
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'\-]{2,60}$/;
        
        if (!regexNombre.test(nombre)) {
            return false;
        }
        
        // Verificar longitud
        if (nombre.trim().length < 2 || nombre.trim().length > 60) {
            return false;
        }
        
        return true;
    }

    // Validación de correo electrónico
    function validarCorreo(correo) {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCorreo.test(correo);
    }

    // Event listeners para validación en tiempo real
    numTarjetaInput.addEventListener('input', function() {
        // Solo permitir números y formatear
        let valor = this.value.replace(/\D/g, '');
        
        // Limitar a 16 dígitos
        if (valor.length > 16) {
            valor = valor.substring(0, 16);
        }
        
        // Formatear con espacios cada 4 dígitos
        valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
        this.value = valor;
        
        // Validar
        if (validarNumeroTarjeta(this.value)) {
            quitarError(this);
        } else {
            mostrarError(this, 'El número de tarjeta debe contener exactamente 16 dígitos');
        }
    });

    vencimientoInput.addEventListener('change', function() {
        if (validarFechaCaducidad(this.value)) {
            quitarError(this);
        } else {
            mostrarError(this, 'La fecha de caducidad no puede ser anterior al mes actual');
        }
    });

    cvvInput.addEventListener('input', function() {
        // Solo permitir números
        let valor = this.value.replace(/\D/g, '');
        
        // Limitar a 4 dígitos
        if (valor.length > 4) {
            valor = valor.substring(0, 4);
        }
        
        this.value = valor;
        
        // Validar
        if (validarCVV(this.value)) {
            quitarError(this);
        } else {
            mostrarError(this, 'El CVV debe tener 3 dígitos (Visa/Mastercard) o 4 dígitos (American Express)');
        }
    });

    nombreTarjetaInput.addEventListener('input', function() {
        // Convertir a mayúsculas como aparece en las tarjetas
        this.value = this.value.toUpperCase();
        
        if (validarNombreTitular(this.value)) {
            quitarError(this);
        } else {
            mostrarError(this, 'El nombre debe tener entre 2 y 60 caracteres, solo letras, espacios, tildes y guiones');
        }
    });

    correoInput.addEventListener('input', function() {
        if (validarCorreo(this.value)) {
            quitarError(this);
        } else {
            mostrarError(this, 'Ingrese un correo electrónico válido');
        }
    });

    // Validación al enviar el formulario
    pagarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        let formularioValido = true;
        
        // Validar todos los campos
        if (!validarNumeroTarjeta(numTarjetaInput.value)) {
            toastr.error(`El número de tarjeta: "${numTarjetaInput.value}" es inválido`,
            'Número de Tarjeta Invalida')
            mostrarError(numTarjetaInput);
            formularioValido = false;
        }
        
        if (!validarFechaCaducidad(vencimientoInput.value)) {
            toastr.error(`La fecha de caducidad: "${vencimientoInput.value}" es inválida`,
            'Fecha de Caducidad Invalida')
            mostrarError(vencimientoInput);
            formularioValido = false;
        }
        
        if (!validarCVV(cvvInput.value)) {
            toastr.error(`El CVV: "${cvvInput.value}" es inválido`,
            'CVV Invalido')
            mostrarError(cvvInput);
            formularioValido = false;
        }
        
        if (!validarNombreTitular(nombreTarjetaInput.value)) {
            toastr.error(`El nombre del titular: "${nombreTarjetaInput.value}" es inválido`,
            'Nombre del Titular Invalido')
            mostrarError(nombreTarjetaInput);
            formularioValido = false;
        }
        
        if (!validarCorreo(correoInput.value)) {
            toastr.error(`El correo electrónico: "${correoInput.value}" es inválido`,
            'Correo Electrónico Invalido')
            mostrarError(correoInput);
            formularioValido = false;
        }
        
        if (!direccionInput.value.trim()) {
            toastr.error(`La dirección: "${direccionInput.value}" es inválida`,
            'Dirección Invalida')
            mostrarError(direccionInput);
            formularioValido = false;
        }

        if (!direccionEnvioInput.value.trim() && envioPostalInput.checked) {
            toastr.error(`La dirección de envío: "${direccionEnvioInput.value}" es inválida`,
            'Dirección Invalida')
            mostrarError(direccionEnvioInput);
            formularioValido = false;
        }
        
        // Si todo es válido, proceder con el pago
        if (formularioValido) {
            toastr.success(`Pago realizado con éxito`,
            'Procesando pago...')
        }
    });

    function renderCart() {
        const detailDiv = document.getElementById("detail");
        const totalItems = document.getElementById("total-items");
        const totalCompra = document.getElementById("total-compra");
        const cart = JSON.parse(localStorage.getItem("compra")) || [];

        let total = 0;
        let items = 0;
        detailDiv.innerHTML = "";

        cart.forEach((item, idx) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            items += item.quantity;

            const row = document.createElement("div");
            row.className = "row mb-4 d-flex justify-content-between align-items-center";
            row.innerHTML = `
                <div class="col-md-3 col-lg-3 col-xl-3">
                    <h6 class="text-muted name-libro">${item.name}${item.talla ? " (" + item.talla + ")" : ""}</h6>
                </div>
                <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                    <input min="1" name="quantity" value="${item.quantity}" type="number"
                        class="form-control form-control-sm quantity-libro" data-idx="${idx}" />
                </div>
                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h6 class="mb-0 price-libro">$${item.price.toFixed(2)}</h6>
                </div>
                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h6 class="mb-0 subtotal-libro">$${subtotal.toFixed(2)}</h6>
                </div>
                <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <button type="button" class="btn btn-secondary btn-remove" data-idx="${idx}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            detailDiv.appendChild(row);
        });

        totalItems.textContent = `${items} item(s)`;

        // Si el envío postal está marcado, suma el costo de envío
        let totalFinal = total;
        if (envioPostalInput && envioPostalInput.checked) {
            totalFinal += COSTO_ENVIO;
        }
        totalCompra.textContent = `$${totalFinal.toFixed(2)}`;
    }

    // Renderiza el carrito al cargar
    renderCart();

    // Eliminar producto del carrito sin recargar
    document.getElementById("detail").addEventListener("click", function(e) {
        if (e.target.closest(".btn-remove")) {
            const idx = e.target.closest(".btn-remove").dataset.idx;
            const cart = JSON.parse(localStorage.getItem("compra")) || [];
            cart.splice(idx, 1);
            localStorage.setItem("compra", JSON.stringify(cart));
            toastr.info("Producto eliminado del carrito");
            renderCart();
        }
    });

    // Cambiar cantidad sin recargar
    document.getElementById("detail").addEventListener("change", function(e) {
        if (e.target.classList.contains("quantity-libro")) {
            const idx = e.target.dataset.idx;
            let value = parseInt(e.target.value, 10);
            if (isNaN(value) || value < 1) value = 1;
            const cart = JSON.parse(localStorage.getItem("compra")) || [];
            cart[idx].quantity = value;
            localStorage.setItem("compra", JSON.stringify(cart));
            toastr.success("Cantidad actualizada");
            renderCart();
        }
    });
});
