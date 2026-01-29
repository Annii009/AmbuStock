// Variables globales
// const API_URL = 'http://localhost:5002';
const API_URL = 'https://charles-uncompanioned-unvalorously.ngrok-free.dev';
let materialesSeleccionados = [];
let servicioSeleccionado = null;
let allMateriales = [];
let allServicios = [];

// Elementos del DOM
const backButton = document.getElementById('backButton');
const searchMaterial = document.getElementById('searchMaterial');
const btnAddMaterial = document.getElementById('btnAddMaterial');
const materialAutocomplete = document.getElementById('materialAutocomplete');
const materialList = document.getElementById('materialList');
const searchServicio = document.getElementById('searchServicio');
const servicioAutocomplete = document.getElementById('servicioAutocomplete');
const nombreResponsable = document.getElementById('nombreResponsable');
const btnContinuar = document.getElementById('btnContinuar');

// Cargar materiales y servicios
async function cargarDatos() {
    try {
        const token = localStorage.getItem('token');
        
        const responseMateriales = await fetch(`${API_URL}/api/Material`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allMateriales = await responseMateriales.json();
        
        const responseServicios = await fetch(`${API_URL}/api/Servicio`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allServicios = await responseServicios.json();
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Autocompletado de materiales
searchMaterial.addEventListener('input', () => {
    const query = searchMaterial.value.trim().toLowerCase();
    
    if (query.length === 0) {
        materialAutocomplete.classList.remove('show');
        return;
    }
    
    const filtered = allMateriales.filter(m => 
        m.nombreProducto.toLowerCase().includes(query)
    );
    
    if (filtered.length > 0) {
        materialAutocomplete.innerHTML = filtered
            .slice(0, 5)
            .map(m => `<div class="autocomplete-item" data-id="${m.idMaterial}">${m.nombreProducto}</div>`)
            .join('');
        materialAutocomplete.classList.add('show');
    } else {
        materialAutocomplete.classList.remove('show');
    }
});

materialAutocomplete.addEventListener('click', (e) => {
    if (e.target.classList.contains('autocomplete-item')) {
        const id = parseInt(e.target.dataset.id);
        const material = allMateriales.find(m => m.idMaterial === id);
        agregarMaterial(material);
        searchMaterial.value = '';
        materialAutocomplete.classList.remove('show');
    }
});

btnAddMaterial.addEventListener('click', () => {
    const query = searchMaterial.value.trim();
    if (query) {
        const material = allMateriales.find(m => 
            m.nombreProducto.toLowerCase() === query.toLowerCase()
        );
        if (material) {
            agregarMaterial(material);
            searchMaterial.value = '';
            materialAutocomplete.classList.remove('show');
        }
    }
});

function agregarMaterial(material) {
    const existe = materialesSeleccionados.find(m => m.idMaterial === material.idMaterial);
    
    if (!existe) {
        materialesSeleccionados.push({
            ...material,
            cantidad: 1
        });
        renderizarMateriales();
        validarFormulario();
    }
}

function renderizarMateriales() {
    const html = materialesSeleccionados.map((m, index) => `
        <div class="material-item">
            <span class="material-name">${m.nombreProducto}</span>
            <div class="material-controls">
                <button class="btn-qty" onclick="cambiarCantidad(${index}, -1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <span class="material-qty">${m.cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${index}, 1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button class="btn-delete" onclick="eliminarMaterial(${index})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    materialList.innerHTML = html;
}

window.cambiarCantidad = (index, delta) => {
    materialesSeleccionados[index].cantidad += delta;
    if (materialesSeleccionados[index].cantidad < 1) {
        materialesSeleccionados[index].cantidad = 1;
    }
    renderizarMateriales();
};

window.eliminarMaterial = (index) => {
    materialesSeleccionados.splice(index, 1);
    renderizarMateriales();
    validarFormulario();
};

// Autocompletado de servicios
searchServicio.addEventListener('input', () => {
    const query = searchServicio.value.trim().toLowerCase();
    
    if (query.length === 0) {
        servicioAutocomplete.classList.remove('show');
        validarFormulario();
        return;
    }
    
    const filtered = allServicios.filter(s => 
        s.nombreServicio.toLowerCase().includes(query)
    );
    
    if (filtered.length > 0) {
        servicioAutocomplete.innerHTML = filtered
            .slice(0, 5)
            .map(s => `<div class="autocomplete-item" data-id="${s.idServicio}">${s.nombreServicio}</div>`)
            .join('');
        servicioAutocomplete.classList.add('show');
    } else {
        servicioAutocomplete.classList.remove('show');
    }
    
    validarFormulario();
});

servicioAutocomplete.addEventListener('click', (e) => {
    if (e.target.classList.contains('autocomplete-item')) {
        const id = parseInt(e.target.dataset.id);
        servicioSeleccionado = allServicios.find(s => s.idServicio === id);
        searchServicio.value = servicioSeleccionado.nombreServicio;
        servicioAutocomplete.classList.remove('show');
        validarFormulario();
    }
});

nombreResponsable.addEventListener('input', validarFormulario);

function validarFormulario() {
    const tieneResponsable = nombreResponsable.value.trim().length > 0;
    const tieneServicio = searchServicio.value.trim().length > 0;
    const tieneMateriales = materialesSeleccionados.length > 0;
    
    btnContinuar.disabled = !(tieneResponsable && tieneServicio && tieneMateriales);
}

btnContinuar.addEventListener('click', () => {
    // Guardar datos para la siguiente pantalla
    localStorage.setItem('reposicionData', JSON.stringify({
        materiales: materialesSeleccionados,
        servicio: searchServicio.value.trim(),
        responsable: nombreResponsable.value.trim()
    }));
    
    window.location.href = 'sugerencias.html';
});

backButton.addEventListener('click', () => {
    window.location.href = 'principal.html';
});

document.addEventListener('DOMContentLoaded', cargarDatos);
