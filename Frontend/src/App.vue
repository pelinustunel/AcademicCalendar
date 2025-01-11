<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img src="./assets/kluLogo.jpg" alt="KLU Logo" />
        </router-link>
      </div>
      
      <div class="navbar-end">
        <router-link to="/login" v-if="!isLoggedIn" class="navbar-item">Login</router-link>
        <a @click="handleLogout" v-else class="navbar-item">Logout</a>
      </div>
    </nav>
    
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoggedIn = computed(() => store.state.auth.isLoggedIn)

    const handleLogout = () => {
      store.dispatch('auth/logout') 
      router.push('/login') 
    }

    return {
      isLoggedIn,
      handleLogout,
    }
  }
}
</script>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f7fa;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.navbar {
  padding: 1rem 2rem; 
  background: linear-gradient(135deg, #ccc, #3498db); 
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  height: 120px; 
}

.navbar a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  transition: color 0.3s ease;
}


.navbar .logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar .menu {
  display: flex;
  gap: 1.5rem;
}



.navbar-item {
  color: white;
  text-decoration: none;
  margin-left: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}
.navbar-end .navbar-item {
  font-size: 1rem;
  font-weight: bold;
  color: White;
  border-radius: 8px; 
  background: linear-gradient(135deg, #ccc, #3498db); 
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  width: 200px;
  height: 50px;
}
.navbar-end .navbar-item:hover {
  background: linear-gradient(135deg, #ccc, #3498db); 
  transform: scale(1.05); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  margin-left: 130px;
}

.main-content {
  min-height: calc(100vh - 34px);
}

.navbar-end .navbar-item:active {
  transform: scale(0.95);
  box-shadow: none;
}
img {
      width: 30%; 
      height: auto;
    }

    .navbar .navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem; 
}


@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .navbar-brand h1 {
    font-size: 1.2rem;
  }

  .navbar-item {
    margin-left: 1rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
