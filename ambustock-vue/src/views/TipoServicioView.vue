<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getServicios, saveServicioSeleccionado, type Servicio, ApiError } from '@/services/api'

const router = useRouter()

// Estado
const servicios = ref<Servicio[]>([])
const servicioSeleccionado = ref<number | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed
const isContinueDisabled = computed(() => !servicioSeleccionado.value)

// Cargar servicios
const cargarServicios = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    servicios.value = await getServicios()
  } catch (err) {
    if (err instanceof ApiError) {
      error.value = err.message
    } else {
      error.value = 'Error al cargar servicios'
    }
    console.error('Error cargando servicios:', err)
  } finally {
    isLoading.value = false
  }
}

// Navegación
const goBack = () => {
  router.push('/seleccion-ambulancia')
}

const continuar = () => {
  if (servicioSeleccionado.value) {
    saveServicioSeleccionado(servicioSeleccionado.value)
    router.push('/nombre-responsable')
  }
}

// Inicializar
onMounted(() => {
  cargarServicios()
})
</script>

<template>
  <div class="tipo-servicio">
    <div class="container">
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <img src="/logo1Rojo.png" alt="AmbuStock" class="logo-small">
      </div>

      <h1>TIPO DE SERVICIO</h1>

      <div class="progress-container">
        <div class="progress-bar completed"></div>
        <div class="progress-bar active"></div>
        <div class="progress-bar"></div>
      </div>

      <div class="form-content">
        <label for="servicio">Servicio</label>
        <div class="select-wrapper">
          <select 
            id="servicio" 
            v-model="servicioSeleccionado"
            class="custom-select" 
            :class="{ loading: isLoading }"
            :disabled="isLoading || !!error"
          >
            <option v-if="isLoading" value="">Cargando...</option>
            <option v-else-if="error" value="">{{ error }}</option>
            <option v-else value="">Seleccionar servicio</option>
            
            <option 
              v-for="servicio in servicios" 
              :key="servicio.idServicio"
              :value="servicio.idServicio"
            >
              {{ servicio.nombreServicio }}
            </option>
          </select>
        </div>
      </div>

      <button 
        class="btn-continuar" 
        :disabled="isContinueDisabled"
        @click="continuar"
      >
        Continuar
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.tipo-servicio {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
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

.logo-small {
  height: 50px;
}

// Título
h1 {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: $text-dark;
}

// Progress bar
.progress-container {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  justify-content: center;
}

.progress-bar {
  height: 4px;
  width: 60px;
  background-color: $progress-inactive;
  border-radius: 2px;
  transition: background-color 0.3s;
  
  &.completed,
  &.active {
    background-color: $progress-active;
  }
}

// Form
.form-content {
  flex: 1;
}

label {
  display: block;
  font-size: 14px;
  font-weight: $font-semibold;
  margin-bottom: 8px;
  color: #333;
}

.select-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.custom-select {
  width: 100%;
  padding: 14px 40px 14px 16px;
  font-size: 15px;
  border: 1px solid $select-border;
  border-radius: 8px;
  background-color: $select-bg;
  color: $text-gray;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  
  &:focus {
    outline: none;
    border-color: $primary-red;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &.loading {
    background-image: none;
    color: #999;
  }
  
  option {
    padding: 14px 16px;
    cursor: pointer;
    
    &:hover {
      background-color: $select-hover-bg;
    }
    
    &:checked {
      background-color: $select-checked-bg;
      color: $primary-red;
    }
  }
}

// Botón continuar
.btn-continuar {
  @include button-base;
  width: 100%;
  padding: 16px;
  background-color: $primary-red;
  color: $white;
  font-size: 16px;
  margin-top: auto;
  
  &:not(:disabled):hover {
    background-color: $primary-red-hover;
  }
  
  &:disabled {
    background-color: $btn-disabled-bg;
    cursor: not-allowed;
  }
}

// Responsive
@media (max-width: 480px) {
  .container {
    padding: 10px;
  }
  
  h1 {
    font-size: 18px;
  }
  
  .logo-small {
    height: 40px;
  }
}
</style>
