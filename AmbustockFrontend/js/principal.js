const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const themeIcon = document.getElementById('themeIcon');
const verPerfilBtn = document.getElementById('verPerfil');
const cerrarSesionBtn = document.getElementById('cerrarSesion');
const logo = document.querySelector('.logo');

// Elementos del modal
const modalCerrarSesion = document.getElementById('modalCerrarSesion');
const btnCancelar = document.getElementById('btnCancelar');
const btnConfirmarCerrar = document.getElementById('btnConfirmarCerrar');

const sunIcon = `<svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const moonIcon = `<svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

function updateThemeUI(isDark) {
    themeText.textContent = isDark ? 'Tema oscuro' : 'Tema claro';
    themeIcon.innerHTML = isDark ? moonIcon : sunIcon;
    
    logo.style.opacity = '0';
    setTimeout(() => {
        logo.src = isDark ? '../imagenes/logo2Blanco.png' : '../imagenes/logo2Rojo.png';
        logo.style.opacity = '1';
    }, 200);
}

menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    updateThemeUI(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
    updateThemeUI(true);
}

// Redirigir al perfil correcto según el rol
verPerfilBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
    const usuarioData = localStorage.getItem('usuario');
    
    if (usuarioData) {
        try {
            const usuario = JSON.parse(usuarioData);
            if (usuario.rol === 'Administrador') {
                window.location.href = 'perfil-admin.html';
            } else {
                window.location.href = 'perfil.html';
            }
        } catch (error) {
            window.location.href = 'perfil.html';
        }
    } else {
        window.location.href = 'perfil.html';
    }
});


// Mostrar modal al hacer clic en cerrar sesión
cerrarSesionBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Click en cerrar sesión - mostrando modal');
    dropdownMenu.classList.remove('show');
    modalCerrarSesion.classList.add('show');
    modalCerrarSesion.style.display = 'flex';
});

// Cancelar cierre de sesión
btnCancelar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Click en cancelar');
    modalCerrarSesion.classList.remove('show');
    modalCerrarSesion.style.display = 'none';
});

// Confirmar cierre de sesión
btnConfirmarCerrar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Confirmado cierre de sesión');
    
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
    localStorage.removeItem('reposicionData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    window.location.href = 'index.html';
});

// Cerrar modal al hacer clic fuera de él
modalCerrarSesion.addEventListener('click', (e) => {
    if (e.target === modalCerrarSesion) {
        modalCerrarSesion.classList.remove('show');
        modalCerrarSesion.style.display = 'none';
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCerrarSesion.classList.contains('show')) {
        modalCerrarSesion.classList.remove('show');
        modalCerrarSesion.style.display = 'none';
    }
});


document.querySelector('.btn-primary').addEventListener('click', () => {
    window.location.href = 'seleccion-ambulancia.html';
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    window.location.href = 'material-gastado.html';
});
