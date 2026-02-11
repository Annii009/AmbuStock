<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="welcome-screen">
    <div class="container">
      <div class="welcome-image">
        <img src="/portada.png" alt="Ambulancia" />
      </div>
      
      <div class="welcome-content">
        <h1>¡BIENVENIDO A AMBUSTOCK!</h1>
        <p>
          Un servicio de revisión de ambulancias cómodo y sencillo. 
          En un click puedes tener todo a tu alcance.
        </p>
        
        <button class="btn btn-primary" @click="goToLogin">
          Empezar
        </button>
        
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

.welcome-screen {
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

.welcome-image {
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: -25px;
  position: relative;
  z-index: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
  }
}

.welcome-content {
  @include glassmorphism;
  border-radius: $border-radius-card $border-radius-card 0 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 30px 30px;
  margin-top: auto;
  position: relative;
  z-index: 1;
  
  h1 {
    font-family: $font-display;
    font-size: 22px;
    font-weight: $font-regular;
    color: $text-dark;
    text-align: left;
    margin: 0 0 20px 0;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }
  
  p {
    font-family: $font-primary;
    font-size: 14px;
    font-weight: $font-light;
    color: $text-gray;
    text-align: left;
    line-height: 1.65;
    margin: 0 0 40px 0;
  }
}

.btn {
  @include button-base;
  width: 100%;
  height: 56px;
  margin: 0 0 30px 0;
}

.btn-primary {
  background: $primary-red;
  color: $white;
  box-shadow: $shadow-button;
  
  &:hover {
    background: $primary-red-hover;
    transform: translateY(-2px);
    box-shadow: $shadow-button-hover;
  }
}

.footer-link {
  font-family: $font-primary;
  text-align: center;
  font-size: 13px;
  font-weight: $font-light;
  color: $text-gray;
  padding: 0 0 25px 0;
  margin-top: auto;
  
  a {
    color: $link-red;
    text-decoration: none;
    font-weight: $font-bold;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// === RESPONSIVE DESIGN ===

@include mobile-small {
  .welcome-image {
    height: 55vh;
    margin-bottom: -30px;
  }
  
  .welcome-content {
    padding: 30px 25px 25px;
    
    h1 {
      font-size: 20px;
      margin-bottom: 14px;
    }
    
    p {
      font-size: 13px;
      line-height: 1.55;
      margin-bottom: 28px;
    }
  }
  
  .btn {
    height: 52px;
    font-size: 16px;
    margin-bottom: 22px;
  }
  
  .footer-link {
    font-size: 12px;
    padding-bottom: 18px;
  }
}

@include mobile-standard {
  .welcome-image {
    height: 58vh;
    margin-bottom: -30px;
  }
  
  .welcome-content {
    padding: 35px 28px 28px;
  }
}

@include mobile-tall {
  .welcome-image {
    height: 60vh;
    margin-bottom: -35px;
  }
  
  .welcome-content {
    padding: 40px 30px 30px;
    
    h1 {
      font-size: 24px;
      margin-bottom: 22px;
    }
    
    p {
      font-size: 15px;
      margin-bottom: 45px;
    }
  }
  
  .btn {
    height: 58px;
    font-size: 18px;
    margin-bottom: 35px;
  }
  
  .footer-link {
    padding-bottom: 30px;
  }
}

@include mobile-tiny {
  .welcome-image {
    height: 52vh;
    margin-bottom: -25px;
  }
  
  .welcome-content {
    padding: 28px 22px 20px;
    
    h1 {
      font-size: 19px;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 12.5px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
  }
  
  .btn {
    height: 50px;
    font-size: 15px;
    margin-bottom: 20px;
  }
  
  .footer-link {
    font-size: 11px;
    padding-bottom: 16px;
  }
}

@include tablet-up {
  .welcome-image {
    height: 52vh;
  }
  
  .welcome-content {
    padding: 45px 35px 35px;
    
    h1 {
      font-size: 24px;
      margin-bottom: 22px;
    }
    
    p {
      font-size: 15px;
      margin-bottom: 45px;
    }
  }
  
  .btn {
    height: 58px;
    font-size: 18px;
    margin-bottom: 35px;
  }
  
  .footer-link {
    padding-bottom: 30px;
  }
}
</style>
