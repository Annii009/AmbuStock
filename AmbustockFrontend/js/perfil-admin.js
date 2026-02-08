const backButton = document.getElementById('backButton');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const userName = document.getElementById('userName');
const modalCerrarSesion = document.getElementById('modalCerrarSesion');
const btnCancelar = document.getElementById('btnCancelar');
const btnConfirmarCerrar = document.getElementById('btnConfirmarCerrar');

// Verificar que el usuario es administrador
document.addEventListener('DOMContentLoaded', () => {
    const usuarioData = localStorage.getItem('usuario');
    
    if (usuarioData) {
        try {
            const usuario = JSON.parse(usuarioData);
            
            // Verificar que sea administrador
            if (usuario.rol !== 'Administrador') {
                alert('No tienes permisos para acceder a esta página');
                window.location.href = 'perfil.html';
                return;
            }
            
            // Mostrar nombre del usuario
            if (usuario.nombreResponsable) {
                userName.textContent = usuario.nombreResponsable.toUpperCase();
            } else if (usuario.nombreCompleto) {
                userName.textContent = usuario.nombreCompleto.toUpperCase();
            } else if (usuario.nombre) {
                userName.textContent = usuario.nombre.toUpperCase();
            } else if (usuario.nombreUsuario) {
                userName.textContent = usuario.nombreUsuario.toUpperCase();
            } else if (usuario.email) {
                userName.textContent = usuario.email.split('@')[0].toUpperCase();
            } else {
                userName.textContent = 'ADMIN';
            }
        } catch (error) {
            console.error('Error al parsear usuario:', error);
            userName.textContent = 'ADMIN';
        }
    } else {
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
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
    localStorage.removeItem('reposicionData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    window.location.href = 'index.html';
});

// Cerrar modal al hacer clic fuera
modalCerrarSesion.addEventListener('click', (e) => {
    if (e.target === modalCerrarSesion) {
        modalCerrarSesion.style.display = 'none';
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCerrarSesion.style.display === 'flex') {
        modalCerrarSesion.style.display = 'none';
    }
});
