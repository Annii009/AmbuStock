<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getUsuario,
  isAdmin,
  getNombreUsuario,
  logout
} from '@/services/api'

const router = useRouter()

// Estado
const userName = ref('ADMIN')
const showModalCerrarSesion = ref(false)

// Verificar permisos de administrador
const verificarPermisos = () => {
  const usuario = getUsuario()
  
  if (!usuario) {
    router.push('/login')
    return false
  }
  
  if (!isAdmin()) {
    alert('No tienes permisos para acceder a esta página')
    router.push('/perfil')
    return false
  }
  
  userName.value = getNombreUsuario()
  return true
}

// Navegación
const goBack = () => {
  router.push('/principal')
}

const irA = (ruta: string) => {
  router.push(ruta)
}

// Modal cerrar sesión
const abrirModalCerrarSesion = () => {
  showModalCerrarSesion.value = true
}

const cancelarCerrarSesion = () => {
  showModalCerrarSesion.value = false
}

const confirmarCerrarSesion = () => {
  logout()
  router.push('/login')
}

// Cerrar modal con ESC
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showModalCerrarSesion.value) {
    showModalCerrarSesion.value = false
  }
}

// Inicializar
onMounted(() => {
  verificarPermisos()
  document.addEventListener('keydown', onKeyDown)
})

// Cleanup
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="perfil-admin-view">
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

      <!-- Profile header -->
      <div class="profile-header">
        <div class="avatar">
          <img src="/perfil.png" alt="Perfil" class="avatar-img">
        </div>
        <h1>{{ userName }}</h1>
        <p class="user-role">Administrador del material, ambulancias y personal</p>
      </div>

      <!-- Operaciones -->
      <div class="section">
        <h2 class="section-title">Operaciones</h2>
        <div class="menu-list">
          <a class="menu-item" @click="irA('/lista-responsables')">
            <div class="menu-icon" style="background-color: #ffe5e5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B2E2E" stroke-width="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </div>
            <span class="menu-text">Editar lista de Responsables</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>

          <a class="menu-item" @click="irA('/ver-revisiones')">
            <div class="menu-icon" style="background-color: #ffe5e5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B2E2E" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span class="menu-text">Ver revisiones</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>

          <a class="menu-item" @click="irA('/historial-reposiciones')">
            <div class="menu-icon" style="background-color: #ffe5e5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B2E2E" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <span class="menu-text">Reposiciones</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>

          <a class="menu-item" @click="irA('/editar-ambulancias')">
            <div class="menu-icon" style="background-color: #ffe5e5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8B2E2E" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <span class="menu-text">Editar ambulancias</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>
      </div>

      <!-- Sistema y ayuda -->
      <div class="section">
        <h2 class="section-title">Sistema y ayuda</h2>
        <div class="menu-list">
          <a class="menu-item" @click="irA('/ajustes')">
            <div class="menu-icon" style="background-color: #f0f0f0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243M9.879 9.879L5.636 5.636m12.728 0l-4.243 4.243m-6.364 6.364l-4.243 4.243"></path>
              </svg>
            </div>
            <span class="menu-text">Ajustes de la app</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>

          <a class="menu-item" @click="irA('/centro-ayuda')">
            <div class="menu-icon" style="background-color: #f0f0f0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <span class="menu-text">Centro de ayuda</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>

          <button class="menu-item" @click="abrirModalCerrarSesion">
            <div class="menu-icon" style="background-color: #ffe5e5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#E74C3C" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span class="menu-text" style="color: #e74c3c">Cerrar sesión</span>
            <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>AmbuStock v2.4.0</p>
        <p>2026 AMBUSTOCK SYSTEMS S.L</p>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div 
      v-if="showModalCerrarSesion"
      class="modal-overlay" 
      @click.self="cancelarCerrarSesion"
    >
      <div class="modal-content">
        <h2 class="modal-title">¿ESTAS SEGURO QUE QUIERES<br>CERRAR SESIÓN?</h2>
        <div class="modal-buttons">
          <button class="btn-cancelar" @click="cancelarCerrarSesion">Cancelar</button>
          <button class="btn-confirmar" @click="confirmarCerrarSesion">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.perfil-admin-view {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: $white;
  min-height: 100vh;
  padding-bottom: 40px;
}

// Header
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: $white;
  border-bottom: 1px solid #f0f0f0;
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

.logo {
  width: 50px;
  height: 50px;
}

// Profile header
.profile-header {
  text-align: center;
  padding: 40px 20px 30px;
  background: $white;
}

.avatar {
  width: $avatar-size;
  height: $avatar-size;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  background: $avatar-bg;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  color: $text-dark;
  margin-bottom: 8px;
  text-transform: uppercase;
  min-height: 32px;
}

.user-role {
  font-size: 15px;
  color: $text-gray;
}

// Sections
.section {
  margin: 20px 0;
  padding: 0 20px;
}

.section-title {
  font-size: 16px;
  font-weight: $font-semibold;
  color: $text-dark;
  margin-bottom: 12px;
}

// Menu list
.menu-list {
  background: $white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid $menu-item-border;
  text-decoration: none;
  color: $text-dark;
  cursor: pointer;
  transition: background-color 0.2s;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
  text-align: left;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: $menu-item-hover;
  }
  
  &:active {
    background-color: $menu-item-active;
  }
}

.menu-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  
  svg {
    width: 22px;
    height: 22px;
  }
}

.menu-text {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.menu-arrow {
  width: 20px;
  height: 20px;
  color: #999;
  flex-shrink: 0;
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
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  @include slideIn;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.3;
  color: $text-dark;
  letter-spacing: 0.5px;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cancelar {
  background-color: $primary-red;
  color: $white;
  border: none;
  padding: 15px 35px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
  
  &:hover {
    background-color: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-confirmar {
  @include button-secondary;
  padding: 15px 35px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  min-width: 140px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 46, 46, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Footer
.footer {
  text-align: center;
  padding: 30px 20px 20px;
  color: $footer-text;
  font-size: 13px;
  
  p {
    margin: 4px 0;
  }
}

// Responsive
@media (max-width: 480px) {
  .container {
    padding-bottom: 30px;
  }

  h1 {
    font-size: 22px;
    min-height: 28px;
  }

  .avatar {
    width: $avatar-size-mobile;
    height: $avatar-size-mobile;
  }

  .menu-text {
    font-size: 15px;
  }

  .modal-content {
    padding: 30px 20px;
    width: 85%;
  }

  .modal-title {
    font-size: 20px;
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
