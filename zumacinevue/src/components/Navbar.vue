<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-logo">
        <img src="https://play-lh.googleusercontent.com/ZVuzhksT-SVMPRRG_QiAurxc0Ex800HkKPRH6uFMW-akgB1Rmp11v3SuR67LklNlCA"
          alt="Logo" />
      </div>
      <div class="navbar-links">
        <router-link to="/movies" class="navbar-item">Películas</router-link>
        <router-link to="/series" class="navbar-item">Series</router-link>
        <router-link to="/home" class="navbar-item">Inicio</router-link>
        <a @click="logout" class="navbar-item logout-btn">Cerrar sesión</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    logout() {
      localStorage.removeItem('sessionId');
      this.$router.replace('/');
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #007bff;
  padding: 15px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo img {
  max-width: 50px;
}

.navbar-links {
  display: flex;
  gap: 20px;
}

.navbar-item {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 15px;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.navbar-item:hover {
  background-color: #0056b3;
}

.logout-btn {
  background-color: #ff4d4d;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #e60000;
}

body {
  margin: 0;
  padding-top: 60px;
  /* Space for sticky navbar */
}
</style>
