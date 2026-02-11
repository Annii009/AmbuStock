<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getReposicionData,
  updateReposicionData,
  guardarReposicion,
  guardarReposicionEnHistorial,
  getAmbulanciaById,
  getAmbulanciaSeleccionada,
  type FotoSeleccionada,
  type ReposicionCompletaData
} from '@/services/api'

const router = useRouter()

// Estado
const comentarios = ref('')
const fotosSeleccionadas = ref<FotoSeleccionada[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

// Abrir selector de archivos
const abrirSelectorArchivos = () => {
  fileInputRef.value?.click()
}

// Manejar selección de fotos
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        fotosSeleccionadas.value.push({
          file: file,
          dataUrl: e.target?.result as string
        })
      }
      
      reader.readAsDataURL(file)
    }
  })
  
  // Limpiar input
  if (target) {
    target.value = ''
  }
}

// Eliminar foto
const eliminarFoto = (index: number) => {
  fotosSeleccionadas.value.splice(index, 1)
}

// Guardar reposición en historial
const guardarReposicionCompleta = async () => {
  try {
    const reposicionData = getReposicionData()
    
    if (!reposicionData) {
      alert('No hay datos de reposición')
      return
    }
    
    const ambulanciaId = getAmbulanciaSeleccionada()
    if (!ambulanciaId) {
      alert('No se encontró ambulancia seleccionada')
      return
    }
    
    // Obtener datos de la ambulancia
    const ambulancia = await getAmbulanciaById(ambulanciaId)
    
    // Convertir MaterialSeleccionado a MaterialFaltante
    const materialesFaltantes = reposicionData.materiales.map(m => ({
      nombreProducto: m.nombreProducto,
      cantidadFaltante: m.cantidad,
      nombreZona: 'N/A',
      nombreCajon: null,
      ubicacion: 'N/A'
    }))
    
    // Preparar datos de la reposición para el historial
    const reposicion = {
      id: Date.now(),
      idReposicion: Date.now(),
      idAmbulancia: ambulanciaId,
      nombreAmbulancia: ambulancia?.nombre || 'N/A',
      matricula: ambulancia?.matricula || 'N/A',
      nombreResponsable: reposicionData.responsable,
      fechaReposicion: new Date().toISOString(),
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      origen: 'material-gastado',
      servicio: reposicionData.servicio,
      comentarios: comentarios.value.trim() || '',
      fotos: fotosSeleccionadas.value,
      materiales: reposicionData.materiales.map(m => ({
        nombreProducto: m.nombreProducto,
        cantidad: m.cantidad,
        cantidadFaltante: m.cantidad,
        stockActual: 0,
        ubicacion: 'N/A'
      })),
      materialesFaltantes: materialesFaltantes
    }
    
    console.log('Guardando reposición en historial:', reposicion)
    
    // Intentar guardar en backend
    try {
      await guardarReposicion(reposicion)
    } catch (errorBackend) {
      console.log('Backend no disponible, guardando solo en localStorage')
    }
    
    // Siempre guardar también en localStorage como backup
    guardarReposicionEnHistorial(reposicion)
    
    console.log('Reposición guardada en historial')
    
  } catch (error) {
    console.error('Error al guardar reposición:', error)
  }
}


// Navegación
const goBack = () => {
  router.push('/material-gastado')
}

const continuar = async () => {
  // Actualizar datos de reposición
  updateReposicionData(comentarios.value.trim(), fotosSeleccionadas.value)
  
  // Guardar en el historial de reposiciones
  await guardarReposicionCompleta()
  
  router.push('/todo-listo')
}

// Inicializar
onMounted(() => {
  // Cargar datos previos si existen
  const data = getReposicionData() as ReposicionCompletaData | null
  if (data) {
    comentarios.value = data.comentarios || ''
    fotosSeleccionadas.value = data.fotos || []
  }
})
</script>

<template>
  <div class="sugerencias-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <img src="/logo1Rojo.png" alt="Ambustock" class="logo">
      </div>

      <h1>SUGERENCIAS U OBSERVACIONES</h1>

      <!-- Progress dots -->
      <div class="progress-dots">
        <span class="dot"></span>
        <span class="dot active"></span>
        <span class="dot"></span>
      </div>

      <!-- Textarea -->
      <textarea 
        v-model="comentarios"
        placeholder="Añada comentarios sobre el servicio o el vehículo..." 
        rows="6"
      ></textarea>

      <!-- Upload section -->
      <div class="upload-section">
        <p class="optional-label">*Opcional</p>
        
        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          multiple 
          style="display: none;"
          @change="onFileChange"
        >
        
        <button class="btn-upload" @click="abrirSelectorArchivos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Subir fotos</span>
        </button>

        <!-- Photos grid -->
        <div v-if="fotosSeleccionadas.length > 0" class="photos-grid">
          <div 
            v-for="(foto, index) in fotosSeleccionadas" 
            :key="index"
            class="photo-item"
          >
            <img :src="foto.dataUrl" :alt="`Foto ${index + 1}`">
            <button class="btn-remove-photo" @click="eliminarFoto(index)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Continue button -->
      <button class="btn-continue" @click="continuar">
        Continuar
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.sugerencias-view {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: $white;
  min-height: 100vh;
  padding: 20px;
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-button {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: $primary-red;
  }
  
  &:hover {
    opacity: 0.7;
  }
}

.logo {
  width: 50px;
  height: 50px;
}

h1 {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: $text-dark;
}

// Progress dots
.progress-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.dot {
  width: 40px;
  height: 4px;
  background-color: $dot-inactive;
  border-radius: 2px;
  transition: background-color 0.3s;
  
  &.active {
    background-color: $dot-active;
  }
}

// Textarea
textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid $upload-border;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 30px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: $primary-red;
  }
}

// Upload section
.upload-section {
  margin-bottom: 30px;
}

.optional-label {
  font-size: 14px;
  color: $text-gray;
  margin-bottom: 15px;
}

.btn-upload {
  width: 100%;
  padding: 60px 20px;
  border: 2px dashed $upload-border;
  background: $upload-bg;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  
  &:hover {
    border-color: $primary-red;
    background: $upload-hover-bg;
  }
  
  svg {
    width: 40px;
    height: 40px;
    color: $primary-red;
  }
  
  span {
    font-size: 16px;
    font-weight: 500;
    color: $primary-red;
  }
}

// Photos grid
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid $upload-border;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.btn-remove-photo {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  background: $photo-remove-bg;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: $photo-remove-hover;
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: $white;
  }
}

// Continue button
.btn-continue {
  @include button-base;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  background-color: $primary-red;
  color: $white;
  
  &:hover {
    background-color: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
}

// Responsive
@media (max-width: 480px) {
  .container {
    padding: 15px;
  }

  h1 {
    font-size: 18px;
  }

  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
