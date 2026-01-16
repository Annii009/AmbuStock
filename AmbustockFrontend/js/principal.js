const menuButton = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const themeIcon = document.getElementById('themeIcon');
const verPerfilBtn = document.getElementById('verPerfil');
const cerrarSesionBtn = document.getElementById('cerrarSesion');
const logo = document.querySelector('.logo');

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

verPerfilBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
    window.location.href = 'perfil.html';
});

cerrarSesionBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    window.location.href = 'login.html';
});

document.querySelector('.btn-primary').addEventListener('click', () => {
    window.location.href = 'seleccion-ambulancia.html';
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    window.location.href = 'material-gastado.html';
});