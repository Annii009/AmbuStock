// const API_URL = 'http://localhost:5002';
const API_URL = 'https://charles-uncompanioned-unvalorously.ngrok-free.dev';
let todasLasReposiciones = [];
let filtroActual = 'todas';

// Elementos del DOM
const backButton = document.getElementById('backButton');
const searchInput = document.getElementById('searchInput');
const reposicionesList = document.getElementById('reposicionesList');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');

// Cargar reposiciones
async function cargarReposiciones() {
    try {
        loading.style.display = 'block';
        noResults.style.display = 'none';
        reposicionesList.innerHTML = '';

        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        // Intentar cargar desde backend
        try {
            const response = await fetch(`${API_URL}/api/Reposicion/historial`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                todasLasReposiciones = await response.json();
            } else {
                throw new Error('Backend no disponible');
            }
        } catch (errorBackend) {
            console.log('Backend no disponible, cargando desde localStorage');
            // Fallback: cargar desde localStorage
            todasLasReposiciones = JSON.parse(localStorage.getItem('historialReposiciones') || '[]');
        }
        
        console.log('Reposiciones cargadas:', todasLasReposiciones);
        
        loading.style.display = 'none';
        renderizarReposiciones();

    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        noResults.style.display = 'block';
    }
}

// Renderizar reposiciones
function renderizarReposiciones() {
    let reposicionesFiltradas = filtrarReposiciones();
    
    if (reposicionesFiltradas.length === 0) {
        reposicionesList.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    
    const html = reposicionesFiltradas.map(reposicion => {
        const fecha = formatearFecha(reposicion.fechaReposicion || reposicion.fecha);
        const estado = obtenerEstado(reposicion);
        
        return `
            <a href="detalle-reposicion.html?id=${reposicion.idReposicion || reposicion.id}" class="reposicion-card">
                <div class="reposicion-header">
                    <div>
                        <div class="reposicion-date">${fecha}</div>
                        <div class="reposicion-ambulancia">${reposicion.nombreAmbulancia || 'AMBULANCIA'}</div>
                        <div class="reposicion-matricula">Matrícula: ${reposicion.matricula || 'N/A'}</div>
                    </div>
                    <div class="status-badge ${estado.clase}">${estado.texto}</div>
                </div>
                <div class="reposicion-footer">
                    <div class="reposicion-revisor">
                        <svg class="revisor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>${reposicion.nombreResponsable || 'Sin asignar'}</span>
                    </div>
                    <svg class="reposicion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </a>
        `;
    }).join('');
    
    reposicionesList.innerHTML = html;
}

// Filtrar reposiciones
function filtrarReposiciones() {
    let reposiciones = [...todasLasReposiciones];
    
    // Filtro por búsqueda
    const busqueda = searchInput.value.toLowerCase().trim();
    if (busqueda) {
        reposiciones = reposiciones.filter(r => 
            (r.nombreAmbulancia && r.nombreAmbulancia.toLowerCase().includes(busqueda)) ||
            (r.matricula && r.matricula.toLowerCase().includes(busqueda)) ||
            (r.nombreResponsable && r.nombreResponsable.toLowerCase().includes(busqueda))
        );
    }
    
    // Filtro por estado
    if (filtroActual !== 'todas') {
        reposiciones = reposiciones.filter(r => {
            const estado = obtenerEstado(r);
            return estado.clase === filtroActual;
        });
    }
    
    // Ordenar por fecha (más reciente primero)
    reposiciones.sort((a, b) => {
        const fechaA = new Date(a.fechaReposicion || a.fecha);
        const fechaB = new Date(b.fechaReposicion || b.fecha);
        return fechaB - fechaA;
    });
    
    return reposiciones;
}

// Obtener estado de la reposición
function obtenerEstado(reposicion) {
    if (reposicion.estado) {
        const estadoLower = reposicion.estado.toLowerCase();
        if (estadoLower === 'completada' || estadoLower === 'completado') {
            return { texto: 'completada', clase: 'completada' };
        }
        if (estadoLower === 'pendiente') {
            return { texto: 'Pendiente', clase: 'pendiente' };
        }
        if (estadoLower === 'sin-realizar') {
            return { texto: 'Sin realizar', clase: 'sin-realizar' };
        }
    }
    
    // Por defecto pendiente
    return { texto: 'Pendiente', clase: 'pendiente' };
}

// Formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate();
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `${dia} de ${mes}, ${año}`;
}

// Event listeners
searchInput.addEventListener('input', () => {
    renderizarReposiciones();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroActual = btn.dataset.filter;
        renderizarReposiciones();
    });
});

backButton.addEventListener('click', () => {
    window.location.href = 'perfil.html';
});

// Inicializar
document.addEventListener('DOMContentLoaded', cargarReposiciones);
