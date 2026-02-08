const API_URL = 'http://localhost:5002';
let allResponsables = [];
let responsableToDelete = null;
let editingResponsable = null;

// Elementos del DOM
const backButton = document.getElementById('backButton');
const searchInput = document.getElementById('searchInput');
const responsablesList = document.getElementById('responsablesList');
const btnAddResponsable = document.getElementById('btnAddResponsable');

// Modal Responsable
const modalResponsable = document.getElementById('modalResponsable');
const modalTitle = document.getElementById('modalTitle');
const formResponsable = document.getElementById('formResponsable');
const btnCancelarModal = document.getElementById('btnCancelarModal');
const inputNombreUsuario = document.getElementById('inputNombreUsuario');
const inputRol = document.getElementById('inputRol');
const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');
const passwordGroup = document.getElementById('passwordGroup');
const inputIdUsuario = document.getElementById('inputIdUsuario');
const inputIdResponsable = document.getElementById('inputIdResponsable');

// Modal Eliminar
const modalEliminar = document.getElementById('modalEliminar');
const nombreEliminar = document.getElementById('nombreEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// Verificar permisos de administrador
document.addEventListener('DOMContentLoaded', () => {
    const usuarioData = localStorage.getItem('usuario');
    
    if (usuarioData) {
        try {
            const usuario = JSON.parse(usuarioData);
            if (usuario.rol !== 'Administrador') {
                window.location.href = 'principal.html';
                return;
            }
        } catch (error) {
            window.location.href = 'index.html';
            return;
        }
    } else {
        window.location.href = 'index.html';
        return;
    }
    
    cargarResponsables();
});

// Cargar responsables desde la API
async function cargarResponsables() {
    try {
        const token = localStorage.getItem('token');
        
        // Cargar usuarios (que incluyen responsables)
        const response = await fetch(`${API_URL}/api/Usuario`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al cargar responsables');
        
        allResponsables = await response.json();
        renderizarResponsables(allResponsables);
    } catch (error) {
        console.error('Error al cargar responsables:', error);
        mostrarError('Error al cargar la lista de responsables');
    }
}

function renderizarResponsables(responsables) {
    console.log('Responsables recibidos:', responsables); // Para debug
    
    if (responsables.length === 0) {
        responsablesList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
                <p>No hay responsables registrados</p>
            </div>
        `;
        return;
    }
    
    const html = responsables.map(r => {
        // Asegurarse de usar el campo correcto del backend
        const nombre = r.nombreUsuario || r.NombreUsuario || r.nombre_usuario || 'Sin nombre';
        const rol = r.rol || r.Rol || 'Sin rol';
        const idUsuario = r.idUsuario || r.IdUsuario || r.id_usuario;
        
        return `
            <div class="responsable-item">
                <div class="responsable-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </div>
                <div class="responsable-info">
                    <div class="responsable-name">${nombre}</div>
                    <div class="responsable-role">${rol}</div>
                </div>
                <div class="responsable-actions">
                    <button class="btn-icon edit" onclick="editarResponsable(${idUsuario})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="confirmarEliminar(${idUsuario}, '${nombre}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    responsablesList.innerHTML = html;
}


// Búsqueda
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        renderizarResponsables(allResponsables);
        return;
    }
    
    const filtered = allResponsables.filter(r => 
        r.nombreUsuario?.toLowerCase().includes(query) ||
        r.rol?.toLowerCase().includes(query) ||
        r.email?.toLowerCase().includes(query)
    );
    
    renderizarResponsables(filtered);
});

// Abrir modal para añadir
btnAddResponsable.addEventListener('click', () => {
    editingResponsable = null;
    modalTitle.textContent = 'Nuevo Responsable';
    formResponsable.reset();
    passwordGroup.style.display = 'block';
    inputPassword.required = true;
    inputIdUsuario.value = '';
    inputIdResponsable.value = '';
    modalResponsable.classList.add('show');
    modalResponsable.style.display = 'flex';
});

// Editar responsable
window.editarResponsable = async function(idUsuario) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/Usuario/${idUsuario}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al cargar responsable');
        
        editingResponsable = await response.json();
        
        modalTitle.textContent = editingResponsable.nombreUsuario;
        inputNombreUsuario.value = editingResponsable.nombreUsuario;
        inputRol.value = editingResponsable.rol;
        inputEmail.value = editingResponsable.email;
        inputPassword.value = '';
        passwordGroup.style.display = 'none';
        inputPassword.required = false;
        inputIdUsuario.value = editingResponsable.idUsuario;
        
        modalResponsable.classList.add('show');
        modalResponsable.style.display = 'flex';
    } catch (error) {
        console.error('Error al cargar responsable:', error);
    }
};

// Guardar responsable (crear o actualizar)
formResponsable.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        nombreUsuario: inputNombreUsuario.value.trim(),
        rol: inputRol.value,
        email: inputEmail.value.trim(),
        password: inputPassword.value || undefined
    };
    
    try {
        const token = localStorage.getItem('token');
        let response;
        
        if (editingResponsable) {
            // Actualizar
            response = await fetch(`${API_URL}/api/Usuario/${editingResponsable.idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
        } else {
            // Crear
            if (!datos.password) {
                return;
            }
            
            response = await fetch(`${API_URL}/api/Usuario`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
        }
        
        if (!response.ok) throw new Error('Error al guardar responsable');
        
        cerrarModal();
        await cargarResponsables();
    } catch (error) {
        console.error('Error al guardar responsable:', error);
    }
});

// Confirmar eliminación
window.confirmarEliminar = function(idUsuario, nombre) {
    responsableToDelete = idUsuario;
    nombreEliminar.textContent = nombre;
    modalEliminar.classList.add('show');
    modalEliminar.style.display = 'flex';
};

// Eliminar responsable
btnConfirmarEliminar.addEventListener('click', async () => {
    if (!responsableToDelete) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/Usuario/${responsableToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al eliminar responsable');
        
        cerrarModalEliminar();
        await cargarResponsables();
    } catch (error) {
        console.error('Error al eliminar responsable:', error);
    }
});

// Cerrar modales
function cerrarModal() {
    modalResponsable.classList.remove('show');
    modalResponsable.style.display = 'none';
    formResponsable.reset();
    editingResponsable = null;
}

function cerrarModalEliminar() {
    modalEliminar.classList.remove('show');
    modalEliminar.style.display = 'none';
    responsableToDelete = null;
}

btnCancelarModal.addEventListener('click', cerrarModal);
btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);

// Cerrar modal al hacer clic fuera
modalResponsable.addEventListener('click', (e) => {
    if (e.target === modalResponsable) cerrarModal();
});

modalEliminar.addEventListener('click', (e) => {
    if (e.target === modalEliminar) cerrarModalEliminar();
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modalResponsable.classList.contains('show')) cerrarModal();
        if (modalEliminar.classList.contains('show')) cerrarModalEliminar();
    }
});

// Volver atrás
backButton.addEventListener('click', () => {
    window.location.href = 'perfil-admin.html';
});

function mostrarError(mensaje) {
    alert(mensaje);
}
