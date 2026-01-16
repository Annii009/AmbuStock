// Elementos del DOM
const backButton = document.getElementById('backButton');
const comentarios = document.getElementById('comentarios');
const fileInput = document.getElementById('fileInput');
const btnUpload = document.getElementById('btnUpload');
const photosGrid = document.getElementById('photosGrid');
const btnContinuar = document.getElementById('btnContinuar');

let fotosSeleccionadas = [];

// Abrir selector de archivos
btnUpload.addEventListener('click', () => {
    fileInput.click();
});

// Manejar selección de fotos
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                fotosSeleccionadas.push({
                    file: file,
                    dataUrl: event.target.result
                });
                renderizarFotos();
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    fileInput.value = '';
});

// Renderizar fotos
function renderizarFotos() {
    photosGrid.innerHTML = fotosSeleccionadas.map((foto, index) => `
        <div class="photo-item">
            <img src="${foto.dataUrl}" alt="Foto ${index + 1}">
            <button class="btn-remove-photo" onclick="eliminarFoto(${index})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
}

window.eliminarFoto = (index) => {
    fotosSeleccionadas.splice(index, 1);
    renderizarFotos();
};

// Continuar a resumen
btnContinuar.addEventListener('click', () => {
    const reposicionData = JSON.parse(localStorage.getItem('reposicionData') || '{}');
    
    reposicionData.comentarios = comentarios.value.trim();
    reposicionData.fotos = fotosSeleccionadas;
    
    localStorage.setItem('reposicionData', JSON.stringify(reposicionData));
    
    window.location.href = 'todo-listo.html';
});

backButton.addEventListener('click', () => {
    window.location.href = 'material-gastado.html';
});
