<template>
  <div id="app">
    <div v-if="!isAuthenticated" class="login-container">
      <div class="login-box">
        <div class="login-header">
          <img
            src="https://play-lh.googleusercontent.com/ZVuzhksT-SVMPRRG_QiAurxc0Ex800HkKPRH6uFMW-akgB1Rmp11v3SuR67LklNlCA"
            alt="IMDb Logo"
            class="logo"
          />
          <h2>Inicia sesión</h2>
        </div>
        <form @submit.prevent="login" class="login-form">
          <input v-model="username" placeholder="Usuario" class="input-field" required />
          <input
            type="password"
            v-model="password"
            placeholder="Contraseña"
            class="input-field"
            required
          />
          <button type="submit" class="login-button">Ingresar</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      username: '',
      password: '',
      requestToken: '',
      sessionId: '',
      errorMessage: '',
      isAuthenticated: false
    }
  },
  mounted() {
    console.log('App component mounted')
    this.checkAuthentication()
  },
  methods: {
    async checkAuthentication() {
      this.isAuthenticated = !!localStorage.getItem('sessionId')
    },
    async getRequestToken() {
      const response = await axios.get('https://api.themoviedb.org/3/authentication/token/new', {
        params: {
          api_key: 'b27d7edb3072175fb8681650517059f7'
        }
      })
      this.requestToken = response.data.request_token
    },
    async login() {
      try {
        await this.getRequestToken()
        const response = await axios.post(
          'https://api.themoviedb.org/3/authentication/token/validate_with_login',
          {
            username: this.username,
            password: this.password,
            request_token: this.requestToken
          },
          {
            params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
          }
        )
        const sessionResponse = await axios.post(
          'https://api.themoviedb.org/3/authentication/session/new',
          { request_token: response.data.request_token },
          { params: { api_key: 'b27d7edb3072175fb8681650517059f7' } }
        )
        this.sessionId = sessionResponse.data.session_id
        localStorage.setItem('sessionId', this.sessionId)
        this.isAuthenticated = true // Update authentication state

        this.$router.push('/home')
      } catch (error) {
        this.errorMessage = 'Usuario o contraseña incorrectos'
      }
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #1e2a38;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #34495e, #2c3e50);
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  max-width: 80px;
  margin-bottom: 15px;
}

h2 {
  font-size: 26px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  padding: 15px;
  font-size: 18px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #2980b9;
  outline: none;
}

.login-button {
  padding: 15px;
  background-color: #2980b9;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #1e6fa0;
}

.error-message {
  color: red;
  font-size: 16px;
  margin-top: 10px;
}
</style>
