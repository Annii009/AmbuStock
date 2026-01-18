const API_URL = 'http://localhost:5021/api';
let revisionData = null;
let ambulanciaId = null;
let currentZonaIndex = null;

const zonasList = document.getElementById('zonasList');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const btnFinalizar = document.getElementById('btnFinalizar');
const modal = document.getElementById('modalZona');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const backButton = document.getElementById('backButton');
const btnSelectAll = document.getElementById('btnSelectAll');

async function cargarRevision() {
    try {
        ambulanciaId = localStorage.getItem('ambulanciaSeleccionada');
        
        console.log('ID Ambulancia:', ambulanciaId);
        
        if (!ambulanciaId || ambulanciaId === 'undefined' || ambulanciaId === 'null') {
            alert('No se ha seleccionado ninguna ambulancia');
            window.location.href = 'seleccion-ambulancia.html';
            return;
        }

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
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
        
        inicializarCantidadesRevisadas();
        cargarEstadoGuardado();
        renderizarZonas();
        actualizarProgreso();

    } catch (error) {
        console.error('Error completo:', error);
        alert(`Error al cargar la revisión: ${error.message}`);
    }
}

function inicializarCantidadesRevisadas() {
    revisionData.zonas.forEach(zona => {
        if (zona.materiales) {
            zona.materiales.forEach(material => {
                if (material.cantidadRevisada === undefined) {
                    material.cantidadRevisada = 0;
                }
            });
        }
        if (zona.cajones) {
            zona.cajones.forEach(cajon => {
                if (cajon.materiales) {
                    cajon.materiales.forEach(material => {
                        if (material.cantidadRevisada === undefined) {
                            material.cantidadRevisada = 0;
                        }
                    });
                }
            });
        }
    });
}

function renderizarZonas() {
    zonasList.innerHTML = '';
    
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

function contarTotalMateriales(zona) {
    let total = zona.materiales ? zona.materiales.length : 0;
    if (zona.cajones) {
        zona.cajones.forEach(cajon => {
            total += cajon.materiales ? cajon.materiales.length : 0;
        });
    }
    return total;
}

function contarMaterialesRevisados(zona) {
    let revisados = 0;
    
    if (zona.materiales) {
        revisados += zona.materiales.filter(m => m.cantidadRevisada === m.cantidad).length;
    }
    
    if (zona.cajones) {
        zona.cajones.forEach(cajon => {
            if (cajon.materiales) {
                revisados += cajon.materiales.filter(m => m.cantidadRevisada === m.cantidad).length;
            }
        });
    }
    
    return revisados;
}

function abrirModalZona(zona, zonaIndex) {
    currentZonaIndex = zonaIndex;
    modalTitle.textContent = zona.nombreZona;
    modalBody.innerHTML = '';
    
    if (zona.cajones && zona.cajones.length > 0) {
        zona.cajones.forEach((cajon, cajonIndex) => {
            const cajonSection = document.createElement('div');
            cajonSection.className = 'cajon-section';
            
            const cajonHeader = document.createElement('div');
            cajonHeader.className = 'cajon-header expanded';
            cajonHeader.innerHTML = `
                <h3>${cajon.nombreCajon}</h3>
                <button class="btn-select-cajon" data-zona="${zonaIndex}" data-cajon="${cajonIndex}">
                    Seleccionar cajón
                </button>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;
            
            const cajonMaterials = document.createElement('div');
            cajonMaterials.className = 'cajon-materials show';
            
            if (cajon.materiales) {
                cajon.materiales.forEach((material, materialIndex) => {
                    cajonMaterials.appendChild(crearMaterialItem(material, zonaIndex, cajonIndex, materialIndex));
                });
            }
            
            const btnSelectCajon = cajonHeader.querySelector('.btn-select-cajon');
            btnSelectCajon.addEventListener('click', (e) => {
                e.stopPropagation();
                seleccionarCajon(zonaIndex, cajonIndex);
            });
            
            const toggleBtn = cajonHeader.querySelector('svg').parentElement;
            toggleBtn.addEventListener('click', () => {
                cajonHeader.classList.toggle('expanded');
                cajonMaterials.classList.toggle('show');
            });
            
            cajonSection.appendChild(cajonHeader);
            cajonSection.appendChild(cajonMaterials);
            modalBody.appendChild(cajonSection);
        });
    }
    
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

function crearMaterialItem(material, zonaIndex, cajonIndex, materialIndex) {
    const materialItem = document.createElement('div');
    materialItem.className = 'material-item';
    materialItem.innerHTML = `
        <div class="material-info">
            <div class="material-name">${material.nombreProducto}</div>
            <div class="material-cantidad">Cantidad esperada: ${material.cantidad}</div>
        </div>
        <div class="quantity-controls">
            <button class="btn-quantity minus" data-zona="${zonaIndex}" data-cajon="${cajonIndex}" data-material="${materialIndex}">
                −
            </button>
            <span class="quantity-value">${material.cantidadRevisada || 0}</span>
            <button class="btn-quantity plus" data-zona="${zonaIndex}" data-cajon="${cajonIndex}" data-material="${materialIndex}">
                +
            </button>
        </div>
    `;
    
    const btnMinus = materialItem.querySelector('.btn-quantity.minus');
    const btnPlus = materialItem.querySelector('.btn-quantity.plus');
    
    btnMinus.addEventListener('click', (e) => {
        e.stopPropagation();
        cambiarCantidad(zonaIndex, cajonIndex, materialIndex, -1);
    });
    
    btnPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        cambiarCantidad(zonaIndex, cajonIndex, materialIndex, 1);
    });
    
    return materialItem;
}

function cambiarCantidad(zonaIndex, cajonIndex, materialIndex, cambio) {
    let material;
    
    if (cajonIndex === null) {
        material = revisionData.zonas[zonaIndex].materiales[materialIndex];
    } else {
        material = revisionData.zonas[zonaIndex].cajones[cajonIndex].materiales[materialIndex];
    }
    
    const nuevaCantidad = (material.cantidadRevisada || 0) + cambio;
    
    if (nuevaCantidad >= 0 && nuevaCantidad <= material.cantidad) {
        material.cantidadRevisada = nuevaCantidad;
        
        guardarEstado();
        
        const zona = revisionData.zonas[zonaIndex];
        abrirModalZona(zona, zonaIndex);
        renderizarZonas();
        actualizarProgreso();
    }
}

function seleccionarCajon(zonaIndex, cajonIndex) {
    const cajon = revisionData.zonas[zonaIndex].cajones[cajonIndex];
    
    if (cajon.materiales) {
        cajon.materiales.forEach(material => {
            material.cantidadRevisada = material.cantidad;
        });
    }
    
    guardarEstado();
    
    const zona = revisionData.zonas[zonaIndex];
    abrirModalZona(zona, zonaIndex);
    renderizarZonas();
    actualizarProgreso();
}

btnSelectAll.addEventListener('click', () => {
    if (currentZonaIndex === null) return;
    
    const zona = revisionData.zonas[currentZonaIndex];
    
    if (zona.materiales) {
        zona.materiales.forEach(material => {
            material.cantidadRevisada = material.cantidad;
        });
    }
    
    if (zona.cajones) {
        zona.cajones.forEach(cajon => {
            if (cajon.materiales) {
                cajon.materiales.forEach(material => {
                    material.cantidadRevisada = material.cantidad;
                });
            }
        });
    }
    
    guardarEstado();
    abrirModalZona(zona, currentZonaIndex);
    renderizarZonas();
    actualizarProgreso();
});

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
    
    btnFinalizar.disabled = false;
}

function obtenerMaterialesFaltantes() {
    const materialesFaltantes = [];
    
    revisionData.zonas.forEach((zona, zonaIndex) => {
        if (zona.materiales) {
            zona.materiales.forEach(material => {
                const cantidadFaltante = material.cantidad - (material.cantidadRevisada || 0);
                if (cantidadFaltante > 0) {
                    materialesFaltantes.push({
                        nombreProducto: material.nombreProducto,
                        cantidadFaltante: cantidadFaltante,
                        nombreZona: zona.nombreZona,
                        nombreCajon: null,
                        ubicacion: zona.nombreZona
                    });
                }
            });
        }
        
        if (zona.cajones) {
            zona.cajones.forEach(cajon => {
                if (cajon.materiales) {
                    cajon.materiales.forEach(material => {
                        const cantidadFaltante = material.cantidad - (material.cantidadRevisada || 0);
                        if (cantidadFaltante > 0) {
                            materialesFaltantes.push({
                                nombreProducto: material.nombreProducto,
                                cantidadFaltante: cantidadFaltante,
                                nombreZona: zona.nombreZona,
                                nombreCajon: cajon.nombreCajon,
                                ubicacion: `${cajon.nombreCajon} - ${zona.nombreZona}`
                            });
                        }
                    });
                }
            });
        }
    });
    
    return materialesFaltantes;
}

function guardarEstado() {
    localStorage.setItem(`revision_${ambulanciaId}`, JSON.stringify(revisionData));
}

function cargarEstadoGuardado() {
    const estadoGuardado = localStorage.getItem(`revision_${ambulanciaId}`);
    if (estadoGuardado) {
        const estadoData = JSON.parse(estadoGuardado);
        if (revisionData.zonas && estadoData.zonas) {
            revisionData.zonas.forEach((zona, zIndex) => {
                if (zona.materiales && estadoData.zonas[zIndex] && estadoData.zonas[zIndex].materiales) {
                    zona.materiales.forEach((material, mIndex) => {
                        if (estadoData.zonas[zIndex].materiales[mIndex]) {
                            material.cantidadRevisada = estadoData.zonas[zIndex].materiales[mIndex].cantidadRevisada || 0;
                        }
                    });
                }
                if (zona.cajones && estadoData.zonas[zIndex] && estadoData.zonas[zIndex].cajones) {
                    zona.cajones.forEach((cajon, cIndex) => {
                        if (cajon.materiales && estadoData.zonas[zIndex].cajones[cIndex] && estadoData.zonas[zIndex].cajones[cIndex].materiales) {
                            cajon.materiales.forEach((material, mIndex) => {
                                if (estadoData.zonas[zIndex].cajones[cIndex].materiales[mIndex]) {
                                    material.cantidadRevisada = estadoData.zonas[zIndex].cajones[cIndex].materiales[mIndex].cantidadRevisada || 0;
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
    currentZonaIndex = null;
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        currentZonaIndex = null;
    }
});

backButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres salir? El progreso se guardará automáticamente.')) {
        window.location.href = 'nombre-responsable.html';
    }
});

// Finalizar revisión y guardarla
btnFinalizar.addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const ambulanciaId = localStorage.getItem('ambulanciaSeleccionada');
        const servicioId = localStorage.getItem('servicioSeleccionado');
        const nombreResponsable = localStorage.getItem('nombreResponsable');
        const faltantes = obtenerMaterialesFaltantes();

        // Guardar materiales faltantes en el localStorage
        localStorage.setItem('materialesFaltantes', JSON.stringify(faltantes));
        
        const revisionCompleta = {
            idAmbulancia: parseInt(ambulanciaId),
            idServicio: parseInt(servicioId),
            nombreResponsable: nombreResponsable,
            fechaRevision: new Date().toISOString(),
            zonas: revisionData.zonas
        };
        
        console.log('Guardando revisión:', revisionCompleta);
        
        // Guardar la revisión en el backend
        const response = await fetch(`${API_URL}/Revision`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(revisionCompleta)
        });

        if (!response.ok) {
            throw new Error('Error al guardar la revisión');
        }

        const result = await response.json();
        console.log('Revisión guardada:', result);
        
        // Limpiar estado guardado de la revisión
        localStorage.removeItem(`revision_${ambulanciaId}`);

        window.location.href = 'materiales-faltantes.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar la revisión: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', cargarRevision);
