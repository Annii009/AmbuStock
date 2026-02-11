<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { logout, getUsuario } from '@/services/api'

const router = useRouter()
const { isDarkTheme, toggleTheme } = useTheme()

// Estado del menú y modal
const isMenuOpen = ref(false)
const isLogoutModalOpen = ref(false)

// Logo dinámico según tema
const logoSrc = computed(() => {
  return isDarkTheme.value ? '/logo2Blanco.png' : '/logo2Rojo.png'
})

// Iconos de tema
const themeIcon = computed(() => {
  return isDarkTheme.value ? 'moon' : 'sun'
})

const themeText = computed(() => {
  return isDarkTheme.value ? 'Tema oscuro' : 'Tema claro'
})

// Toggle menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Navegación
const goToRevision = () => {
  router.push('/seleccion-ambulancia')
}

const goToMaterialGastado = () => {
  router.push('/material-gastado')
}

const goToPerfil = () => {
  closeMenu()
  const usuario = getUsuario()
  
  if (usuario && usuario.rol === 'Administrador') {
    router.push('/perfil-admin')
  } else {
    router.push('/perfil')
  }
}

// Logout
const showLogoutModal = () => {
  closeMenu()
  isLogoutModalOpen.value = true
}

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false
}

const confirmLogout = () => {
  logout()
  router.push('/')
}

// Cerrar modal con ESC
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isLogoutModalOpen.value) {
    closeLogoutModal()
  }
}

// Click fuera del modal
const handleModalClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
    closeLogoutModal()
  }
}
</script>

<template>
  <div class="principal-view">
    <!-- Menú hamburguesa -->
    <div class="menu-container">
      <button class="menu-button" @click="toggleMenu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
      
      <div class="dropdown-menu" :class="{ show: isMenuOpen }">
        <div class="menu-item" @click="toggleTheme">
          <div class="theme-icon">
            <svg v-if="themeIcon === 'sun'" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
          <span>{{ themeText }}</span>
          <label class="toggle-switch">
            <input type="checkbox" :checked="isDarkTheme" @change="toggleTheme">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="menu-item" @click="goToPerfil">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Ver perfil</span>
        </div>
        
        <div class="menu-item menu-item-danger" @click="showLogoutModal">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Cerrar sesión</span>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container">
      <img :src="logoSrc" alt="AmbuStock Logo" class="logo">
      <h1>BIENVENIDO A AMBUSTOCK</h1>
      <p class="subtitle">Un servicio de revisión de ambulancias cómodo y sencillo</p>
      <button class="btn btn-primary" @click="goToRevision">Empezar revisión</button>
      <button class="btn btn-secondary" @click="goToMaterialGastado">Material gastado</button>
    </div>

    <!-- Modal de confirmación cerrar sesión -->
    <div 
      v-if="isLogoutModalOpen" 
      class="modal-overlay show"
      @click="handleModalClick"
      @keydown="handleKeydown"
    >
      <div class="modal-content">
        <h2 class="modal-title">
          ¿ESTAS SEGURO QUE QUIERES<br>CERRAR SESIÓN?
        </h2>
        <div class="modal-buttons">
          <button class="btn-cancelar" @click="closeLogoutModal">Cancelar</button>
          <button class="btn-confirmar" @click="confirmLogout">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.principal-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  transition: background-color 0.4s ease, color 0.4s ease;
}

// Menú hamburguesa
.menu-container {
  position: absolute;
  top: 20px;
  right: 20px;
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
  
  .dot {
    width: $menu-dot-size;
    height: $menu-dot-size;
    background-color: #333;
    border-radius: 50%;
    transition: background-color 0.4s ease;
  }
}

:global(body.dark-theme) .menu-button .dot {
  background-color: $white;
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: $dropdown-bg;
  border-radius: 12px;
  box-shadow: $dropdown-shadow;
  min-width: 220px;
  padding: 8px 0;
  display: none;
  z-index: 999;
  transition: background-color 0.4s ease, box-shadow 0.4s ease;
  
  &.show {
    display: block;
    @include fadeIn;
  }
}

:global(body.dark-theme) .dropdown-menu {
  background-color: $dark-card-bg;
  box-shadow: $dropdown-shadow-dark;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  span {
    flex: 1;
    font-size: 14px;
  }
}

:global(body.dark-theme) .menu-item:hover {
  background-color: $dark-hover-bg;
}

.menu-item-danger {
  color: $error-text;
  
  &:hover {
    background-color: #ffebee;
  }
}

:global(body.dark-theme) .menu-item-danger:hover {
  background-color: #3d2020;
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

// Toggle switch
.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.4s;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: $white;
    border-radius: 50%;
    transition: 0.4s;
  }
}

input:checked + .slider {
  background-color: $primary-red;
  
  &:before {
    transform: translateX(20px);
  }
}

// Contenido principal
.container {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.logo {
  width: 200px;
  margin-bottom: 40px;
  transition: opacity 0.3s ease;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  color: $text-dark;
  transition: color 0.4s ease;
}

:global(body.dark-theme) h1 {
  color: $dark-text;
}

.subtitle {
  font-size: 14px;
  color: $text-gray;
  margin-bottom: 40px;
  line-height: 1.5;
  transition: color 0.4s ease;
}

:global(body.dark-theme) .subtitle {
  color: $dark-text-secondary;
}

.btn {
  @include button-base;
  width: 100%;
  padding: 16px;
  font-size: 16px;
  margin-bottom: 16px;
}

.btn-primary {
  background-color: $primary-red;
  color: $white;
  
  &:hover:not(:disabled) {
    background-color: $primary-red-hover;
  }
}

.btn-secondary {
  @include button-secondary;
}

// Modal
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $modal-overlay-bg;
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  @include fadeIn;
  
  &.show {
    display: flex;
  }
}

.modal-content {
  background-color: $modal-bg;
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  box-shadow: $modal-shadow;
  @include slideIn;
}

:global(body.dark-theme) .modal-content {
  background-color: $dark-card-bg;
  color: $dark-text;
}

.modal-title {
  font-size: 20px;
  font-weight: $font-bold;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.4;
  color: $text-dark;
}

:global(body.dark-theme) .modal-title {
  color: $dark-text;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-cancelar,
.btn-confirmar {
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
  
  &:active {
    transform: translateY(0);
  }
}

.btn-cancelar {
  background-color: $primary-red;
  color: $white;
  
  &:hover {
    background-color: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
}

.btn-confirmar {
  background-color: transparent;
  color: $primary-red;
  border: 2px solid $primary-red;
  
  &:hover {
    background-color: $primary-red;
    color: $white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
}

:global(body.dark-theme) .btn-confirmar {
  color: $dark-red;
  border-color: $dark-red;
  
  &:hover {
    background-color: $dark-red;
    color: $white;
  }
}

// Responsive
@media (max-width: 480px) {
  .container {
    padding: 20px;
  }
  
  .logo {
    width: 250px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .modal-content {
    padding: 30px 20px;
    width: 85%;
  }
  
  .modal-title {
    font-size: 18px;
    margin-bottom: 25px;
  }
  
  .modal-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-cancelar,
  .btn-confirmar {
    width: 100%;
    min-width: unset;
  }
}
</style>
