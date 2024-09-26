<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
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
        
        this.$router.push('/movies');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
