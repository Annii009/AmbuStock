const API_URL = 'http://localhost:5002';
let reposicionData = null;
let reposicionId = null;
let materialesModificados = {};

// Elementos del DOM
const backButton = document.getElementById('backButton');
const infoTitle = document.getElementById('infoTitle');
const estadoBadge = document.getElementById('estadoBadge');
const counterNumber = document.getElementById('counterNumber');
const materialesList = document.getElementById('materialesList');
const btnConfirmar = document.getElementById('btnConfirmar');

// Obtener ID de la URL
function obtenerIdReposicion() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Cargar reposición
async function cargarReposicion() {
    try {
        reposicionId = obtenerIdReposicion();
        
        if (!reposicionId) {
            alert('No se ha especificado una reposición');
            window.location.href = 'historial-reposiciones.html';
            return;
        }

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        // Intentar cargar desde backend
        try {
            const response = await fetch(`${API_URL}/api/Reposicion/${reposicionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                reposicionData = await response.json();
            } else {
                throw new Error('Backend no disponible');
            }
        } catch (errorBackend) {
            console.log('Backend no disponible, cargando desde localStorage');
            // Fallback: buscar en localStorage
            const historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
            reposicionData = historial.find(r => r.id == reposicionId || r.idReposicion == reposicionId);
            
            if (!reposicionData) {
                alert('Reposición no encontrada');
                window.location.href = 'historial-reposiciones.html';
                return;
            }
        }
        
        console.log('Reposición cargada:', reposicionData);
        
        mostrarInfoReposicion();
        renderizarMateriales();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar la reposición');
    }
}

// Mostrar info de la reposición
function mostrarInfoReposicion() {
    const fecha = formatearFecha(reposicionData.fechaReposicion || reposicionData.fecha);
    infoTitle.textContent = `Reposición ${reposicionData.nombreAmbulancia || 'A.M.50.9'} - ${fecha}`;
    
    const estado = reposicionData.estado || 'pendiente';
    estadoBadge.textContent = estado;
    estadoBadge.className = `estado-badge ${estado.toLowerCase()}`;
}

// Renderizar materiales
function renderizarMateriales() {
    const materiales = reposicionData.materiales || reposicionData.materialesFaltantes || [];
    
    counterNumber.textContent = materiales.length;
    
    materialesList.innerHTML = materiales.map((material, index) => {
        const cantidadReponer = materialesModificados[index] !== undefined 
            ? materialesModificados[index] 
            : 0;
        
        const stockActual = material.stockActual || 0;
        const requerido = material.cantidadFaltante || material.cantidad || 0;
        
        return `
            <div class="material-card">
                <div class="material-header">
                    <div class="material-name">${material.nombreProducto || material.nombre}</div>
                    <div class="material-badge ${stockActual === 0 ? 'faltante' : 'stock-bajo'}">
                        ${stockActual === 0 ? 'faltante' : 'Stock bajo'}
                    </div>
                </div>
                <div class="material-ubicacion">
                    Ubicación: ${material.ubicacion || material.nombreZona || 'N/A'}
                </div>
                <div class="material-stocks">
                    <div class="stock-item">
                        <div class="stock-label">Stock actual</div>
                        <div class="stock-value">${stockActual}</div>
                    </div>
                    <div class="stock-item">
                        <div class="stock-label">Requerido</div>
                        <div class="stock-value required">${requerido}</div>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="btn-quantity minus" data-index="${index}" ${cantidadReponer === 0 ? 'disabled' : ''}>
                        −
                    </button>
                    <div class="quantity-display">${cantidadReponer}</div>
                    <button class="btn-quantity plus" data-index="${index}">
                        +
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Añadir event listeners a los botones
    document.querySelectorAll('.btn-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const esMinus = e.target.classList.contains('minus');
            cambiarCantidad(index, esMinus ? -1 : 1);
        });
    });
}

// Cambiar cantidad
function cambiarCantidad(index, cambio) {
    const cantidadActual = materialesModificados[index] || 0;
    const nuevaCantidad = Math.max(0, cantidadActual + cambio);
    
    materialesModificados[index] = nuevaCantidad;
    renderizarMateriales();
}

// Formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `${dia} ${mes} ${año}`;
}

// Confirmar reposición
btnConfirmar.addEventListener('click', async () => {
    if (!confirm('¿Confirmar esta reposición?')) return;
    
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        // Preparar datos
        const materialesReponiendo = Object.entries(materialesModificados)
            .filter(([index, cantidad]) => cantidad > 0)
            .map(([index, cantidad]) => {
                const material = (reposicionData.materiales || reposicionData.materialesFaltantes)[index];
                return {
                    nombreProducto: material.nombreProducto || material.nombre,
                    cantidadRepuesta: cantidad
                };
            });
        
        const datosReposicion = {
            idReposicion: reposicionId,
            materiales: materialesReponiendo,
            estado: 'completada'
        };
        
        console.log('Confirmando reposición:', datosReposicion);
        
        // Intentar guardar en backend
        try {
            const response = await fetch(`${API_URL}/api/Reposicion/${reposicionId}/confirmar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosReposicion)
            });

            if (!response.ok) {
                throw new Error('Error al confirmar reposición');
            }
        } catch (errorBackend) {
            console.log('Backend no disponible, guardando en localStorage');
            // Fallback: actualizar en localStorage
            let historial = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
            const index = historial.findIndex(r => r.id == reposicionId || r.idReposicion == reposicionId);
            if (index !== -1) {
                historial[index].estado = 'completada';
                historial[index].materialesRepuestos = materialesReponiendo;
                localStorage.setItem('historialReposiciones', JSON.stringify(historial));
            }
        }
        
        alert('Reposición confirmada exitosamente');
        window.location.href = 'historial-reposiciones.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al confirmar la reposición');
    }
});

backButton.addEventListener('click', () => {
    window.location.href = 'historial-reposiciones.html';
});

// Inicializar
document.addEventListener('DOMContentLoaded', cargarReposicion);
