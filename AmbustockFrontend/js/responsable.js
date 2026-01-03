const API_URL = 'http://localhost:5021/api';

document.addEventListener('DOMContentLoaded', async () => {
    await cargarResponsables();
});

async function cargarResponsables() {
    try {
        const response = await fetch(`${API_URL}/Responsable`);
        const responsables = await response.json();
        
        const select = document.getElementById('responsable');
        
        responsables.forEach(responsable => {
            const option = document.createElement('option');
            option.value = responsable.idResponsable;
            option.textContent = responsable.nombreResponsable;
            select.appendChild(option);
        });
        
        // Escuchar cambios en el select
        select.addEventListener('change', async (e) => {
            const responsableId = e.target.value;
            if (responsableId) {
                await cargarDetalleResponsable(responsableId);
            }
        });
        
    } catch (error) {
        console.error('Error al cargar responsables:', error);
    }
}

async function cargarDetalleResponsable(responsableId) {
    try {
        const response = await fetch(`${API_URL}/Responsable/${responsableId}`);
        const responsable = await response.json();
        
        // Mostrar información del servicio asociado
        if (responsable.idServicio) {
            const servicioResponse = await fetch(`${API_URL}/Servicio/${responsable.idServicio}`);
            const servicio = await servicioResponse.json();
            
            document.getElementById('servicio-responsable').value = servicio.nombreServicio || 'Sin servicio asignado';
        }
        
    } catch (error) {
        console.error('Error al cargar detalle del responsable:', error);
    }
}

async function continuarResponsable() {
    const responsableId = document.getElementById('responsable').value;
    
    if (!responsableId) {
        alert('Por favor, seleccione un responsable');
        return;
    }
    
    localStorage.setItem('responsableId', responsableId);
    
    // Crear el servicio completo
    await crearServicio();
}

async function crearServicio() {
    try {
        const ambulanciaId = localStorage.getItem('ambulanciaId');
        const tipoServicio = localStorage.getItem('tipoServicio');
        const responsableId = localStorage.getItem('responsableId');
        
        // Crear servicio
        const servicioData = {
            fechaHora: new Date().toISOString(),
            nombreServicio: tipoServicio,
            idResponsable: parseInt(responsableId)
        };
        
        const response = await fetch(`${API_URL}/Servicio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicioData)
        });
        
        if (response.ok) {
            const servicio = await response.json();
            localStorage.setItem('servicioId', servicio.idServicio);
            
            // Relacionar servicio con ambulancia
            await relacionarServicioAmbulancia(servicio.idServicio, ambulanciaId);
            
            alert('Servicio creado correctamente');
            location.href = 'revision-materiales.html'; // Próxima pantalla
        }
        
    } catch (error) {
        console.error('Error al crear servicio:', error);
        alert('Error al crear el servicio');
    }
}

async function relacionarServicioAmbulancia(servicioId, ambulanciaId) {
    try {
        const data = {
            idAmbulancia: parseInt(ambulanciaId),
            idServicio: parseInt(servicioId)
        };
        
        await fetch(`${API_URL}/ServicioAmbulancia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
    } catch (error) {
        console.error('Error al relacionar servicio-ambulancia:', error);
    }
}
