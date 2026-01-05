// Elementos del DOM
const inputResponsable = document.getElementById('responsable');
const btnContinuar = document.getElementById('btnContinuar');

// Event listener del input
inputResponsable.addEventListener('input', (e) => {
    const nombre = e.target.value.trim();
    
    // Habilitar botón si tiene al menos 2 caracteres
    btnContinuar.disabled = nombre.length < 2;
});

// Continuar a la siguiente pantalla
btnContinuar.addEventListener('click', () => {
    const nombreResponsable = inputResponsable.value.trim();
    
    if (nombreResponsable.length >= 2) {
        // Guardar el nombre del responsable
        localStorage.setItem('nombreResponsable', nombreResponsable);
        
        // Ir a la siguiente pantalla
        window.location.href = 'revision.html';
    }
});
