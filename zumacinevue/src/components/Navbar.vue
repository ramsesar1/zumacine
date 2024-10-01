<template>
    <nav class="navbar">
      <div class="navbar-links">
        <router-link to="/" class="navbar-item">Inicio</router-link>
        <router-link to="/movies" class="navbar-item">Películas</router-link>
        <router-link to="/series" class="navbar-item">Series</router-link>
        <router-link to="/home" class="navbar-item">Home</router-link>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar'
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: #007bff;
    padding: 10px;
  }
  
  .navbar-links {
    display: flex;
    justify-content: space-around;
  }
  
  .navbar-item {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  
  .navbar-item:hover {
    text-decoration: underline;
  }
  </style>
  