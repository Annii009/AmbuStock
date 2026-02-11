//para gestión de tema claro/oscuro

import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDarkTheme = ref(false)

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDarkTheme.value = true
      document.body.classList.add('dark-theme')
    }
  }

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    
    if (isDarkTheme.value) {
      document.body.classList.add('dark-theme')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDarkTheme,
    toggleTheme
  }
}
