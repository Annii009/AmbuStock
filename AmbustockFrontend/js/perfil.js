// Elementos del DOM
const backButton = document.getElementById('backButton');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const userName = document.getElementById('userName');

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

// Cerrar sesión
btnCerrarSesion.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
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
    }
});
