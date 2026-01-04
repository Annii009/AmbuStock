// Elementos del DOM
const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const themeToggle = document.getElementById('themeToggle');
const verPerfilBtn = document.getElementById('verPerfil');
const cerrarSesionBtn = document.getElementById('cerrarSesion');
const logo = document.querySelector('.logo');

// Toggle del menú desplegable
menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Cambiar tema y logo
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Cambiar logo según el tema
    logo.src = isDark ? '../imagenes/logo2Blanco.png' : '../imagenes/logo2Rojo.png';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
    logo.src = '../imagenes/logo2Blanco.png';
}

// Ver perfil
verPerfilBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
    window.location.href = 'perfil.html';
});

// Cerrar sesión (sin confirmación)
cerrarSesionBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    window.location.href = 'login.html';
});

// Botones de acción
document.querySelector('.btn-primary').addEventListener('click', () => {
    window.location.href = 'seleccion-ambulancia.html';
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    window.location.href = 'material-gastado.html';
});
