<script setup lang="ts">
import { useRouter } from 'vue-router'
import { limpiarDatosRevision } from '@/services/api'
import { onMounted } from 'vue'

const router = useRouter()

// Navegación
const nuevaRevision = () => {
  router.push('/principal')
}

const materialGastado = () => {
  router.push('/material-gastado')
}

// Limpiar datos al montar
onMounted(() => {
  limpiarDatosRevision()
})
</script>

<template>
  <div class="mision-cumplida-view">
    <div class="container">
      <div class="success-icon">
        <svg viewBox="0 0 100 100" class="checkmark">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#4CAF50" stroke-width="4" opacity="0.2"/>
          <circle cx="50" cy="50" r="35" fill="none" stroke="#4CAF50" stroke-width="4"/>
          <path fill="none" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" 
                d="M30 50 L43 63 L70 35" class="check"/>
        </svg>
      </div>

      <h1>¡MISIÓN CUMPLIDA!</h1>
      
      <p class="message">
        Tu revisión es fundamental para mantener nuestras ambulancias listas.<br>
        Puedes hacer una nueva revisión o ir al material gastado en el servicio.
      </p>

      <div class="buttons">
        <button class="btn-primary" @click="nuevaRevision">
          Nueva revisión
        </button>
        <button class="btn-secondary" @click="materialGastado">
          Material gastado en el servicio
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.mision-cumplida-view {
  background: linear-gradient(135deg, $success-gradient-start 0%, $success-gradient-end 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: $white;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

// Success icon with animation
.success-icon {
  margin: 0 auto 30px;
  width: 120px;
  height: 120px;
}

.checkmark {
  width: 100%;
  height: 100%;
  animation: scaleIn 0.5s ease-out;
}

.check {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: drawCheck 0.6s ease-out 0.3s forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

// Title
h1 {
  font-size: 28px;
  font-weight: 800;
  color: $text-dark;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// Message
.message {
  font-size: 15px;
  line-height: 1.6;
  color: $text-gray;
  margin-bottom: 40px;
}

// Buttons
.buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

button {
  @include button-base;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  width: 100%;
  
  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background-color: $primary-red;
  color: $white;
  
  &:hover {
    background-color: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(139, 46, 46, 0.3);
  }
}

.btn-secondary {
  @include button-secondary;
  border-width: 2px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(139, 46, 46, 0.2);
  }
}

// Responsive
@media (max-width: 480px) {
  .container {
    padding: 30px 20px;
  }

  h1 {
    font-size: 24px;
  }

  .message {
    font-size: 14px;
  }

  button {
    padding: 14px 20px;
    font-size: 15px;
  }
}
</style>
