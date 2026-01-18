const API_URL = 'http://localhost:5021/api';
const materialesList = document.getElementById('materialesList');
const cantidadFaltantes = document.getElementById('cantidadFaltantes');
const btnFinalizar = document.getElementById('btnFinalizar');
const backButton = document.getElementById('backButton');

function cargarMaterialesFaltantes() {
    const materialesFaltantesStr = localStorage.getItem('materialesFaltantes');
    
    if (!materialesFaltantesStr) {
        window.location.href = 'principal.html';
        return;
    }
    
    const materialesFaltantes = JSON.parse(materialesFaltantesStr);
    
    cantidadFaltantes.textContent = materialesFaltantes.length;
    
    if (materialesFaltantes.length === 0) {
        const noFaltantes = document.createElement('div');
        noFaltantes.style.textAlign = 'center';
        noFaltantes.style.padding = '20px';
        noFaltantes.style.color = '#666';
        noFaltantes.textContent = '¡Todos los materiales están completos!';
        materialesList.appendChild(noFaltantes);
    } else {
        materialesFaltantes.forEach(material => {
            const materialItem = document.createElement('div');
            materialItem.className = 'material-faltante';
            materialItem.innerHTML = `
                <div class="material-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <div class="material-info">
                    <div class="material-nombre">${material.nombreProducto}</div>
                    <div class="material-falta">Falta: ${material.cantidadFaltante}</div>
                    <div class="material-ubicacion">${material.ubicacion}</div>
                </div>
            `;
            
            materialesList.appendChild(materialItem);
        });
    }
}

// Obtener datos de la ambulancia
async function obtenerAmbulancia(id) {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/Ambulancia/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error al obtener ambulancia:', error);
    }
    return null;
}

// Guardar reposición automática por materiales faltantes
async function guardarReposicionMaterialesFaltantes() {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const ambulanciaId = localStorage.getItem('ambulanciaSeleccionada');
        const nombreResponsable = localStorage.getItem('nombreResponsable');
        const materialesFaltantes = JSON.parse(localStorage.getItem('materialesFaltantes') || '[]');
        
        if (materialesFaltantes.length === 0) return;
        
        // Obtener datos de la ambulancia
        const ambulancia = await obtenerAmbulancia(ambulanciaId);
        
        // Preparar datos de la reposición
        const reposicion = {
            id: Date.now(),
            idReposicion: Date.now(),
            idAmbulancia: parseInt(ambulanciaId),
            nombreAmbulancia: ambulancia?.nombre || 'N/A',
            matricula: ambulancia?.matricula || 'N/A',
            nombreResponsable: nombreResponsable || 'Sin responsable',
            fechaReposicion: new Date().toISOString(),
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            origen: 'revision',
            materiales: materialesFaltantes.map(m => ({
                nombreProducto: m.nombreProducto,
                cantidad: m.cantidadFaltante,
                cantidadFaltante: m.cantidadFaltante,
                stockActual: 0,
                ubicacion: m.ubicacion
            })),
            materialesFaltantes: materialesFaltantes
        };
        
        console.log('Guardando reposición por materiales faltantes:', reposicion);
        
        // Intentar guardar en backend
        try {
            const response = await fetch(`${API_URL}/Reposicion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reposicion)
            });

            if (response.ok) {
                console.log('Reposición guardada en backend');
            } else {
                throw new Error('Error al guardar en backend');
            }
        } catch (errorBackend) {
            console.log('Backend no disponible, guardando solo en localStorage');
        }
        
        // Siempre guardar también en localStorage como backup
        let historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
        historial.push(reposicion);
        localStorage.setItem('historialReposiciones', JSON.stringify(historial));
        
        console.log('Reposición guardada en historial');
        
    } catch (error) {
        console.error('Error al guardar reposición:', error);
    }
}

btnFinalizar.addEventListener('click', async () => {
    // Guardar reposición antes de limpiar
    await guardarReposicionMaterialesFaltantes();
    
    // Limpiar datos
    localStorage.removeItem('materialesFaltantes');
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
    
    window.location.href = 'mision-cumplida.html';
});

backButton.addEventListener('click', () => {
    window.location.href = 'revision.html';
});

document.addEventListener('DOMContentLoaded', cargarMaterialesFaltantes);
