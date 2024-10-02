<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <!-- Actor Detail -->
    <div class="actor-detail">
      <!-- Contenedor de la imagen y la biografía -->
      <div class="actor-header">
        <img
          v-if="actor"
          :src="actor.profile_path 
            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
            : 'https://openclipart.org/image/2000px/297004'" 
          alt="Imagen del actor"
          class="actor-photo"
        />

        <div class="biography">
          <h1 v-if="actor">{{ actor.name }}</h1>
          <p v-if="actor">{{ actor.biography || 'Biografía no disponible en este momento.' }}</p>
        </div>
      </div>

      <!-- Información personal -->
      <div class="personal-info">
        <h2>Información Personal</h2>
        <p v-if="actor"><strong>Fecha de Nacimiento:</strong> {{ actor.birthday || 'No disponible' }}</p>
        <p v-if="actor"><strong>Lugar de Nacimiento:</strong> {{ actor.place_of_birth || 'No disponible' }}</p>
      </div>

      <!-- Conocido por -->
      <div class="known-for">
        <h2>Conocido por</h2>
        <div v-if="knownFor.length" class="known-for-list">
          <div v-for="movie in knownFor" :key="movie.id" class="known-for-item" @click="redirectToDetail(movie)">
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
              :alt="movie.title || movie.name"
              class="known-for-photo"
            />
            <p>{{ movie.title || movie.name }} ({{ movie.release_date || movie.first_air_date }})</p>
          </div>
        </div>
        <p v-else>Cargando películas conocidas...</p>
      </div>

      <!-- Filmografía -->
      <div class="filmography">
        <h2>Filmografía</h2>
        <ul v-if="filmography.length">
          <li v-for="credit in filmography" :key="credit.id" @click="redirectToDetail(credit)">
            {{ credit.title || credit.name }} ({{ credit.release_date || credit.first_air_date }})
          </li>
        </ul>
        <p v-else>Cargando filmografía...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from './Navbar.vue'; // Importar el componente Navbar

export default {
  components: {
    Navbar, // Registrar Navbar como componente
  },
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
  methods: {
    redirectToDetail(item) {
      if (item.media_type === 'movie') {
        this.$router.push({ name: 'MovieDetail', params: { id: item.id } });
      } else if (item.media_type === 'tv') {
        this.$router.push({ name: 'SerieDetail', params: { id: item.id } });
      }
    },
  },
};
</script>

<style scoped>
/* General */
.actor-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

/* Contenedor de la imagen y biografía */
.actor-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}

.actor-photo {
  max-width: 250px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.biography h1 {
  font-size: 2.5em;
  color: #007bff;
  margin-bottom: 0.3em;
}

.biography p {
  font-size: 1.1em;
  line-height: 1.6;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Información Personal */
.personal-info {
  margin-top: 20px;
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.personal-info h2 {
  font-size: 1.8em;
  margin-bottom: 10px;
  color: #007bff;
}

.personal-info p {
  font-size: 1.1em;
  margin: 5px 0;
}

/* Conocido por */
.known-for {
  margin-top: 40px;
}

.known-for h2 {
  font-size: 2em;
  margin-bottom: 10px;
  color: #007bff;
}

.known-for-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.known-for-item {
  width: 150px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.known-for-item:hover {
  transform: scale(1.05);
}

.known-for-photo {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Filmografía */
.filmography {
  margin-top: 40px;
  text-align: center;
}

.filmography h2 {
  font-size: 2em;
  margin-bottom: 10px;
  color: #007bff;
}

.filmography ul {
  list-style-type: none;
  padding: 0;
}

.filmography li {
  margin-bottom: 0.8em;
  font-size: 1.2em;
  cursor: pointer;
  transition: color 0.2s;
}

.filmography li:hover {
  color: #007bff;
}
</style>












