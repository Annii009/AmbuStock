<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getRevisionAmbulancia, 
  guardarRevision,
  guardarEstadoRevision,
  cargarEstadoRevision,
  limpiarEstadoRevision,
  guardarMaterialesFaltantes,
  getAmbulanciaSeleccionada,
  getServicioSeleccionado,
  getNombreResponsable,
  type RevisionData,
  type Zona,
  type Material,
  ApiError
} from '@/services/api'
import { useRevision } from '@/composables/useRevision'

const router = useRouter()
const { 
  contarTotalMateriales, 
  contarMaterialesRevisados, 
  inicializarCantidadesRevisadas,
  obtenerMaterialesFaltantes
} = useRevision()

// Estado
const revisionData = ref<RevisionData | null>(null)
const ambulanciaId = ref<number | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Modal
const isModalOpen = ref(false)
const zonaActual = ref<Zona | null>(null)
const zonaActualIndex = ref<number | null>(null)

// Progreso
const progresoTotal = computed(() => {
  if (!revisionData.value) return { porcentaje: 0, revisados: 0, total: 0 }
  
  let total = 0
  let revisados = 0
  
  revisionData.value.zonas.forEach(zona => {
    total += contarTotalMateriales(zona)
    revisados += contarMaterialesRevisados(zona)
  })
  
  const porcentaje = total > 0 ? Math.round((revisados / total) * 100) : 0
  
  return { porcentaje, revisados, total }
})

// Cargar revisión
const cargarRevision = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    ambulanciaId.value = getAmbulanciaSeleccionada()
    
    if (!ambulanciaId.value) {
      alert('No se ha seleccionado ninguna ambulancia')
      router.push('/seleccion-ambulancia')
      return
    }
    
    const data = await getRevisionAmbulancia(ambulanciaId.value)
    revisionData.value = data
    
    inicializarCantidadesRevisadas(revisionData.value.zonas)
    
    // Cargar estado guardado si existe
    const estadoGuardado = cargarEstadoRevision(ambulanciaId.value)
    if (estadoGuardado) {
      mergeEstadoGuardado(estadoGuardado)
    }
    
  } catch (err) {
    if (err instanceof ApiError) {
      error.value = err.message
      alert(`Error al cargar la revisión: ${err.message}`)
    } else {
      error.value = 'Error al cargar revisión'
    }
    console.error('Error cargando revisión:', err)
  } finally {
    isLoading.value = false
  }
}

// Merge estado guardado
const mergeEstadoGuardado = (estadoData: RevisionData) => {
  if (!revisionData.value) return
  
  revisionData.value.zonas.forEach((zona, zIndex) => {
    if (zona.materiales && estadoData.zonas[zIndex]?.materiales) {
      zona.materiales.forEach((material, mIndex) => {
        if (estadoData.zonas[zIndex].materiales![mIndex]) {
          material.cantidadRevisada = estadoData.zonas[zIndex].materiales![mIndex].cantidadRevisada || 0
        }
      })
    }
    
    if (zona.cajones && estadoData.zonas[zIndex]?.cajones) {
      zona.cajones.forEach((cajon, cIndex) => {
        if (cajon.materiales && estadoData.zonas[zIndex].cajones![cIndex]?.materiales) {
          cajon.materiales.forEach((material, mIndex) => {
            if (estadoData.zonas[zIndex].cajones![cIndex].materiales![mIndex]) {
              material.cantidadRevisada = estadoData.zonas[zIndex].cajones![cIndex].materiales![mIndex].cantidadRevisada || 0
            }
          })
        }
      })
    }
  })
}

// Guardar estado
const guardarEstado = () => {
  if (revisionData.value && ambulanciaId.value) {
    guardarEstadoRevision(ambulanciaId.value, revisionData.value)
  }
}

// Abrir modal de zona
const abrirModalZona = (zona: Zona, index: number) => {
  zonaActual.value = zona
  zonaActualIndex.value = index
  isModalOpen.value = true
}

const cerrarModal = () => {
  isModalOpen.value = false
  zonaActual.value = null
  zonaActualIndex.value = null
}

// Cambiar cantidad de material
const cambiarCantidad = (zonaIndex: number, cajonIndex: number | null, materialIndex: number, cambio: number) => {
  if (!revisionData.value) return
  
  let material: Material
  
  if (cajonIndex === null) {
    material = revisionData.value.zonas[zonaIndex].materiales![materialIndex]
  } else {
    material = revisionData.value.zonas[zonaIndex].cajones![cajonIndex].materiales[materialIndex]
  }
  
  const nuevaCantidad = (material.cantidadRevisada || 0) + cambio
  
  if (nuevaCantidad >= 0 && nuevaCantidad <= material.cantidad) {
    material.cantidadRevisada = nuevaCantidad
    guardarEstado()
  }
}

// Seleccionar cajón completo
const seleccionarCajon = (zonaIndex: number, cajonIndex: number) => {
  if (!revisionData.value) return
  
  const cajon = revisionData.value.zonas[zonaIndex].cajones![cajonIndex]
  
  if (cajon.materiales) {
    cajon.materiales.forEach(material => {
      material.cantidadRevisada = material.cantidad
    })
  }
  
  guardarEstado()
}

// Seleccionar zona completa
const seleccionarZonaCompleta = () => {
  if (!revisionData.value || zonaActualIndex.value === null) return
  
  const zona = revisionData.value.zonas[zonaActualIndex.value]
  
  if (zona.materiales) {
    zona.materiales.forEach(material => {
      material.cantidadRevisada = material.cantidad
    })
  }
  
  if (zona.cajones) {
    zona.cajones.forEach(cajon => {
      if (cajon.materiales) {
        cajon.materiales.forEach(material => {
          material.cantidadRevisada = material.cantidad
        })
      }
    })
  }
  
  guardarEstado()
}

// Navegación
const goBack = () => {
  if (confirm('¿Estás seguro de que quieres salir? El progreso se guardará automáticamente.')) {
    router.push('/nombre-responsable')
  }
}

// Finalizar revisión
const finalizarRevision = async () => {
  try {
    if (!revisionData.value || !ambulanciaId.value) return
    
    const servicioId = getServicioSeleccionado()
    const nombreResponsable = getNombreResponsable()
    
    if (!servicioId || !nombreResponsable) {
      alert('Faltan datos para finalizar la revisión')
      return
    }
    
    const faltantes = obtenerMaterialesFaltantes(revisionData.value.zonas)
    guardarMaterialesFaltantes(faltantes)
    
    const revisionCompleta = {
      idAmbulancia: ambulanciaId.value,
      idServicio: servicioId,
      nombreResponsable: nombreResponsable,
      fechaRevision: new Date().toISOString(),
      zonas: revisionData.value.zonas
    }
    
    await guardarRevision(revisionCompleta)
    
    // Limpiar estado guardado
    limpiarEstadoRevision(ambulanciaId.value)
    
    router.push('/materiales-faltantes')
    
  } catch (err) {
    console.error('Error:', err)
    alert('Error al guardar la revisión: ' + (err instanceof Error ? err.message : 'Error desconocido'))
  }
}

// Inicializar
onMounted(() => {
  cargarRevision()
})
</script>

<template>
  <div class="revision-view">
    <div class="container">
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <h1>REVISIÓN DE AMBULANCIA</h1>

      <div v-if="isLoading" class="loading">Cargando revisión...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <template v-else-if="revisionData">
        <div class="progress-section">
          <div class="progress-label">
            <span>Progreso total</span>
            <span>{{ progresoTotal.porcentaje }}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: progresoTotal.porcentaje + '%' }"></div>
          </div>
        </div>

        <div class="zonas-list">
          <div 
            v-for="(zona, index) in revisionData.zonas" 
            :key="index"
            class="zona-item"
            :class="{ completed: contarTotalMateriales(zona) === contarMaterialesRevisados(zona) && contarTotalMateriales(zona) > 0 }"
            @click="abrirModalZona(zona, index)"
          >
            <div class="zona-content">
              <div class="zona-name">{{ zona.nombreZona }}</div>
              <div class="zona-progress">
                {{ contarMaterialesRevisados(zona) }}/{{ contarTotalMateriales(zona) }} materiales revisados
              </div>
            </div>
            <div v-if="contarTotalMateriales(zona) === contarMaterialesRevisados(zona) && contarTotalMateriales(zona) > 0" class="zona-check">
              ✓
            </div>
            <div v-else class="zona-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <button class="btn-finalizar" @click="finalizarRevision">
          Finalizar
        </button>
      </template>
    </div>

    <!-- Modal de zona -->
    <div v-if="isModalOpen && zonaActual" class="modal show" @click.self="cerrarModal">
      <div class="modal-content">
        <div class="modal-header">
          <button class="modal-close" @click="cerrarModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h2>{{ zonaActual.nombreZona }}</h2>
        </div>
        
        <div class="modal-actions">
          <button class="btn-select-all" @click="seleccionarZonaCompleta">
            Seleccionar toda la zona
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Cajones -->
          <div v-if="zonaActual.cajones && zonaActual.cajones.length > 0">
            <div v-for="(cajon, cajonIndex) in zonaActual.cajones" :key="cajonIndex" class="cajon-section">
              <div class="cajon-header expanded">
                <h3>{{ cajon.nombreCajon }}</h3>
                <button 
                  class="btn-select-cajon"
                  @click.stop="seleccionarCajon(zonaActualIndex!, cajonIndex)"
                >
                  Seleccionar cajón
                </button>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              <div class="cajon-materials show">
                <div 
                  v-for="(material, materialIndex) in cajon.materiales" 
                  :key="materialIndex"
                  class="material-item"
                >
                  <div class="material-info">
                    <div class="material-name">{{ material.nombreProducto }}</div>
                    <div class="material-cantidad">Cantidad esperada: {{ material.cantidad }}</div>
                  </div>
                  <div class="quantity-controls">
                    <button 
                      class="btn-quantity minus"
                      @click="cambiarCantidad(zonaActualIndex!, cajonIndex, materialIndex, -1)"
                    >
                      −
                    </button>
                    <span class="quantity-value">{{ material.cantidadRevisada || 0 }}</span>
                    <button 
                      class="btn-quantity plus"
                      @click="cambiarCantidad(zonaActualIndex!, cajonIndex, materialIndex, 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Materiales directos -->
          <div v-if="zonaActual.materiales && zonaActual.materiales.length > 0" class="materiales-directos">
            <div v-if="zonaActual.cajones && zonaActual.cajones.length > 0" class="materiales-directos-title">
              Materiales sueltos
            </div>
            
            <div 
              v-for="(material, materialIndex) in zonaActual.materiales" 
              :key="materialIndex"
              class="material-item"
            >
              <div class="material-info">
                <div class="material-name">{{ material.nombreProducto }}</div>
                <div class="material-cantidad">Cantidad esperada: {{ material.cantidad }}</div>
              </div>
              <div class="quantity-controls">
                <button 
                  class="btn-quantity minus"
                  @click="cambiarCantidad(zonaActualIndex!, null, materialIndex, -1)"
                >
                  −
                </button>
                <span class="quantity-value">{{ material.cantidadRevisada || 0 }}</span>
                <button 
                  class="btn-quantity plus"
                  @click="cambiarCantidad(zonaActualIndex!, null, materialIndex, 1)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.revision-view {
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

// Loading & Error
.loading,
.error {
  text-align: center;
  padding: 40px 20px;
  font-size: 16px;
  color: $text-gray;
}

.error {
  color: $error-text;
}

// Progress
.progress-section {
  margin-bottom: 30px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: $text-gray;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: $progress-bar-bg;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: $progress-bar-fill;
  transition: width 0.3s ease;
}

// Zonas list
.zonas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.zona-item {
  background: $white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.completed {
    background-color: $zona-completed-bg;
    color: $white;
    
    .zona-progress {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .zona-check {
      background-color: $white;
      color: $zona-completed-bg;
    }
  }
}

.zona-content {
  flex: 1;
}

.zona-name {
  font-size: 16px;
  font-weight: $font-semibold;
  margin-bottom: 4px;
}

.zona-progress {
  font-size: 13px;
  color: $text-gray;
}

.zona-arrow {
  display: flex;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
}

.zona-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: $zona-check-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  font-size: 16px;
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

// Modal
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $modal-overlay-bg;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  
  &.show {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
}

.modal-content {
  background: $white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  max-height: $modal-max-height;
  display: flex;
  flex-direction: column;
  @include slideIn;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    font-size: 18px;
    font-weight: $font-semibold;
    flex: 1;
  }
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: $text-gray;
  }
  
  &:hover {
    opacity: 0.7;
  }
}

.modal-actions {
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.btn-select-all {
  width: 100%;
  padding: 12px;
  background-color: $green-accent;
  color: $white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

// Cajones
.cajon-section {
  margin-bottom: 24px;
}

.cajon-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  
  h3 {
    font-size: 15px;
    font-weight: $font-semibold;
    flex: 1;
  }
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }
  
  &.expanded svg {
    transform: rotate(180deg);
  }
}

.btn-select-cajon {
  padding: 6px 12px;
  background-color: $green-accent;
  color: $white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
}

.cajon-materials {
  display: none;
  padding-left: 8px;
  
  &.show {
    display: block;
  }
}

// Materiales
.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.material-info {
  flex: 1;
}

.material-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.material-cantidad {
  font-size: 13px;
  color: $text-gray;
}

// Quantity controls
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-quantity {
  width: $quantity-btn-size;
  height: $quantity-btn-size;
  border-radius: 50%;
  border: 2px solid $primary-red;
  background: $white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s;
  color: $primary-red;
  
  &:hover {
    background-color: $primary-red;
    color: $white;
  }
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: $font-semibold;
  color: $text-dark;
}

.materiales-directos {
  margin-top: 16px;
}

.materiales-directos-title {
  font-size: 15px;
  font-weight: $font-semibold;
  margin-bottom: 12px;
  color: $text-dark;
}

// Responsive
@media (max-width: 480px) {
  .revision-view {
    padding: 16px;
  }
  
  h1 {
    font-size: 18px;
  }
  
  .zona-name {
    font-size: 15px;
  }
}
</style>
