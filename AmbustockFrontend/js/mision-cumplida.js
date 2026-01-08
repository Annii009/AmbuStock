// Elementos del DOM
const btnNuevaRevision = document.getElementById('btnNuevaRevision');
const btnMaterialGastado = document.getElementById('btnMaterialGastado');

// Nueva revisión - volver a selección de ambulancia
btnNuevaRevision.addEventListener('click', () => {
    window.location.href = 'principal.html';
});

// Material gastado - ir a la pantalla de material gastado
btnMaterialGastado.addEventListener('click', () => {
    window.location.href = 'material-gastado.html';
});

// Limpiar datos de la sesión cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Limpiar solo los datos de la revisión, mantener el token
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
});
