<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getHistorialReposiciones,
  obtenerEstadoReposicion,
  formatearFechaLarga,
  type ReposicionDetalle
} from '@/services/api'

const router = useRouter()

// Estado
const todasLasReposiciones = ref<ReposicionDetalle[]>([])
const filtroActual = ref('todas')
const searchQuery = ref('')
const isLoading = ref(true)

// Computed
const reposicionesFiltradas = computed(() => {
  let reposiciones = [...todasLasReposiciones.value]
  
  // Filtro por búsqueda
  const busqueda = searchQuery.value.toLowerCase().trim()
  if (busqueda) {
    reposiciones = reposiciones.filter(r => 
      (r.nombreAmbulancia && r.nombreAmbulancia.toLowerCase().includes(busqueda)) ||
      (r.matricula && r.matricula.toLowerCase().includes(busqueda)) ||
      (r.nombreResponsable && r.nombreResponsable.toLowerCase().includes(busqueda))
    )
  }
  
  // Filtro por estado
  if (filtroActual.value !== 'todas') {
    reposiciones = reposiciones.filter(r => {
      const estado = obtenerEstadoReposicion(r)
      return estado.clase === filtroActual.value
    })
  }
  
  // Ordenar por fecha (más reciente primero)
  reposiciones.sort((a, b) => {
    const fechaA = new Date(a.fechaReposicion || a.fecha)
    const fechaB = new Date(b.fechaReposicion || b.fecha)
    return fechaB.getTime() - fechaA.getTime()
  })
  
  return reposiciones
})

const mostrarNoResults = computed(() => {
  return !isLoading.value && reposicionesFiltradas.value.length === 0
})

// Cargar reposiciones
const cargarReposiciones = async () => {
  try {
    isLoading.value = true
    const reposiciones = await getHistorialReposiciones()
    todasLasReposiciones.value = reposiciones
    console.log('Reposiciones cargadas:', reposiciones)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

// Cambiar filtro
const cambiarFiltro = (filtro: string) => {
  filtroActual.value = filtro
}

// Ver detalle
const verDetalle = (id: number) => {
  router.push(`/detalle-reposicion/${id}`)
}

// Navegación
const goBack = () => {
  router.push('/perfil')
}

// Inicializar
onMounted(() => {
  cargarReposiciones()
})
</script>

<template>
  <div class="historial-reposiciones-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <h1>HISTORIAL DE REPOSICIONES</h1>

      <!-- Búsqueda -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Buscar por ambulancia o revisor..."
        >
      </div>

      <!-- Filtros -->
      <div class="filters">
        <button 
          class="filter-btn" 
          :class="{ active: filtroActual === 'todas' }"
          @click="cambiarFiltro('todas')"
        >
          Todas
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filtroActual === 'completada' }"
          @click="cambiarFiltro('completada')"
        >
          Completadas
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filtroActual === 'pendiente' }"
          @click="cambiarFiltro('pendiente')"
        >
          Pendientes
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filtroActual === 'sin-realizar' }"
          @click="cambiarFiltro('sin-realizar')"
        >
          Sin realizar
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filtroActual === 'urgente' }"
          @click="cambiarFiltro('urgente')"
        >
          Urgentes
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Cargando reposiciones...</p>
      </div>

      <!-- Lista de reposiciones -->
      <div v-else-if="!mostrarNoResults" class="reposiciones-list">
        <div 
          v-for="reposicion in reposicionesFiltradas" 
          :key="reposicion.id || reposicion.idReposicion"
          class="reposicion-card"
          @click="verDetalle(reposicion.id || reposicion.idReposicion)"
        >
          <div class="reposicion-header">
            <div>
              <div class="reposicion-date">
                {{ formatearFechaLarga(reposicion.fechaReposicion || reposicion.fecha) }}
              </div>
              <div class="reposicion-ambulancia">
                {{ reposicion.nombreAmbulancia || 'AMBULANCIA' }}
              </div>
              <div class="reposicion-matricula">
                Matrícula: {{ reposicion.matricula || 'N/A' }}
              </div>
            </div>
            <div 
              class="status-badge" 
              :class="obtenerEstadoReposicion(reposicion).clase"
            >
              {{ obtenerEstadoReposicion(reposicion).texto }}
            </div>
          </div>
          <div class="reposicion-footer">
            <div class="reposicion-revisor">
              <svg class="revisor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{{ reposicion.nombreResponsable || 'Sin asignar' }}</span>
            </div>
            <svg class="reposicion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-if="mostrarNoResults" class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>No se encontraron reposiciones</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.historial-reposiciones-view {
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

// Búsqueda
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: none;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  color: #333;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    background: #e8e8e8;
  }
}

// Filtros
.filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-bottom: 20px;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: $white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: $text-gray;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  flex-shrink: 0;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.active {
    background: $primary-red;
    color: $white;
    border-color: $primary-red;
  }
}

// Lista de reposiciones
.reposiciones-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reposicion-card {
  background: $white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.reposicion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reposicion-date {
  font-size: 13px;
  color: $text-gray;
  margin-bottom: 4px;
}

.reposicion-ambulancia {
  font-size: 18px;
  font-weight: 700;
  color: $text-dark;
  margin-bottom: 4px;
}

.reposicion-matricula {
  font-size: 14px;
  color: $text-gray;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: $font-semibold;
  white-space: nowrap;
  
  &.completada {
    background: $estado-completada-bg;
    color: $estado-completada-text;
  }
  
  &.pendiente {
    background: $estado-pendiente-bg;
    color: $estado-pendiente-text;
  }
  
  &.sin-realizar {
    background: #E8E8E8;
    color: #7F8C8D;
  }
  
  &.urgente {
    background: $badge-faltante-bg;
    color: $badge-faltante-text;
  }
}

.reposicion-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.reposicion-revisor {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: $text-gray;
}

.revisor-icon {
  width: 16px;
  height: 16px;
}

.reposicion-arrow {
  width: 20px;
  height: 20px;
  color: #999;
}

// Loading
.loading {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $spinner-border;
  border-top-color: $spinner-color;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: $text-gray;
  font-size: 15px;
}

// Sin resultados
.no-results {
  text-align: center;
  padding: 60px 20px;
  
  svg {
    width: 60px;
    height: 60px;
    color: $no-results-icon;
    margin-bottom: 16px;
  }
  
  p {
    color: $no-results-text;
    font-size: 16px;
  }
}
</style>
