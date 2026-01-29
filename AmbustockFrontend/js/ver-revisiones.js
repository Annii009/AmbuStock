// Variables globales
// const API_URL = 'http://localhost:5002';
const API_URL = 'https://charles-uncompanioned-unvalorously.ngrok-free.dev';
let todasLasRevisiones = [];
let filtroActual = 'todas';

// Elementos del DOM
const backButton = document.getElementById('backButton');
const searchInput = document.getElementById('searchInput');
const revisionesLis = document.getElementById('revisionesLis');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');

// Cargar revisiones desde el backend
async function cargarRevisiones() {
    try {
        loading.style.display = 'block';
        noResults.style.display = 'none';
        revisionesLis.innerHTML = '';

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        // Cargar historial de revisiones
        const response = await fetch(`${API_URL}/api/Revision/historial`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar revisiones');
        }

        todasLasRevisiones = await response.json();
        console.log('Revisiones cargadas:', todasLasRevisiones);
        
        loading.style.display = 'none';
        renderizarRevisiones();

    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        noResults.style.display = 'block';
    }
}

// Renderizar revisiones
function renderizarRevisiones() {
    let revisionesFiltradas = filtrarRevisiones();
    
    if (revisionesFiltradas.length === 0) {
        revisionesLis.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    
    const html = revisionesFiltradas.map(revision => {
        const fecha = formatearFecha(revision.fechaRevision);
        const estado = obtenerEstado(revision);
        
        return `
            <a href="detalle-revision.html?id=${revision.idRevision}" class="revision-card">
                <div class="revision-header">
                    <div>
                        <div class="revision-date">${fecha}</div>
                        <div class="revision-ambulancia">${revision.nombreAmbulancia || 'AMBULANCIA'}</div>
                        <div class="revision-matricula">Matrícula: ${revision.matricula || 'N/A'}</div>
                    </div>
                    <div class="status-badge ${estado.clase}">${estado.texto}</div>
                </div>
                <div class="revision-footer">
                    <div class="revision-revisor">
                        <svg class="revisor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>${revision.nombreResponsable || 'Sin asignar'}</span>
                    </div>
                    <svg class="revision-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </a>
        `;
    }).join('');
    
    revisionesLis.innerHTML = html;
}

// Filtrar revisiones
function filtrarRevisiones() {
    let revisiones = [...todasLasRevisiones];
    
    // Filtro por búsqueda
    const busqueda = searchInput.value.toLowerCase().trim();
    if (busqueda) {
        revisiones = revisiones.filter(r => 
            (r.nombreAmbulancia && r.nombreAmbulancia.toLowerCase().includes(busqueda)) ||
            (r.matricula && r.matricula.toLowerCase().includes(busqueda)) ||
            (r.nombreResponsable && r.nombreResponsable.toLowerCase().includes(busqueda))
        );
    }
    
    // Filtro por estado
    if (filtroActual !== 'todas') {
        revisiones = revisiones.filter(r => {
            const estado = obtenerEstado(r);
            return estado.clase === filtroActual;
        });
    }
    
    // Ordenar por fecha (más reciente primero)
    revisiones.sort((a, b) => new Date(b.fechaRevision) - new Date(a.fechaRevision));
    
    return revisiones;
}

// Obtener estado de la revisión
function obtenerEstado(revision) {
    // Si tiene campo estado explícito
    if (revision.estado) {
        const estadoLower = revision.estado.toLowerCase();
        if (estadoLower === 'completada') {
            return { texto: 'completada', clase: 'completada' };
        }
        if (estadoLower === 'pendiente') {
            return { texto: 'Pendiente', clase: 'pendiente' };
        }
        if (estadoLower === 'urgente') {
            return { texto: 'Urgente', clase: 'urgente' };
        }
        if (estadoLower === 'sin-realizar') {
            return { texto: 'Pendiente', clase: 'sin-realizar' };
        }
    }
    
    // Calcular estado basado en materiales revisados
    if (revision.totalMateriales && revision.materialesRevisados !== undefined) {
        const porcentaje = (revision.materialesRevisados / revision.totalMateriales) * 100;
        if (porcentaje === 100) {
            return { texto: 'completada', clase: 'completada' };
        }
        if (porcentaje > 0) {
            return { texto: 'Pendiente', clase: 'pendiente' };
        }
        return { texto: 'Pendiente', clase: 'sin-realizar' };
    }
    
    // Por defecto
    return { texto: 'completada', clase: 'completada' };
}

// Formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Event listeners
searchInput.addEventListener('input', () => {
    renderizarRevisiones();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroActual = btn.dataset.filter;
        renderizarRevisiones();
    });
});

backButton.addEventListener('click', () => {
    window.location.href = 'perfil.html';
});

// Inicializar
document.addEventListener('DOMContentLoaded', cargarRevisiones);
