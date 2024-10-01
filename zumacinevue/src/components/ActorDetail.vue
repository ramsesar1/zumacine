<template>
  <div class="actor-detail">
    <!-- Contenedor de la imagen y la biografía -->
    <div class="actor-header">
      <!-- Imagen del actor en la parte superior izquierda -->
      <img
        v-if="actor"
        :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`"
        alt="Imagen del actor"
        class="actor-photo"
      />

      <!-- Biografía a la derecha de la imagen -->
      <div class="biography">
        <h1 v-if="actor">{{ actor.name }}</h1>
        <p v-if="actor">{{ actor.biography || 'Biografía no disponible en este momento.' }}</p>
      </div>
    </div>

    <!-- Información personal debajo de la imagen -->
    <div class="personal-info">
      <h2>Información Personal</h2>
      <p v-if="actor">Fecha de Nacimiento: {{ actor.birthday }}</p>
      <p v-if="actor">Lugar de Nacimiento: {{ actor.place_of_birth }}</p>
    </div>

    <!-- Mostrar películas por las que es conocido debajo de la biografía -->
    <div class="known-for">
      <h2>Conocido por</h2>
      <div v-if="knownFor.length" class="known-for-list">
        <div v-for="movie in knownFor" :key="movie.id" class="known-for-item">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
            :alt="movie.title"
            class="known-for-photo"
          />
          <p>{{ movie.title || movie.name }} ({{ movie.release_date || movie.first_air_date }})</p>
        </div>
      </div>
      <p v-else>Cargando películas conocidas...</p>
    </div>

    <!-- Filmografía debajo de la sección de "Conocido por", centrado -->
    <div class="filmography">
      <h2>Filmografía</h2>
      <ul v-if="filmography.length">
        <li v-for="credit in filmography" :key="credit.id">
          {{ credit.title || credit.name }} ({{ credit.release_date || credit.first_air_date }})
        </li>
      </ul>
      <p v-else>Cargando filmografía...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      actor: null, // Detalles del actor
      knownFor: [], // Películas o series por las que es conocido
      filmography: [] // Toda su filmografía
    };
  },
  async mounted() {
    const actorId = this.$route.params.id; // ID del actor desde la URL
    try {
      // Intentar obtener los detalles del actor en español
      const response = await axios.get(`https://api.themoviedb.org/3/person/${actorId}?api_key=b27d7edb3072175fb8681650517059f7&language=es`);
      this.actor = response.data;

      // Si no hay biografía en español, intenta obtenerla en inglés
      if (!this.actor.biography || this.actor.biography.trim() === '') {
        const englishResponse = await axios.get(`https://api.themoviedb.org/3/person/${actorId}?api_key=b27d7edb3072175fb8681650517059f7&language=en`);
        this.actor.biography = englishResponse.data.biography || 'Biografía no disponible en este momento.';
      }

      // Obtener créditos de actuación (películas/series)
      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=b27d7edb3072175fb8681650517059f7&language=es`);
      const credits = creditsResponse.data.cast;

      // Películas o series más conocidas
      this.knownFor = credits.slice(0, 5); // Selecciona las primeras 5 como "conocido por"

      // Ordenar filmografía de la más reciente a la más antigua
      this.filmography = credits
        .filter(credit => credit.release_date || credit.first_air_date) // Filtrar elementos que tienen fecha
        .sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date);
          const dateB = new Date(b.release_date || b.first_air_date);
          return dateB - dateA; // Ordenar de la más reciente a la más antigua
        });
    } catch (error) {
      console.error('Error fetching actor details:', error);
    }
  },
};
</script>

<style scoped>
.actor-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.actor-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.actor-photo {
  max-width: 300px;
  border-radius: 10px;
}

.biography {
  flex: 1;
}

.biography h1 {
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.biography p {
  font-size: 1.1em;
  line-height: 1.5;
}

.personal-info {
  margin-top: 20px;
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
}

.known-for {
  margin-top: 40px;
}

.known-for h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.known-for-list {
  display: flex;
  flex-wrap: wrap;
}

.known-for-item {
  margin: 10px;
  text-align: center;
  width: 120px;
}

.known-for-photo {
  width: 100%;
  border-radius: 5px;
}

.filmography {
  margin-top: 40px;
  text-align: center;
}

.filmography h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.filmography ul {
  list-style-type: none;
  padding: 0;
}

.filmography li {
  margin-bottom: 0.5em;
  font-size: 1.2em;
}
</style>












