<template>
  <div class="login-container">
    <div class="login-card card">
      <h2>Giriş Yap</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="form-control"
            placeholder="Email adresinizi girin"
          />
        </div>

        <div class="form-group">
          <label for="password">Şifre</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
            placeholder="Şifrenizi girin"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
          Giriş Yap
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api';
import { useStore } from 'vuex'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()
    
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false);


    const handleLogin = async () => {
      isLoading.value = true
      try {
        const success = await store.dispatch('auth/login', {
          email: email.value,
          password: password.value,
        })

        if (success) {
          router.push('/') 
        } else {
          error.value = 'Invalid email or password.'
        }
      } catch (err) {
        error.value = 'An error occurred during login.'
      } finally {
        isLoading.value = false
      }
    };

    return {
      email,
      password,
      error,
      handleLogin,
      isLoading,
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-image: url('../assets/kluimage.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(0.9); 
}



.login-card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  height: 400px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #444;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  outline: none;

  background: linear-gradient(135deg, #ccc, #3498db); 
  color: #000;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #ccc, #3498db); 
  color: #000;
  color: #fff;
  border: none;
  padding: 0.75rem;
  width: 100%;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.error-message {
  color: #f44336;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
