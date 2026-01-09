const materialesList = document.getElementById('materialesList');
const cantidadFaltantes = document.getElementById('cantidadFaltantes');
const btnFinalizar = document.getElementById('btnFinalizar');
const backButton = document.getElementById('backButton');

function cargarMaterialesFaltantes() {
    const materialesFaltantesStr = localStorage.getItem('materialesFaltantes');
    
    if (!materialesFaltantesStr) {
        window.location.href = 'principal.html';
        return;
    }
    
    const materialesFaltantes = JSON.parse(materialesFaltantesStr);
    
    cantidadFaltantes.textContent = materialesFaltantes.length;
    
    if (materialesFaltantes.length === 0) {
        const noFaltantes = document.createElement('div');
        noFaltantes.style.textAlign = 'center';
        noFaltantes.style.padding = '20px';
        noFaltantes.style.color = '#666';
        noFaltantes.textContent = '¡Todos los materiales están completos!';
        materialesList.appendChild(noFaltantes);
    } else {
        materialesFaltantes.forEach(material => {
            const materialItem = document.createElement('div');
            materialItem.className = 'material-faltante';
            materialItem.innerHTML = `
                <div class="material-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <div class="material-info">
                    <div class="material-nombre">${material.nombreProducto}</div>
                    <div class="material-falta">Falta: ${material.cantidadFaltante}</div>
                    <div class="material-ubicacion">${material.ubicacion}</div>
                </div>
            `;
            
            materialesList.appendChild(materialItem);
        });
    }
}

btnFinalizar.addEventListener('click', () => {
    localStorage.removeItem('materialesFaltantes');
    localStorage.removeItem('ambulanciaSeleccionada');
    localStorage.removeItem('servicioSeleccionado');
    localStorage.removeItem('nombreResponsable');
    
    window.location.href = 'mision-cumplida.html';
});

backButton.addEventListener('click', () => {
    window.location.href = 'revision.html';
});

document.addEventListener('DOMContentLoaded', cargarMaterialesFaltantes);
