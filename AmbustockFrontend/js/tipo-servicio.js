// Elementos del DOM
const selectServicio = document.getElementById('servicio');
const btnContinuar = document.getElementById('btnContinuar');

// URL del backend
const API_URL = 'http://localhost:5002';

// Cargar tipos de servicio desde el backend
async function cargarServicios() {
    try {
        // Mostrar loading
        selectServicio.classList.add('loading');
        selectServicio.innerHTML = '<option value="">Cargando...</option>';
        selectServicio.disabled = true;

        // Obtener token del localStorage
        const token = localStorage.getItem('token');

        // Hacer petición al backend
        const response = await fetch(`${API_URL}/api/Servicio`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar servicios');
        }

        const servicios = await response.json();

        // Limpiar el select
        selectServicio.innerHTML = '<option value="">Seleccionar servicio</option>';
        
        // Añadir los servicios al select
        servicios.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio.idServicio;
            option.textContent = servicio.nombreServicio;
            selectServicio.appendChild(option);
        });

        // Restaurar estado normal
        selectServicio.classList.remove('loading');
        selectServicio.disabled = false;

    } catch (error) {
        console.error('Error:', error);
        selectServicio.innerHTML = '<option value="">Error al cargar servicios</option>';
        selectServicio.classList.remove('loading');
    }
}

// Habilitar/deshabilitar botón continuar
selectServicio.addEventListener('change', () => {
    btnContinuar.disabled = !selectServicio.value;
});

// Continuar a la siguiente pantalla
btnContinuar.addEventListener('click', () => {
    const servicioId = selectServicio.value;
    
    if (servicioId) {
        // Guardar el servicio seleccionado
        localStorage.setItem('servicioSeleccionado', servicioId);
        
        // Ir a la siguiente pantalla
        window.location.href = 'nombre-responsable.html';
    }
});

// Cargar servicios al iniciar
document.addEventListener('DOMContentLoaded', cargarServicios);
