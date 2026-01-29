// Elementos del DOM
const backButton = document.getElementById('backButton');
const comentarios = document.getElementById('comentarios');
const fileInput = document.getElementById('fileInput');
const btnUpload = document.getElementById('btnUpload');
const photosGrid = document.getElementById('photosGrid');
const btnContinuar = document.getElementById('btnContinuar');

// const API_URL = 'http://localhost:5002';
const API_URL = 'https://charles-uncompanioned-unvalorously.ngrok-free.dev';
let fotosSeleccionadas = [];

// Abrir selector de archivos
btnUpload.addEventListener('click', () => {
    fileInput.click();
});

// Manejar selección de fotos
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                fotosSeleccionadas.push({
                    file: file,
                    dataUrl: event.target.result
                });
                renderizarFotos();
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    fileInput.value = '';
});

// Renderizar fotos
function renderizarFotos() {
    photosGrid.innerHTML = fotosSeleccionadas.map((foto, index) => `
        <div class="photo-item">
            <img src="${foto.dataUrl}" alt="Foto ${index + 1}">
            <button class="btn-remove-photo" onclick="eliminarFoto(${index})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

window.eliminarFoto = (index) => {
    fotosSeleccionadas.splice(index, 1);
    renderizarFotos();
};

// Obtener datos de la ambulancia
async function obtenerAmbulancia(id) {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/api/Ambulancia/${id}`, {
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

// Guardar reposición en el historial
async function guardarReposicionEnHistorial(reposicionData) {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const ambulanciaId = localStorage.getItem('ambulanciaSeleccionada');
        
        // Obtener datos de la ambulancia
        const ambulancia = await obtenerAmbulancia(ambulanciaId);
        
        // Preparar datos de la reposición para el historial
        const reposicion = {
            id: Date.now(),
            idReposicion: Date.now(),
            idAmbulancia: parseInt(ambulanciaId),
            nombreAmbulancia: ambulancia?.nombre || 'N/A',
            matricula: ambulancia?.matricula || 'N/A',
            nombreResponsable: reposicionData.responsable,
            fechaReposicion: new Date().toISOString(),
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            servicio: reposicionData.servicio,
            comentarios: reposicionData.comentarios || '',
            fotos: reposicionData.fotos || [],
            materiales: reposicionData.materiales.map(m => ({
                nombreProducto: m.nombreProducto,
                cantidad: m.cantidad,
                cantidadFaltante: m.cantidad,
                stockActual: 0,
                ubicacion: m.ubicacion || m.nombreZona || 'N/A'
            })),
            materialesFaltantes: reposicionData.materiales
        };
        
        console.log('Guardando reposición en historial:', reposicion);
        
        // Intentar guardar en backend
        try {
            const response = await fetch(`${API_URL}/api/Reposicion`, {
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

// Continuar a resumen
btnContinuar.addEventListener('click', async () => {
    const reposicionData = JSON.parse(localStorage.getItem('reposicionData') || '{}');
    
    reposicionData.comentarios = comentarios.value.trim();
    reposicionData.fotos = fotosSeleccionadas;
    
    localStorage.setItem('reposicionData', JSON.stringify(reposicionData));
    
    // Guardar en el historial de reposiciones
    await guardarReposicionEnHistorial(reposicionData);
    
    window.location.href = 'todo-listo.html';
});

backButton.addEventListener('click', () => {
    window.location.href = 'material-gastado.html';
});
