const API_URL = 'http://localhost:5021/api';

document.addEventListener('DOMContentLoaded', async () => {
    await cargarTiposServicio();
});

async function cargarTiposServicio() {
    try {
        const response = await fetch(`${API_URL}/Servicio`);
        const servicios = await response.json();
        
        const select = document.getElementById('servicio');
        
        // Agregar opciones predefinidas más comunes
        const tiposServicio = [
            'Emergencia médica',
            'Accidente de tráfico',
            'Traslado programado',
            'Traslado urgente',
            'Asistencia domiciliaria',
            'Revisión cardiaca',
            'Revisión rutinaria',
            'Servicio preventivo',
            'Servicio especial',
            'Otros'
        ];
        
        tiposServicio.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error al cargar servicios:', error);
    }
}

function continuarServicio() {
    const tipoServicio = document.getElementById('servicio').value;
    
    if (!tipoServicio) {
        alert('Por favor, seleccione un tipo de servicio');
        return;
    }
    
    localStorage.setItem('tipoServicio', tipoServicio);
    location.href = 'responsable.html';
}
