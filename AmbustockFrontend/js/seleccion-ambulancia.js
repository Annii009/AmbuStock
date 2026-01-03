const API_URL = 'http://localhost:5021/api'; // Ajusta según tu puerto

// Cargar ambulancias al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await cargarAmbulancias();
});

async function cargarAmbulancias() {
    try {
        const response = await fetch(`${API_URL}/Ambulancia`);
        const ambulancias = await response.json();
        
        const select = document.getElementById('ambulancia');
        
        ambulancias.forEach(ambulancia => {
            const option = document.createElement('option');
            option.value = ambulancia.idAmbulancia;
            option.textContent = `${ambulancia.nombre} - ${ambulancia.matricula}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar ambulancias:', error);
        alert('Error al cargar las ambulancias. Por favor, intente de nuevo.');
    }
}

function continuarSeleccion() {
    const ambulanciaId = document.getElementById('ambulancia').value;
    
    if (!ambulanciaId) {
        alert('Por favor, seleccione una ambulancia');
        return;
    }
    
    // Guardar en localStorage para usar en otras páginas
    localStorage.setItem('ambulanciaId', ambulanciaId);
    
    // Ir a siguiente página
    location.href = 'tipo-servicio.html';
}
