document.addEventListener('DOMContentLoaded', function() {
    const numTarjetaInput = document.getElementById('numTarjeta');
    const vencimientoInput = document.getElementById('vencimiento');
    const cvvInput = document.getElementById('cvv');
    const nombreTarjetaInput = document.getElementById('nombreTarjeta');
    const correoInput = document.getElementById('correo');
    const direccionInput = document.getElementById('direccion');
    const pagarBtn = document.querySelector('button');

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
        
        // Si todo es válido, proceder con el pago
        if (formularioValido) {
            toastr.success(`Pago realizado con éxito`,
            'Procesando pago...')
        }
    });
});
