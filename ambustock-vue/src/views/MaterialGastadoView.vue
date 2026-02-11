<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getMateriales,
  getServicios,
  getAmbulancias,
  saveReposicionData,
  type MaterialProducto,
  type MaterialSeleccionado,
  type Servicio,
  type Ambulancia,
  ApiError
} from '@/services/api'

const router = useRouter()

// Estado
const allMateriales = ref<MaterialProducto[]>([])
const allServicios = ref<Servicio[]>([])
const allAmbulancias = ref<Ambulancia[]>([])

const searchMaterial = ref('')
const searchServicio = ref('')
const nombreResponsable = ref('')
const ambulanciaSeleccionadaId = ref<number | null>(null)

const materialesSeleccionados = ref<MaterialSeleccionado[]>([])
const showMaterialAutocomplete = ref(false)
const showServicioAutocomplete = ref(false)

const isLoading = ref(true)

// Computed
const materialesFiltrados = computed(() => {
  const query = searchMaterial.value.trim().toLowerCase()
  if (query.length === 0) return []
  
  return allMateriales.value
    .filter(m => m.nombreProducto.toLowerCase().includes(query))
    .slice(0, 5)
})

const serviciosFiltrados = computed(() => {
  const query = searchServicio.value.trim().toLowerCase()
  if (query.length === 0) return []
  
  return allServicios.value
    .filter(s => s.nombreServicio.toLowerCase().includes(query))
    .slice(0, 5)
})

const ambulanciaSeleccionada = computed(() => {
  if (!ambulanciaSeleccionadaId.value) return null
  return allAmbulancias.value.find(a => a.idAmbulancia === ambulanciaSeleccionadaId.value) || null
})

const isFormValid = computed(() => {
  return materialesSeleccionados.value.length > 0 &&
         searchServicio.value.trim().length > 0 &&
         nombreResponsable.value.trim().length > 0 &&
         ambulanciaSeleccionadaId.value !== null
})

// Cargar datos
const cargarDatos = async () => {
  try {
    isLoading.value = true
    
    const [materiales, servicios, ambulancias] = await Promise.all([
      getMateriales(),
      getServicios(),
      getAmbulancias()
    ])
    
    allMateriales.value = materiales
    allServicios.value = servicios
    allAmbulancias.value = ambulancias
    
  } catch (error) {
    console.error('Error al cargar datos:', error)
    if (error instanceof ApiError) {
      alert(`Error: ${error.message}`)
    }
  } finally {
    isLoading.value = false
  }
}

// Materiales
const agregarMaterial = (material: MaterialProducto) => {
  const existe = materialesSeleccionados.value.find(m => m.idMaterial === material.idMaterial)
  
  if (!existe) {
    materialesSeleccionados.value.push({
      ...material,
      cantidad: 1
    })
  }
  
  searchMaterial.value = ''
  showMaterialAutocomplete.value = false
}

const cambiarCantidad = (index: number, delta: number) => {
  const material = materialesSeleccionados.value[index]
  material.cantidad += delta
  
  if (material.cantidad < 1) {
    material.cantidad = 1
  }
}

const eliminarMaterial = (index: number) => {
  materialesSeleccionados.value.splice(index, 1)
}

const seleccionarMaterialAutocomplete = (material: MaterialProducto) => {
  agregarMaterial(material)
}

const agregarMaterialPorBoton = () => {
  const query = searchMaterial.value.trim()
  if (!query) return
  
  const material = allMateriales.value.find(m => 
    m.nombreProducto.toLowerCase() === query.toLowerCase()
  )
  
  if (material) {
    agregarMaterial(material)
  }
}

// Servicios
const seleccionarServicioAutocomplete = (servicio: Servicio) => {
  searchServicio.value = servicio.nombreServicio
  showServicioAutocomplete.value = false
}

// Watch para autocomplete
const onSearchMaterialChange = () => {
  showMaterialAutocomplete.value = materialesFiltrados.value.length > 0
}

const onSearchServicioChange = () => {
  showServicioAutocomplete.value = serviciosFiltrados.value.length > 0
}

// Navegación
const goBack = () => {
  router.push('/principal')
}

const continuar = () => {
  if (!isFormValid.value || !ambulanciaSeleccionada.value) return
  
  const data = {
    materiales: materialesSeleccionados.value,
    servicio: searchServicio.value.trim(),
    responsable: nombreResponsable.value.trim(),
    ambulancia: ambulanciaSeleccionada.value
  }
  
  saveReposicionData(data)
  router.push('/sugerencias')
}

// Inicializar
onMounted(() => {
  cargarDatos()
})
</script>

<template>
  <div class="material-gastado-view">
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

      <h1>MATERIAL GASTADO DEL SERVICIO</h1>

      <div v-if="isLoading" class="loading">Cargando datos...</div>
      
      <template v-else>
        <h2>Material gastado</h2>
        <p class="subtitle">Seleccione o busque el material</p>

        <!-- Búsqueda de material -->
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchMaterial"
            @input="onSearchMaterialChange"
            placeholder="Buscar material" 
            autocomplete="off"
          >
          <button class="btn-add" @click="agregarMaterialPorBoton">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          
          <div 
            class="autocomplete-list" 
            :class="{ show: showMaterialAutocomplete }"
          >
            <div 
              v-for="material in materialesFiltrados" 
              :key="material.idMaterial"
              class="autocomplete-item"
              @click="seleccionarMaterialAutocomplete(material)"
            >
              {{ material.nombreProducto }}
            </div>
          </div>
        </div>

        <!-- Lista de materiales seleccionados -->
        <div class="material-list">
          <div 
            v-for="(material, index) in materialesSeleccionados" 
            :key="material.idMaterial"
            class="material-item"
          >
            <span class="material-name">{{ material.nombreProducto }}</span>
            <div class="material-controls">
              <button class="btn-qty" @click="cambiarCantidad(index, -1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="material-qty">{{ material.cantidad }}</span>
              <button class="btn-qty" @click="cambiarCantidad(index, 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button class="btn-delete" @click="eliminarMaterial(index)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Ambulancia -->
        <h3 class="section-title">Ambulancia</h3>
        <select v-model="ambulanciaSeleccionadaId" class="select-input">
          <option :value="null">Selecciona una ambulancia</option>
          <option 
            v-for="ambulancia in allAmbulancias" 
            :key="ambulancia.idAmbulancia"
            :value="ambulancia.idAmbulancia"
          >
            {{ ambulancia.nombre }} - {{ ambulancia.matricula }}
          </option>
        </select>

        <!-- Servicio -->
        <h3 class="section-title">Servicio donde se ha gastado el material</h3>
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchServicio"
            @input="onSearchServicioChange"
            placeholder="Ej: Cementerio día 31" 
            autocomplete="off"
          >
          
          <div 
            class="autocomplete-list" 
            :class="{ show: showServicioAutocomplete }"
          >
            <div 
              v-for="servicio in serviciosFiltrados" 
              :key="servicio.idServicio"
              class="autocomplete-item"
              @click="seleccionarServicioAutocomplete(servicio)"
            >
              {{ servicio.nombreServicio }}
            </div>
          </div>
        </div>

        <!-- Responsable -->
        <h3 class="section-title">Persona que realiza la reposición</h3>
        <input 
          type="text" 
          v-model="nombreResponsable"
          placeholder="Ingrese nombre completo" 
          class="text-input"
        >

        <!-- Botón continuar -->
        <button 
          class="btn-continue" 
          :disabled="!isFormValid"
          @click="continuar"
        >
          Continuar
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.material-gastado-view {
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

h2 {
  font-size: 18px;
  font-weight: $font-semibold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: $text-gray;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: $font-semibold;
  margin: 30px 0 15px;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: $text-gray;
}

// Search container
.search-container {
  position: relative;
  margin-bottom: 20px;
  
  input {
    width: 100%;
    padding: 14px 50px 14px 16px;
    border: 2px solid $autocomplete-border;
    border-radius: 12px;
    font-size: 15px;
    transition: border-color 0.3s;
    
    &:focus {
      outline: none;
      border-color: $primary-red;
    }
  }
}

.btn-add {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: $primary-red;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: $primary-red-hover;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: $white;
  }
}

// Autocomplete
.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $autocomplete-bg;
  border: 2px solid $autocomplete-border;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 200px;
  overflow-y: auto;
  display: none;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &.show {
    display: block;
  }
}

.autocomplete-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
  
  &:hover {
    background-color: $autocomplete-hover;
  }
  
  &:active {
    background-color: $autocomplete-active;
  }
}

// Material list
.material-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: $material-item-bg;
  border-radius: 12px;
  border: 1px solid $material-item-border;
}

.material-name {
  font-size: 15px;
  font-weight: 500;
  flex: 1;
}

.material-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-qty {
  width: 32px;
  height: 32px;
  border: 1px solid $qty-btn-border;
  background: $qty-btn-bg;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: $qty-btn-hover;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.material-qty {
  font-size: 18px;
  font-weight: $font-semibold;
  min-width: 30px;
  text-align: center;
}

.btn-delete {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $delete-color;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
}

// Select and text input
.select-input,
.text-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid $autocomplete-border;
  border-radius: 12px;
  font-size: 15px;
  margin-bottom: 20px;
  background-color: $white;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: $primary-red;
  }
}

.select-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

.text-input {
  margin-bottom: 30px;
}

// Continue button
.btn-continue {
  @include button-base;
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  background-color: #c4a4a4;
  color: $white;
  
  &:not(:disabled) {
    background-color: $primary-red;
    
    &:hover {
      background-color: $primary-red-hover;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
    }
  }
  
  &:disabled {
    cursor: not-allowed;
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
}
</style>
