<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, saveAuthData, ApiError } from '@/services/api'
import { useValidation } from '@/composables/useValidation'

const router = useRouter()
const { validateEmail, validateRequired } = useValidation()

// Estado del formulario
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Función para mostrar/ocultar error
const showError = (message: string) => {
  errorMessage.value = message
}

const hideError = () => {
  errorMessage.value = ''
}

// Submit del formulario
const handleSubmit = async () => {
  hideError()
  
  // Validaciones
  if (!validateRequired(email.value)) {
    showError('Por favor, introduce tu email')
    return
  }
  
  if (!validateEmail(email.value)) {
    showError('Por favor, introduce un email válido')
    return
  }
  
  if (!validateRequired(password.value)) {
    showError('Por favor, introduce tu contraseña')
    return
  }
  
  // Login
  isLoading.value = true
  
  try {
    const data = await loginUser(email.value, password.value)
    saveAuthData(data)
    console.log('Login exitoso')
    
    // Redirigir a principal
    router.push('/principal')
  } catch (error) {
    if (error instanceof ApiError) {
      showError(error.message)
    } else {
      showError('Error inesperado. Por favor, intenta de nuevo.')
    }
  } finally {
    isLoading.value = false
  }
}

// Navegación a registro
const goToRegister = () => {
  router.push('/register')
}

// Social login (placeholder)
const handleSocialLogin = (provider: string) => {
  console.log(`${provider} login clicked`)
  alert(`${provider} login no implementado aún`)
}
</script>

<template>
  <div class="auth-screen">
    <div class="container">
      <div class="auth-header">
        <h1>¡BIENVENIDO DE NUEVO!</h1>
        <img src="/logo1Rojo.png" alt="AmbuStock Logo" class="logo" />
      </div>

      <div class="auth-content">
        <h2 class="auth-title">INICIAR SESIÓN</h2>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="loginEmail">Email</label>
            <input 
              v-model="email"
              type="email" 
              id="loginEmail" 
              placeholder="adamsmith@gmail.com"
              :disabled="isLoading"
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="loginPassword">Password</label>
            <input 
              v-model="password"
              type="password" 
              id="loginPassword" 
              placeholder="••••••••••••"
              :disabled="isLoading"
              autocomplete="current-password"
            />
          </div>

          <div v-if="errorMessage" class="error-message show">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            Siguiente
          </button>
        </form>

        <div class="social-login">
          <button 
            class="social-btn google-btn" 
            type="button"
            @click="handleSocialLogin('Google')"
            :disabled="isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="26" height="26">
              <path fill="#FFF" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
              <path fill="#FFF" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FFF" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#FFF" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
          </button>
          <button 
            class="social-btn apple-btn" 
            type="button"
            @click="handleSocialLogin('Apple')"
            :disabled="isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26">
              <path fill="#FFF" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08l.05-.05M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          </button>
          <button 
            class="social-btn facebook-btn" 
            type="button"
            @click="handleSocialLogin('Facebook')"
            :disabled="isLoading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="26" height="26">
              <path fill="#FFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"/>
            </svg>
          </button>
        </div>

        <div class="footer-link">
          <span>
            ¿Eres nuevo por aquí? 
            <a @click.prevent="goToRegister" href="#">Registrarse</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.auth-screen {
  background: $white;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.container {
  width: 100%;
  max-width: $max-width-mobile;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}

.auth-header {
  text-align: center;
  padding: 40px 30px 20px;
  flex-shrink: 0;
  
  h1 {
    font-family: $font-display;
    font-size: 18px;
    font-weight: $font-regular;
    color: $text-dark;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }
}

.logo {
  width: 240px;
  height: auto;
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))
          drop-shadow(0 6px 12px rgba(0, 0, 0, 0.1));
}

.auth-content {
  @include glassmorphism;
  border-radius: $border-radius-card $border-radius-card 0 0;
  box-shadow: 
    0 -8px 32px rgba(0, 0, 0, 0.1),
    0 -4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  padding: 40px 30px 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.auth-title {
  font-family: $font-display;
  font-size: 22px;
  font-weight: $font-regular;
  color: $text-dark;
  letter-spacing: 0.5px;
  margin-bottom: 25px;
  text-align: left;
}

.auth-form {
  margin-bottom: 35px;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    font-family: $font-primary;
    font-size: 14px;
    font-weight: $font-semibold;
    color: $text-dark;
    margin-bottom: 8px;
  }
  
  input {
    @include input-base;
  }
}

.error-message {
  display: none;
  background: $error-bg;
  border: 1px solid $error-border;
  color: $error-text;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-semibold;
  margin-bottom: 20px;
  
  &.show {
    display: block;
  }
}

.btn {
  @include button-base;
  @include loading-spinner;
  width: 100%;
  height: 56px;
  margin-top: 15px;
}

.btn-primary {
  background: $primary-red;
  color: $white;
  box-shadow: $shadow-button;
  
  &:hover:not(:disabled) {
    background: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: $shadow-button-hover;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(137, 29, 26, 0.25);
  }
  
  &:disabled {
    background: #CCCCCC;
    cursor: not-allowed;
    transform: none;
  }
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.social-btn {
  width: $social-btn-size;
  height: $social-btn-size;
  border-radius: 50%;
  border: none;
  background: $social-btn-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  
  &:hover:not(:disabled) {
    transform: scale(1.08);
    background: $social-btn-hover;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 26px;
    height: 26px;
  }
}

.footer-link {
  text-align: center;
  font-family: $font-primary;
  font-size: 13px;
  font-weight: $font-regular;
  color: $text-gray;
  margin-top: auto;
  padding-top: 30px;
  
  a {
    color: $link-red;
    text-decoration: none;
    font-weight: $font-bold;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
    
    &:focus-visible {
      outline: 2px solid $link-red;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
}

// === RESPONSIVE ===

@include height-small {
  .auth-header {
    padding: 30px 25px 15px;
    
    h1 {
      font-size: 16px;
      margin-bottom: 25px;
    }
  }
  
  .logo {
    width: 200px;
  }
  
  .auth-content {
    padding: 35px 25px 25px;
  }
  
  .auth-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 16px;
    
    input {
      height: $input-height-small;
    }
  }
  
  .btn {
    height: 52px;
    font-size: 16px;
  }
  
  .social-login {
    margin: 25px 0;
    gap: 15px;
  }
  
  .social-btn {
    width: $social-btn-size-small;
    height: $social-btn-size-small;
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
}

@include height-large {
  .auth-header {
    padding: 50px 35px 25px;
    
    h1 {
      font-size: 20px;
      margin-bottom: 35px;
    }
  }
  
  .logo {
    width: 260px;
  }
  
  .auth-content {
    padding: 45px 35px 35px;
  }
  
  .auth-title {
    font-size: 24px;
    margin-bottom: 30px;
  }
  
  .form-group input {
    height: $input-height-large;
    font-size: 16px;
  }
  
  .btn {
    height: 60px;
    font-size: 18px;
  }
  
  .social-login {
    margin: 35px 0;
  }
}
</style>
