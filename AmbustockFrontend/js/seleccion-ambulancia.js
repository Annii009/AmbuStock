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
        console.log('Ambulancias recibidas:', ambulancias);

        // Limpiar el select
        selectAmbulancia.innerHTML = '<option value="">Seleccionar unidad</option>';
        
        // Añadir las ambulancias al select
        ambulancias.forEach(ambulancia => {
            const option = document.createElement('option');
            option.value = ambulancia.idAmbulancia; // CAMBIO: IdAmbulancia → idAmbulancia
            
            // Construir texto, priorizando Nombre > Matricula > ID
            let texto = 'Ambulancia';
            
            if (ambulancia.nombre && ambulancia.nombre.trim() !== '') { // CAMBIO: Nombre → nombre
                texto = ambulancia.nombre.trim();
            } else if (ambulancia.matricula && ambulancia.matricula.trim() !== '') { // CAMBIO: Matricula → matricula
                texto = `Ambulancia ${ambulancia.matricula.trim()}`;
            } else {
                texto = `Ambulancia #${ambulancia.idAmbulancia}`; // CAMBIO: IdAmbulancia → idAmbulancia
            }
            
            option.textContent = texto;
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
        localStorage.setItem('ambulanciaSeleccionada', ambulanciaId);
        window.location.href = 'tipo-servicio.html';
    }
});

// Cargar ambulancias al iniciar
document.addEventListener('DOMContentLoaded', cargarAmbulancias);
