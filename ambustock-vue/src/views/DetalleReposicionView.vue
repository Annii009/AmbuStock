<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  getReposicionById,
  confirmarReposicion,
  formatearFecha,
  type ReposicionDetalle,
  type MaterialReposicion
} from '@/services/api'

const router = useRouter()
const route = useRoute()

// Estado
const reposicionData = ref<ReposicionDetalle | null>(null)
const materialesModificados = ref<Record<number, number>>({})
const isLoading = ref(true)

// Computed
const infoTitle = computed(() => {
  if (!reposicionData.value) return ''
  const fecha = formatearFecha(reposicionData.value.fechaReposicion || reposicionData.value.fecha)
  return `Reposición ${reposicionData.value.nombreAmbulancia} - ${fecha}`
})

const estadoClass = computed(() => {
  const estado = reposicionData.value?.estado || 'pendiente'
  return estado.toLowerCase()
})

const materiales = computed(() => {
  return reposicionData.value?.materiales || reposicionData.value?.materialesFaltantes || []
})

const totalMateriales = computed(() => {
  return materiales.value.length
})

// Cargar reposición
const cargarReposicion = async () => {
  try {
    const id = parseInt(route.params.id as string)
    
    if (!id) {
      alert('No se ha especificado una reposición')
      router.push('/historial-reposiciones')
      return
    }
    
    isLoading.value = true
    const data = await getReposicionById(id)
    
    if (!data) {
      alert('Reposición no encontrada')
      router.push('/historial-reposiciones')
      return
    }
    
    reposicionData.value = data
    console.log('Reposición cargada:', data)
    
  } catch (error) {
    console.error('Error:', error)
    alert('Error al cargar la reposición')
    router.push('/historial-reposiciones')
  } finally {
    isLoading.value = false
  }
}

// Cambiar cantidad
const cambiarCantidad = (index: number, delta: number) => {
  const cantidadActual = materialesModificados.value[index] || 0
  const nuevaCantidad = Math.max(0, cantidadActual + delta)
  
  materialesModificados.value[index] = nuevaCantidad
}

// Obtener cantidad para un material
const getCantidad = (index: number): number => {
  return materialesModificados.value[index] || 0
}

// Confirmar reposición
const confirmar = async () => {
  if (!confirm('¿Confirmar esta reposición?')) return
  
  try {
    if (!reposicionData.value) return
    
    const id = reposicionData.value.id || reposicionData.value.idReposicion
    
    // Preparar materiales repuestos
    const materialesReponiendo = Object.entries(materialesModificados.value)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([index, cantidad]) => {
        const material = materiales.value[parseInt(index)]
        return {
          nombreProducto: material.nombreProducto || material.nombre,
          cantidadRepuesta: cantidad
        }
      })
    
    console.log('Confirmando reposición:', materialesReponiendo)
    
    await confirmarReposicion(id, materialesReponiendo)
    
    alert('Reposición confirmada exitosamente')
    router.push('/historial-reposiciones')
    
  } catch (error) {
    console.error('Error:', error)
    alert('Error al confirmar la reposición')
  }
}

// Navegación
const goBack = () => {
  router.push('/historial-reposiciones')
}

// Inicializar
onMounted(() => {
  cargarReposicion()
})
</script>

<template>
  <div class="detalle-reposicion-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <h1>REPOSICIÓN DE MATERIAL</h1>

      <div v-if="isLoading" class="loading">Cargando...</div>
      
      <template v-else-if="reposicionData">
        <!-- Info reposición -->
        <div class="reposicion-info">
          <div class="info-title">{{ infoTitle }}</div>
          <div class="estado-badge" :class="estadoClass">
            {{ reposicionData.estado }}
          </div>
        </div>

        <!-- Contador -->
        <div class="materiales-counter">
          <div class="counter-number">{{ totalMateriales }}</div>
          <div class="counter-label">Materiales para reponer</div>
        </div>

        <!-- Lista de materiales -->
        <div class="materiales-list">
          <div 
            v-for="(material, index) in materiales" 
            :key="index"
            class="material-card"
          >
            <div class="material-header">
              <div class="material-name">
                {{ material.nombreProducto || material.nombre }}
              </div>
              <div 
                class="material-badge" 
                :class="(material.stockActual || 0) === 0 ? 'faltante' : 'stock-bajo'"
              >
                {{ (material.stockActual || 0) === 0 ? 'faltante' : 'Stock bajo' }}
              </div>
            </div>
            
            <div class="material-ubicacion">
              Ubicación: {{ material.ubicacion || material.nombreZona || 'N/A' }}
            </div>
            
            <div class="material-stocks">
              <div class="stock-item">
                <div class="stock-label">Stock actual</div>
                <div class="stock-value">{{ material.stockActual || 0 }}</div>
              </div>
              <div class="stock-item">
                <div class="stock-label">Requerido</div>
                <div class="stock-value required">
                  {{ material.cantidadFaltante || material.cantidad || 0 }}
                </div>
              </div>
            </div>
            
            <div class="quantity-controls">
              <button 
                class="btn-quantity minus" 
                :disabled="getCantidad(index) === 0"
                @click="cambiarCantidad(index, -1)"
              >
                −
              </button>
              <div class="quantity-display">{{ getCantidad(index) }}</div>
              <button 
                class="btn-quantity plus"
                @click="cambiarCantidad(index, 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Botón confirmar -->
        <button class="btn-confirmar" @click="confirmar">
          Confirmar Reposición
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.detalle-reposicion-view {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: $white;
  min-height: 100vh;
  padding: 20px;
  padding-bottom: 100px;
}

// Header
.header {
  margin-bottom: 20px;
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
    color: $text-dark;
  }
  
  &:hover {
    opacity: 0.7;
  }
}

h1 {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: $text-dark;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: $text-gray;
}

// Info reposición
.reposicion-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.info-title {
  font-size: 14px;
  font-weight: $font-semibold;
  color: #333;
}

.estado-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: $font-semibold;
  
  &.completada {
    background: $estado-completada-bg;
    color: $estado-completada-text;
  }
  
  &.pendiente {
    background: $estado-pendiente-bg;
    color: $estado-pendiente-text;
  }
}

// Contador
.materiales-counter {
  text-align: center;
  margin-bottom: 30px;
}

.counter-number {
  font-size: 48px;
  font-weight: 700;
  color: $primary-red;
  line-height: 1;
  margin-bottom: 8px;
}

.counter-label {
  font-size: 16px;
  color: $text-gray;
}

// Lista de materiales
.materiales-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.material-card {
  background: $white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 16px;
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.material-name {
  font-size: 16px;
  font-weight: $font-semibold;
  color: $text-dark;
  flex: 1;
}

.material-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: $font-semibold;
  white-space: nowrap;
  
  &.faltante {
    background: $badge-faltante-bg;
    color: $badge-faltante-text;
  }
  
  &.stock-bajo {
    background: $badge-stock-bajo-bg;
    color: $badge-stock-bajo-text;
  }
}

.material-ubicacion {
  font-size: 13px;
  color: $text-gray;
  margin-bottom: 16px;
}

.material-stocks {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.stock-item {
  flex: 1;
}

.stock-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stock-value {
  font-size: 24px;
  font-weight: 700;
  color: $stock-alert;
  
  &.required {
    color: #333;
  }
}

// Controles de cantidad
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.btn-quantity {
  width: 36px;
  height: 36px;
  border: 2px solid $primary-red;
  background: $white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: $font-semibold;
  color: $primary-red;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: $primary-red;
    color: $white;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.quantity-display {
  font-size: 20px;
  font-weight: 700;
  color: $text-dark;
  min-width: 40px;
  text-align: center;
}

// Botón confirmar
.btn-confirmar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 560px;
  padding: 16px;
  background: $primary-red;
  color: $white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: $primary-red-hover;
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
  
  &:active {
    transform: translateX(-50%) scale(0.98);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

// Responsive
@media (max-width: 480px) {
  .counter-number {
    font-size: 40px;
  }
}
</style>
