<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="login" class="login-form">
        <input v-model="username" placeholder="Username" class="input-field" required />
        <input type="password" v-model="password" placeholder="Password" class="input-field" required />
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MovieLogin',
  created() {
    console.log('componente login creado');
  },
  mounted() {
    console.log('componente login montado');
  },

  data() {
    return {
      username: '',
      password: '',
      requestToken: '',
      sessionId: '',
    };
  },
  methods: {
    async getRequestToken() {
      const response = await axios.get('https://api.themoviedb.org/3/authentication/token/new', {
        params: {
          api_key: 'b27d7edb3072175fb8681650517059f7',
        },
      });
      this.requestToken = response.data.request_token;
    },
    async login() {
      try {
        await this.getRequestToken();
        const response = await axios.post(
          'https://api.themoviedb.org/3/authentication/token/validate_with_login',
          {
            username: this.username,
            password: this.password,
            request_token: this.requestToken,
          },
          {
            params: { api_key: 'b27d7edb3072175fb8681650517059f7' },
          }
        );
        const sessionResponse = await axios.post(
          'https://api.themoviedb.org/3/authentication/session/new',
          { request_token: response.data.request_token },
          { params: { api_key: 'b27d7edb3072175fb8681650517059f7' } }
        );
        this.sessionId = sessionResponse.data.session_id;
        localStorage.setItem('sessionId', this.sessionId);

        this.$router.push('/home');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fc;
}

/* Contenedor de login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #3498db, #8e44ad);
}

/* Caja de login */
.login-box {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Encabezado */
h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* Formulario de login */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Campos de entrada */
.input-field {
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  transition: border-color 0.3s;
}

/* Estilo al hacer focus */
.input-field:focus {
  border-color: #3498db;
  outline: none;
}

/* Botón de login */
.login-button {
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Hover en el botón */
.login-button:hover {
  background-color: #2980b9;
}

/* Transiciones para una experiencia más suave */
.login-button,
.input-field {
  transition: all 0.3s ease;
}
</style>
