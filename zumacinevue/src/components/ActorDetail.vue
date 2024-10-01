<template>
  <div v-if="actor">
    <!-- Nombre del actor -->
    <h1>{{ actor.name }}</h1>

    <!-- Detalles básicos del actor -->
    <p>Fecha de Nacimiento: {{ actor.birthday }}</p>
    <p>Lugar de Nacimiento: {{ actor.place_of_birth }}</p>
    <p>Biografía: {{ actor.biography }}</p>
    
    <!-- Imagen del actor -->
    <img :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`" alt="Imagen del actor" />

    <!-- Sección de películas o series más conocidas -->
    <h2>Conocido por</h2>
    <ul>
      <li v-for="movie in knownFor" :key="movie.id">
        {{ movie.title || movie.name }} ({{ movie.release_date || movie.first_air_date }})
      </li>
    </ul>

    <!-- Sección de filmografía completa -->
    <h2>Filmografía</h2>
    <ul>
      <li v-for="credit in filmography" :key="credit.id">
        {{ credit.title || credit.name }} ({{ credit.release_date || credit.first_air_date }})
      </li>
    </ul>
  </div>
  
  <!-- Mensaje de carga -->
  <div v-else>
    <p>Cargando detalles del actor...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    actorId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      actor: null,      // Almacena los detalles del actor
      knownFor: [],     // Almacena películas o series conocidas del actor
      filmography: [],  // Almacena toda la filmografía del actor
    };
  },
  watch: {
    actorId: {
      immediate: true,
      handler(newId) {
        // Cuando actorId cambie, llamar a la API
        this.fetchActorDetails(newId);
      },
    },
  },
  methods: {
    // Llama a la API de TMDB para obtener los detalles del actor
    async fetchActorDetails(actorId) {
      try {
        // Obtener los detalles del actor
        const actorResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        this.actor = actorResponse.data;

        // Obtener los créditos de actuación (películas/series)
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        const credits = creditsResponse.data.cast;

        // Películas o series más conocidas
        this.knownFor = credits.slice(0, 5);  // Selecciona las primeras 5

        // Toda la filmografía del actor
        this.filmography = credits;
      } catch (error) {
        console.error('Error al obtener detalles del actor:', error);
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 2em;
}
img {
  max-width: 200px;
  margin-top: 1em;
  border-radius: 10px;
}
h2 {
  margin-top: 1.5em;
  font-size: 1.5em;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 0.5em;
}
</style>









