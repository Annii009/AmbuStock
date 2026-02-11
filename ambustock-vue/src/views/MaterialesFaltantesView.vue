<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getMaterialesFaltantes,
  getAmbulanciaById,
  getAmbulanciaSeleccionada,
  getNombreResponsable,
  guardarReposicion,
  guardarReposicionEnHistorial,
  limpiarDatosRevision,
  type MaterialFaltante,
  type Reposicion
} from '@/services/api'

const router = useRouter()

// Estado
const materialesFaltantes = ref<MaterialFaltante[]>([])

// Computed
const cantidadFaltantes = computed(() => materialesFaltantes.value.length)

// Cargar materiales faltantes
const cargarMaterialesFaltantes = () => {
  const faltantes = getMaterialesFaltantes()
  
  if (!faltantes) {
    router.push('/principal')
    return
  }
  
  materialesFaltantes.value = faltantes
}

// Guardar reposición automática
const guardarReposicionMaterialesFaltantes = async () => {
  try {
    if (materialesFaltantes.value.length === 0) return
    
    const ambulanciaId = getAmbulanciaSeleccionada()
    const nombreResponsable = getNombreResponsable()
    
    if (!ambulanciaId) return
    
    // Obtener datos de la ambulancia
    const ambulancia = await getAmbulanciaById(ambulanciaId)
    
    // Preparar datos de la reposición
    const reposicion: Reposicion = {
      id: Date.now(),
      idReposicion: Date.now(),
      idAmbulancia: ambulanciaId,
      nombreAmbulancia: ambulancia?.nombre || 'N/A',
      matricula: ambulancia?.matricula || 'N/A',
      nombreResponsable: nombreResponsable || 'Sin responsable',
      fechaReposicion: new Date().toISOString(),
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      origen: 'revision',
      materiales: materialesFaltantes.value.map(m => ({
        nombreProducto: m.nombreProducto,
        cantidad: m.cantidadFaltante,
        cantidadFaltante: m.cantidadFaltante,
        stockActual: 0,
        ubicacion: m.ubicacion
      })),
      materialesFaltantes: materialesFaltantes.value
    }
    
    console.log('Guardando reposición por materiales faltantes:', reposicion)
    
    // Intentar guardar en backend
    try {
      await guardarReposicion(reposicion)
    } catch (errorBackend) {
      console.log('Backend no disponible, guardando solo en localStorage')
    }
    
    // Siempre guardar también en localStorage como backup
    guardarReposicionEnHistorial(reposicion)
    
  } catch (error) {
    console.error('Error al guardar reposición:', error)
  }
}

// Navegación
const goBack = () => {
  router.push('/revision')
}

const finalizar = async () => {
  // Guardar reposición antes de limpiar
  await guardarReposicionMaterialesFaltantes()
  
  // Limpiar datos
  limpiarDatosRevision()
  
  router.push('/mision-cumplida')
}

// Inicializar
onMounted(() => {
  cargarMaterialesFaltantes()
})
</script>

<template>
  <div class="materiales-faltantes-view">
    <div class="container">
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <h1>MATERIAL PARA REPONER</h1>

      <div class="alert-box">
        <div class="alert-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="alert-content">
          <div class="alert-title">
            <span>{{ cantidadFaltantes }}</span> Materiales faltantes
          </div>
          <div class="alert-text">
            Se encontraron deficiencias en la revisión del vehículo.
          </div>
        </div>
      </div>

      <div class="section-title">Materiales faltantes</div>
      
      <div class="materiales-list">
        <div v-if="materialesFaltantes.length === 0" class="no-faltantes">
          ¡Todos los materiales están completos!
        </div>
        
        <div 
          v-for="(material, index) in materialesFaltantes" 
          :key="index"
          class="material-faltante"
        >
          <div class="material-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="material-info">
            <div class="material-nombre">{{ material.nombreProducto }}</div>
            <div class="material-falta">Falta: {{ material.cantidadFaltante }}</div>
            <div class="material-ubicacion">{{ material.ubicacion }}</div>
          </div>
        </div>
      </div>

      <button class="btn-finalizar" @click="finalizar">
        Finalizado y repuesto
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.materiales-faltantes-view {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

// Header
.header {
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: #333;
  }
  
  &:hover {
    opacity: 0.7;
  }
}

h1 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: $text-dark;
}

// Alert box
.alert-box {
  background-color: $alert-bg;
  border: 2px solid $alert-border;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 30px;
}

.alert-icon {
  width: 48px;
  height: 48px;
  background-color: $alert-icon-bg;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: $white;
  }
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 18px;
  font-weight: bold;
  color: $primary-red;
  margin-bottom: 4px;
}

.alert-text {
  font-size: 14px;
  color: $primary-red;
}

// Section
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: $text-dark;
}

.materiales-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.no-faltantes {
  text-align: center;
  padding: 20px;
  color: $text-gray;
}

// Material faltante
.material-faltante {
  background: $white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.material-icon {
  width: 56px;
  height: 56px;
  background-color: $material-faltante-icon-bg;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 32px;
    height: 32px;
    color: $primary-red;
  }
}

.material-info {
  flex: 1;
}

.material-nombre {
  font-size: 16px;
  font-weight: $font-semibold;
  margin-bottom: 4px;
  color: $text-dark;
}

.material-falta {
  font-size: 14px;
  color: $primary-red;
  font-weight: $font-semibold;
  margin-bottom: 2px;
}

.material-ubicacion {
  font-size: 13px;
  color: $text-gray;
}

// Botón finalizar
.btn-finalizar {
  @include button-base;
  width: 100%;
  padding: 16px;
  background-color: $primary-red;
  color: $white;
  font-size: 16px;
  
  &:hover {
    background-color: $primary-red-hover;
  }
}

// Responsive
@media (max-width: 480px) {
  .materiales-faltantes-view {
    padding: 16px;
  }
  
  h1 {
    font-size: 18px;
  }
}
</style>
