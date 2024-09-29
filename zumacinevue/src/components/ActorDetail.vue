<template>
  <div>
    <h1 v-if="actor">{{ actor.name }}</h1>
    <p v-if="actor">Fecha de Nacimiento: {{ actor.birthday }}</p>
    <p v-if="actor">Lugar de Nacimiento: {{ actor.place_of_birth }}</p>
    <p v-if="actor">Biografía: {{ actor.biography }}</p>
    <img v-if="actor" :src="`https://image.tmdb.org/t/p/w500${actor.profile_path}`" alt="Imagen del actor" />

    <!-- Mostrar películas por las que es conocido -->
    <h2>Conocido por</h2>
    <ul v-if="knownFor.length">
      <li v-for="movie in knownFor" :key="movie.id">{{ movie.title || movie.name }} ({{ movie.release_date || movie.first_air_date }})</li>
    </ul>

    <!-- Mostrar filmografía -->
    <h2>Filmografía</h2>
    <ul v-if="filmography.length">
      <li v-for="credit in filmography" :key="credit.id">
        {{ credit.title || credit.name }} ({{ credit.release_date || credit.first_air_date }})
      </li>
    </ul>

    <p v-else>Cargando detalles del actor...</p>
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
  mounted() {
    this.fetchActorDetails(); // Llamada a la API cuando el componente se monte
  },
  methods: {
    async fetchActorDetails() {
      try {
        const actorId = this.$route.params.id; // ID del actor desde la URL
        // Obtener los detalles del actor
        const actorResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        this.actor = actorResponse.data;

        // Obtener créditos de actuación (películas/series)
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        const credits = creditsResponse.data.cast;

        // Películas o series más conocidas
        this.knownFor = credits.slice(0, 5); // Selecciona las primeras 5 como "conocido por"

        // Toda la filmografía
        this.filmography = credits;

        console.log("Información del actor:", this.actor);
        console.log("Conocido por:", this.knownFor);
        console.log("Filmografía:", this.filmography);
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







