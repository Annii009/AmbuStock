// Elementos del DOM
const backButton = document.getElementById('backButton');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const userName = document.getElementById('userName');
const modalCerrarSesion = document.getElementById('modalCerrarSesion');
const btnCancelar = document.getElementById('btnCancelar');
const btnConfirmarCerrar = document.getElementById('btnConfirmarCerrar');

// Cargar datos del usuario
document.addEventListener('DOMContentLoaded', () => {
    const usuarioData = localStorage.getItem('usuario');
    
    if (usuarioData) {
        try {
            const usuario = JSON.parse(usuarioData);
            // Buscar el nombre en diferentes posibles campos
            if (usuario.nombreResponsable) {
                userName.textContent = usuario.nombreResponsable.toUpperCase();
            } else if (usuario.nombreCompleto) {
                userName.textContent = usuario.nombreCompleto.toUpperCase();
            } else if (usuario.nombre) {
                userName.textContent = usuario.nombre.toUpperCase();
            } else if (usuario.email) {
                userName.textContent = usuario.email.split('@')[0].toUpperCase();
            } else {
                userName.textContent = 'USUARIO';
            }
        } catch (error) {
            console.error('Error al parsear usuario:', error);
            userName.textContent = 'USUARIO';
        }
    } else {
        // Si no hay usuario, redirigir al login
        window.location.href = 'index.html';
    }
});

// Volver atrás
backButton.addEventListener('click', () => {
    window.location.href = 'principal.html';
});

// Mostrar modal de cerrar sesión
btnCerrarSesion.addEventListener('click', () => {
    modalCerrarSesion.style.display = 'flex';
});

// Cancelar cierre de sesión
btnCancelar.addEventListener('click', () => {
    modalCerrarSesion.style.display = 'none';
});

// Confirmar cierre de sesión
btnConfirmarCerrar.addEventListener('click', () => {
    // Limpiar datos locales
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
    localStorage.removeItem('reposicionData');
    
    // Redirigir al login
    window.location.href = 'index.html';
});

// Cerrar modal al hacer clic fuera de él
modalCerrarSesion.addEventListener('click', (e) => {
    if (e.target === modalCerrarSesion) {
        modalCerrarSesion.style.display = 'none';
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCerrarSesion.style.display === 'flex') {
        modalCerrarSesion.style.display = 'none';
    }
});
