// Elementos del DOM
const btnNuevaRevision = document.getElementById('btnNuevaRevision');
const btnVolverInicio = document.getElementById('btnVolverInicio');

// Nueva revisión - volver a selección de ambulancia
btnNuevaRevision.addEventListener('click', () => {
    limpiarDatos();
    window.location.href = 'seleccion-ambulancia.html';
});

// Volver a inicio - pantalla principal
btnVolverInicio.addEventListener('click', () => {
    limpiarDatos();
    window.location.href = 'principal.html';
});

// Limpiar todos los datos del flujo
function limpiarDatos() {
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
    localStorage.removeItem('reposicionData');
}

// Limpiar datos al cargar la página
document.addEventListener('DOMContentLoaded', limpiarDatos);
