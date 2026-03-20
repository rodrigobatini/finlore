import { ref, watchEffect } from 'vue'

const getDefaultTheme = () => {
  const savedTheme = localStorage.getItem('finlore-theme')
  if (savedTheme === 'dark') return true
  if (savedTheme === 'light') return false
  return true
}

const isDark = ref(getDefaultTheme())

export const useDark = () => {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watchEffect(() => {
    if (isDark.value) {
      document.documentElement.style.colorScheme = 'dark'
      document.documentElement.classList.add('theme-dark')
      document.documentElement.classList.remove('theme-light')
      localStorage.setItem('finlore-theme', 'dark')
    } else {
      document.documentElement.style.colorScheme = 'light'
      document.documentElement.classList.add('theme-light')
      document.documentElement.classList.remove('theme-dark')
      localStorage.setItem('finlore-theme', 'light')
    }
  })

  return { isDark, toggleTheme }
}
