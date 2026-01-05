// Variables globales
const API_URL = 'http://localhost:5021/api';
let revisionData = null;
let ambulanciaId = null;

// Elementos del DOM
const zonasList = document.getElementById('zonasList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const btnFinalizar = document.getElementById('btnFinalizar');
const modal = document.getElementById('modalZona');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const backButton = document.getElementById('backButton');

// Cargar datos de la revisión
async function cargarRevision() {
    try {
        ambulanciaId = localStorage.getItem('ambulanciaSeleccionada');
        
        console.log('ID Ambulancia:', ambulanciaId);
        
        if (!ambulanciaId || ambulanciaId === 'undefined' || ambulanciaId === 'null') {
            alert('No se ha seleccionado ninguna ambulancia');
            window.location.href = 'seleccion-ambulancia.html';
            return;
        }

        const token = localStorage.getItem('token');
        const url = `${API_URL}/Revision/ambulancia/${ambulanciaId}`;
        console.log('URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        revisionData = await response.json();
        console.log('Datos recibidos:', revisionData);
        
        cargarEstadoGuardado();
        renderizarZonas();
        actualizarProgreso();

    } catch (error) {
        console.error('Error completo:', error);
        alert(`Error al cargar la revisión: ${error.message}`);
    }
}

// Renderizar lista de zonas
function renderizarZonas() {
    zonasList.innerHTML = '';
    
    // CAMBIO: Zonas → zonas
    if (!revisionData.zonas || !Array.isArray(revisionData.zonas)) {
        console.error('No hay zonas disponibles');
        return;
    }
    
    revisionData.zonas.forEach((zona, index) => {
        const totalMateriales = contarTotalMateriales(zona);
        const materialesRevisados = contarMaterialesRevisados(zona);
        const completada = totalMateriales === materialesRevisados && totalMateriales > 0;
        
        const zonaItem = document.createElement('div');
        zonaItem.className = `zona-item ${completada ? 'completed' : ''}`;
        zonaItem.innerHTML = `
            <div class="zona-content">
                <div class="zona-name">${zona.nombreZona}</div>
                <div class="zona-progress">${materialesRevisados}/${totalMateriales} materiales revisados</div>
            </div>
            ${completada ? 
                '<div class="zona-check">✓</div>' : 
                `<div class="zona-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>`
            }
        `;
        
        zonaItem.addEventListener('click', () => abrirModalZona(zona, index));
        zonasList.appendChild(zonaItem);
    });
}

// Contar total de materiales en una zona
function contarTotalMateriales(zona) {
    let total = zona.materiales ? zona.materiales.length : 0;
    if (zona.cajones) {
        zona.cajones.forEach(cajon => {
            total += cajon.materiales ? cajon.materiales.length : 0;
        });
    }
    return total;
}

// Contar materiales revisados en una zona
function contarMaterialesRevisados(zona) {
    let revisados = zona.materiales ? zona.materiales.filter(m => m.revisado).length : 0;
    if (zona.cajones) {
        zona.cajones.forEach(cajon => {
            revisados += cajon.materiales ? cajon.materiales.filter(m => m.revisado).length : 0;
        });
    }
    return revisados;
}

// Abrir modal de zona
function abrirModalZona(zona, zonaIndex) {
    modalTitle.textContent = zona.nombreZona;
    modalBody.innerHTML = '';
    
    // Renderizar cajones
    if (zona.cajones && zona.cajones.length > 0) {
        zona.cajones.forEach((cajon, cajonIndex) => {
            const cajonSection = document.createElement('div');
            cajonSection.className = 'cajon-section';
            
            const cajonHeader = document.createElement('div');
            cajonHeader.className = 'cajon-header';
            cajonHeader.innerHTML = `
                <h3>${cajon.nombreCajon}</h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;
            
            const cajonMaterials = document.createElement('div');
            cajonMaterials.className = 'cajon-materials';
            
            if (cajon.materiales) {
                cajon.materiales.forEach((material, materialIndex) => {
                    cajonMaterials.appendChild(crearMaterialItem(material, zonaIndex, cajonIndex, materialIndex));
                });
            }
            
            cajonHeader.addEventListener('click', () => {
                cajonHeader.classList.toggle('expanded');
                cajonMaterials.classList.toggle('show');
            });
            
            cajonSection.appendChild(cajonHeader);
            cajonSection.appendChild(cajonMaterials);
            modalBody.appendChild(cajonSection);
        });
    }
    
    // Renderizar materiales sin cajón
    if (zona.materiales && zona.materiales.length > 0) {
        const materialesDirectos = document.createElement('div');
        materialesDirectos.className = 'materiales-directos';
        
        if (zona.cajones && zona.cajones.length > 0) {
            const title = document.createElement('div');
            title.className = 'materiales-directos-title';
            title.textContent = 'Materiales sueltos';
            materialesDirectos.appendChild(title);
        }
        
        zona.materiales.forEach((material, materialIndex) => {
            materialesDirectos.appendChild(crearMaterialItem(material, zonaIndex, null, materialIndex));
        });
        
        modalBody.appendChild(materialesDirectos);
    }
    
    modal.classList.add('show');
}

// Crear elemento de material
function crearMaterialItem(material, zonaIndex, cajonIndex, materialIndex) {
    const materialItem = document.createElement('div');
    materialItem.className = 'material-item';
    materialItem.innerHTML = `
        <div class="material-info">
            <div class="material-name">${material.nombreProducto}</div>
            <div class="material-cantidad">Cantidad: ${material.cantidad}</div>
        </div>
        <div class="material-check ${material.revisado ? 'checked' : ''}" 
             data-zona="${zonaIndex}" 
             data-cajon="${cajonIndex}" 
             data-material="${materialIndex}">
        </div>
    `;
    
    const checkButton = materialItem.querySelector('.material-check');
    checkButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMaterialRevisado(zonaIndex, cajonIndex, materialIndex);
    });
    
    return materialItem;
}

// Toggle estado de material revisado
function toggleMaterialRevisado(zonaIndex, cajonIndex, materialIndex) {
    if (cajonIndex === null) {
        revisionData.zonas[zonaIndex].materiales[materialIndex].revisado = 
            !revisionData.zonas[zonaIndex].materiales[materialIndex].revisado;
    } else {
        revisionData.zonas[zonaIndex].cajones[cajonIndex].materiales[materialIndex].revisado = 
            !revisionData.zonas[zonaIndex].cajones[cajonIndex].materiales[materialIndex].revisado;
    }
    
    guardarEstado();
    
    const zona = revisionData.zonas[zonaIndex];
    abrirModalZona(zona, zonaIndex);
    renderizarZonas();
    actualizarProgreso();
}

// Actualizar progreso general
function actualizarProgreso() {
    let totalMateriales = 0;
    let materialesRevisados = 0;
    
    revisionData.zonas.forEach(zona => {
        totalMateriales += contarTotalMateriales(zona);
        materialesRevisados += contarMaterialesRevisados(zona);
    });
    
    const porcentaje = totalMateriales > 0 ? Math.round((materialesRevisados / totalMateriales) * 100) : 0;
    
    progressBar.style.width = `${porcentaje}%`;
    progressText.textContent = `${porcentaje}%`;
    
    btnFinalizar.disabled = porcentaje !== 100;
}

// Guardar estado en localStorage
function guardarEstado() {
    localStorage.setItem(`revision_${ambulanciaId}`, JSON.stringify(revisionData));
}

// Cargar estado guardado
function cargarEstadoGuardado() {
    const estadoGuardado = localStorage.getItem(`revision_${ambulanciaId}`);
    if (estadoGuardado) {
        const estadoData = JSON.parse(estadoGuardado);
        if (revisionData.zonas && estadoData.zonas) {
            revisionData.zonas.forEach((zona, zIndex) => {
                if (zona.materiales && estadoData.zonas[zIndex] && estadoData.zonas[zIndex].materiales) {
                    zona.materiales.forEach((material, mIndex) => {
                        if (estadoData.zonas[zIndex].materiales[mIndex]) {
                            material.revisado = estadoData.zonas[zIndex].materiales[mIndex].revisado;
                        }
                    });
                }
                if (zona.cajones && estadoData.zonas[zIndex] && estadoData.zonas[zIndex].cajones) {
                    zona.cajones.forEach((cajon, cIndex) => {
                        if (cajon.materiales && estadoData.zonas[zIndex].cajones[cIndex] && estadoData.zonas[zIndex].cajones[cIndex].materiales) {
                            cajon.materiales.forEach((material, mIndex) => {
                                if (estadoData.zonas[zIndex].cajones[cIndex].materiales[mIndex]) {
                                    material.revisado = estadoData.zonas[zIndex].cajones[cIndex].materiales[mIndex].revisado;
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}

// Cerrar modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Botón volver
backButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres salir? El progreso se guardará automáticamente.')) {
        window.location.href = 'nombre-responsable.html';
    }
});

// Finalizar revisión
btnFinalizar.addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token');
        const ambulanciaId = localStorage.getItem('ambulanciaSeleccionada');
        const servicioId = localStorage.getItem('servicioSeleccionado');
        const nombreResponsable = localStorage.getItem('nombreResponsable');
        
        const revisionCompleta = {
            idAmbulancia: parseInt(ambulanciaId),
            idServicio: parseInt(servicioId),
            nombreResponsable: nombreResponsable,
            fechaRevision: new Date().toISOString(),
            zonas: revisionData.zonas
        };
        
        console.log('Revisión completada:', revisionCompleta);
        
        localStorage.removeItem(`revision_${ambulanciaId}`);
        localStorage.removeItem('ambulanciaSeleccionada');
        localStorage.removeItem('servicioSeleccionado');
        localStorage.removeItem('nombreResponsable');
        
        alert('¡Revisión completada exitosamente!');
        window.location.href = 'principal.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al finalizar la revisión');
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', cargarRevision);
