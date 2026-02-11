<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { saveNombreResponsable } from '@/services/api'

const router = useRouter()

// Estado
const nombreResponsable = ref('')

// Computed
const isContinueDisabled = computed(() => nombreResponsable.value.trim().length < 2)

// Navegación
const goBack = () => {
  router.push('/tipo-servicio')
}

const continuar = () => {
  const nombre = nombreResponsable.value.trim()
  
  if (nombre.length >= 2) {
    saveNombreResponsable(nombre)
    router.push('/revision')
  }
}
</script>

<template>
  <div class="nombre-responsable">
    <div class="container">
      <div class="header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <img src="/logo1Rojo.png" alt="AmbuStock" class="logo-small">
      </div>

      <h1>NOMBRE DEL RESPONSABLE</h1>

      <div class="progress-container">
        <div class="progress-bar completed"></div>
        <div class="progress-bar completed"></div>
        <div class="progress-bar active"></div>
      </div>

      <div class="form-content">
        <label for="responsable">Responsable del servicio</label>
        <input 
          type="text" 
          id="responsable" 
          v-model="nombreResponsable"
          class="custom-input" 
          placeholder="Nombre del responsable del servicio"
          autocomplete="off"
          @keyup.enter="continuar"
        >
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

.nombre-responsable {
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

.custom-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 1px solid $select-border;
  border-radius: 8px;
  background-color: $input-bg;
  color: $text-dark;
  transition: all 0.3s;
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    outline: none;
    border-color: $primary-red;
    box-shadow: 0 0 0 3px rgba(137, 29, 26, 0.08);
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
