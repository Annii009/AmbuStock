// Elementos del DOM
const selectAmbulancia = document.getElementById('ambulancia');
const btnContinuar = document.getElementById('btnContinuar');

// URL del backend
const API_URL = 'http://localhost:5021/api';

// Cargar ambulancias desde el backend
async function cargarAmbulancias() {
    try {
        // Mostrar loading
        selectAmbulancia.classList.add('loading');
        selectAmbulancia.innerHTML = '<option value="">Cargando...</option>';
        selectAmbulancia.disabled = true;

        // Obtener token del localStorage
        const token = localStorage.getItem('token');
        
        // if (!token) {
        //     window.location.href = 'login.html';
        //     return;
        // }

        // Hacer petición al backend
        const response = await fetch(`${API_URL}/Ambulancia`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar ambulancias');
        }

        const ambulancias = await response.json();

        // Limpiar el select
        selectAmbulancia.innerHTML = '<option value="">Seleccionar unidad</option>';
        
        // Añadir las ambulancias al select
        ambulancias.forEach(ambulancia => {
            const option = document.createElement('option');
            option.value = ambulancia.id;
            option.textContent = ambulancia.nombre || ambulancia.matricula || `Ambulancia ${ambulancia.id}`;
            selectAmbulancia.appendChild(option);
        });

        // Restaurar estado normal
        selectAmbulancia.classList.remove('loading');
        selectAmbulancia.disabled = false;

    } catch (error) {
        console.error('Error:', error);
        selectAmbulancia.innerHTML = '<option value="">Error al cargar ambulancias</option>';
        selectAmbulancia.classList.remove('loading');
    }
}

// Habilitar/deshabilitar botón continuar
selectAmbulancia.addEventListener('change', () => {
    btnContinuar.disabled = !selectAmbulancia.value;
});

// Continuar a la siguiente pantalla
btnContinuar.addEventListener('click', () => {
    const ambulanciaId = selectAmbulancia.value;
    
    if (ambulanciaId) {
        // Guardar la ambulancia seleccionada
        localStorage.setItem('ambulanciaSeleccionada', ambulanciaId);
        
        // Ir a tipo de servicio
        window.location.href = 'tipo-servicio.html';
    }
});


// Cargar ambulancias al iniciar
document.addEventListener('DOMContentLoaded', cargarAmbulancias);
