<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  isAdmin,
  type UsuarioResponsable
} from '@/services/api'

const router = useRouter()

// Estado
const allResponsables = ref<UsuarioResponsable[]>([])
const searchQuery = ref('')
const isLoading = ref(true)

// Modal crear/editar
const showModalResponsable = ref(false)
const editingResponsable = ref<UsuarioResponsable | null>(null)
const formData = ref<UsuarioResponsable>({
  nombreUsuario: '',
  rol: '',
  email: '',
  password: ''
})

// Modal eliminar
const showModalEliminar = ref(false)
const responsableToDelete = ref<{ id: number; nombre: string } | null>(null)

// Computed
const responsablesFiltrados = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  
  if (!query) return allResponsables.value
  
  return allResponsables.value.filter(r => 
    r.nombreUsuario?.toLowerCase().includes(query) ||
    r.rol?.toLowerCase().includes(query) ||
    r.email?.toLowerCase().includes(query)
  )
})

const modalTitle = computed(() => {
  return editingResponsable.value ? editingResponsable.value.nombreUsuario : 'Nuevo Responsable'
})

const showPasswordField = computed(() => {
  return !editingResponsable.value
})

// Verificar permisos
const verificarPermisos = () => {
  if (!isAdmin()) {
    router.push('/principal')
    return false
  }
  return true
}

// Cargar responsables
const cargarResponsables = async () => {
  try {
    isLoading.value = true
    const responsables = await getUsuarios()
    allResponsables.value = responsables
    console.log('Responsables cargados:', responsables)
  } catch (error) {
    console.error('Error al cargar responsables:', error)
    alert('Error al cargar la lista de responsables')
  } finally {
    isLoading.value = false
  }
}

// Abrir modal para añadir
const abrirModalAñadir = () => {
  editingResponsable.value = null
  formData.value = {
    nombreUsuario: '',
    rol: '',
    email: '',
    password: ''
  }
  showModalResponsable.value = true
}

// Editar responsable
const editarResponsable = async (idUsuario: number) => {
  try {
    const responsable = await getUsuarioById(idUsuario)
    editingResponsable.value = responsable
    formData.value = {
      nombreUsuario: responsable.nombreUsuario,
      rol: responsable.rol,
      email: responsable.email,
      password: ''
    }
    showModalResponsable.value = true
  } catch (error) {
    console.error('Error al cargar responsable:', error)
    alert('Error al cargar el responsable')
  }
}

// Guardar responsable
const guardarResponsable = async () => {
  try {
    if (!formData.value.nombreUsuario || !formData.value.rol || !formData.value.email) {
      alert('Por favor complete todos los campos obligatorios')
      return
    }
    
    if (!editingResponsable.value && !formData.value.password) {
      alert('La contraseña es obligatoria para nuevos usuarios')
      return
    }
    
    const datos: any = {
      nombreUsuario: formData.value.nombreUsuario.trim(),
      rol: formData.value.rol,
      email: formData.value.email.trim()
    }
    
    if (formData.value.password) {
      datos.password = formData.value.password
    }
    
    if (editingResponsable.value) {
      // Actualizar
      await actualizarUsuario(editingResponsable.value.idUsuario!, datos)
    } else {
      // Crear
      await crearUsuario(datos)
    }
    
    cerrarModalResponsable()
    await cargarResponsables()
  } catch (error) {
    console.error('Error al guardar responsable:', error)
    alert('Error al guardar el responsable')
  }
}

// Confirmar eliminación
const confirmarEliminar = (idUsuario: number, nombre: string) => {
  responsableToDelete.value = { id: idUsuario, nombre }
  showModalEliminar.value = true
}

// Eliminar responsable
const eliminarResponsableConfirmar = async () => {
  if (!responsableToDelete.value) return
  
  try {
    await eliminarUsuario(responsableToDelete.value.id)
    cerrarModalEliminar()
    await cargarResponsables()
  } catch (error) {
    console.error('Error al eliminar responsable:', error)
    alert('Error al eliminar el responsable')
  }
}

// Cerrar modales
const cerrarModalResponsable = () => {
  showModalResponsable.value = false
  editingResponsable.value = null
  formData.value = {
    nombreUsuario: '',
    rol: '',
    email: '',
    password: ''
  }
}

const cerrarModalEliminar = () => {
  showModalEliminar.value = false
  responsableToDelete.value = null
}

// Navegación
const goBack = () => {
  router.push('/perfil-admin')
}

// Cerrar modal con ESC
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (showModalResponsable.value) cerrarModalResponsable()
    if (showModalEliminar.value) cerrarModalEliminar()
  }
}

// Inicializar
onMounted(() => {
  if (!verificarPermisos()) return
  cargarResponsables()
  document.addEventListener('keydown', onKeyDown)
})

// Cleanup
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="lista-responsables-view">
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

      <h1>LISTA DE RESPONSABLES</h1>

      <!-- Búsqueda -->
      <div class="search-container">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Buscar por nombre"
          autocomplete="off"
        >
      </div>

      <!-- Botón añadir -->
      <button class="btn-add-responsable" @click="abrirModalAñadir">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Añadir responsable
      </button>

      <!-- Lista -->
      <div v-if="isLoading" class="loading">Cargando...</div>
      
      <div v-else-if="responsablesFiltrados.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <p>No hay responsables registrados</p>
      </div>
      
      <div v-else class="responsables-list">
        <div 
          v-for="responsable in responsablesFiltrados" 
          :key="responsable.idUsuario"
          class="responsable-item"
        >
          <div class="responsable-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="responsable-info">
            <div class="responsable-name">{{ responsable.nombreUsuario }}</div>
            <div class="responsable-role">{{ responsable.rol }}</div>
          </div>
          <div class="responsable-actions">
            <button class="btn-icon edit" @click="editarResponsable(responsable.idUsuario!)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" @click="confirmarEliminar(responsable.idUsuario!, responsable.nombreUsuario)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Responsable -->
    <div 
      v-if="showModalResponsable"
      class="modal-overlay" 
      @click.self="cerrarModalResponsable"
    >
      <div class="modal-content modal-large">
        <div class="modal-header">
          <div class="avatar-modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 class="modal-title">{{ modalTitle }}</h2>
        </div>

        <form @submit.prevent="guardarResponsable">
          <div class="form-group">
            <label for="inputNombreUsuario">Nombre de usuario</label>
            <input 
              type="text" 
              id="inputNombreUsuario"
              v-model="formData.nombreUsuario"
              class="form-input"
              placeholder="Ingrese nombre de usuario" 
              required
            >
          </div>

          <div class="form-group">
            <label for="inputRol">Rol</label>
            <select 
              id="inputRol"
              v-model="formData.rol"
              class="form-input" 
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Operador">Operador</option>
              <option value="Técnico de emergencias">Técnico de emergencias</option>
            </select>
          </div>

          <div class="form-group">
            <label for="inputEmail">Email</label>
            <input 
              type="email" 
              id="inputEmail"
              v-model="formData.email"
              class="form-input" 
              placeholder="ejemplo@correo.com" 
              required
            >
          </div>

          <div v-if="showPasswordField" class="form-group">
            <label for="inputPassword">Contraseña</label>
            <input 
              type="password" 
              id="inputPassword"
              v-model="formData.password"
              class="form-input" 
              placeholder="Ingrese contraseña"
              :required="!editingResponsable"
            >
          </div>

          <div class="modal-buttons">
            <button type="button" class="btn-cancelar" @click="cerrarModalResponsable">
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div 
      v-if="showModalEliminar"
      class="modal-overlay" 
      @click.self="cerrarModalEliminar"
    >
      <div class="modal-content">
        <h2 class="modal-title">
          ¿ESTÁS SEGURO QUE QUIERES<br>ELIMINAR A <span>{{ responsableToDelete?.nombre }}</span>?
        </h2>
        <p class="modal-subtitle">Esta acción no se puede deshacer</p>
        <div class="modal-buttons">
          <button class="btn-cancelar" @click="cerrarModalEliminar">
            Cancelar
          </button>
          <button class="btn-eliminar" @click="eliminarResponsableConfirmar">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.lista-responsables-view {
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

// Search
.search-container {
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

.search-container input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: $primary-red;
  }
}

// Botón añadir
.btn-add-responsable {
  @include button-base;
  width: 100%;
  padding: 14px 20px;
  background-color: $primary-red;
  color: $white;
  border-radius: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background-color: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
}

// Loading
.loading {
  text-align: center;
  padding: 40px 20px;
  color: $text-gray;
}

// Empty state
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  
  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    opacity: 0.3;
  }
  
  p {
    font-size: 16px;
  }
}

// Lista de responsables
.responsables-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.responsable-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.responsable-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }
}

.responsable-info {
  flex: 1;
}

.responsable-name {
  font-size: 16px;
  font-weight: $font-semibold;
  color: $text-dark;
  margin-bottom: 4px;
}

.responsable-role {
  font-size: 14px;
  color: $text-gray;
}

.responsable-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  background-color: $white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &.edit {
    color: $primary-red;
    
    &:hover {
      background-color: #ffe5e5;
    }
  }
  
  &.delete {
    color: #e74c3c;
    
    &:hover {
      background-color: #ffebeb;
    }
  }
}

// Modal
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $modal-overlay-bg;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: $white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  @include slideIn;
  max-height: 90vh;
  overflow-y: auto;
  
  &.modal-large {
    max-width: 600px;
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-modal {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 40px;
    height: 40px;
    color: #666;
  }
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  color: $text-dark;
  letter-spacing: 0.5px;
}

.modal-subtitle {
  text-align: center;
  color: $text-gray;
  font-size: 14px;
  margin-top: 10px;
}

// Form
.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: $font-semibold;
    color: $text-dark;
    margin-bottom: 8px;
  }
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: $primary-red;
  }
  
  &::placeholder {
    color: #999;
  }
}

// Botones del modal
.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn-cancelar,
.btn-confirmar,
.btn-eliminar {
  padding: 15px 35px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: $font-semibold;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.btn-cancelar {
  background-color: $primary-red;
  color: $white;
  border: none;
  box-shadow: 0 2px 8px rgba(139, 46, 46, 0.2);
  
  &:hover {
    background-color: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-confirmar,
.btn-eliminar {
  @include button-secondary;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
  
  &:active {
    transform: translateY(0);
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

  .responsable-name {
    font-size: 15px;
  }

  .responsable-role {
    font-size: 13px;
  }

  .modal-content {
    padding: 30px 20px;
    width: 95%;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancelar,
  .btn-confirmar,
  .btn-eliminar {
    width: 100%;
    min-width: unset;
  }
}
</style>
