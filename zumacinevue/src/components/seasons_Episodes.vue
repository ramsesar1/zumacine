<template>
  <div class="seasons-container">
    <Navbar />
    <h2>Temporadas de {{ serie.name }}</h2>
    <div v-if="seasons.length">
      <div v-for="season in seasons" :key="season.id" class="season-card">
        <img
          :src="season.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}` : 'https://via.placeholder.com/150x225.png?text=No+Image'"
          alt="Poster de la temporada"
          class="season-poster"
        />
        <div class="season-info">
          <h3 @click="toggleSeason(season.id)">
            {{ season.name }}
            <span v-if="activeSeason === season.id">▲</span>
            <span v-else>▼</span>
          </h3>
          <p>{{ season.overview || 'Sin descripción disponible.' }}</p>
          <div v-if="activeSeason === season.id" class="episode-list">
            <ul v-if="season.episodes && season.episodes.length">
              <li v-for="episode in season.episodes" :key="episode.id" class="episode-item">
                <img
                  :src="episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : 'https://via.placeholder.com/100x150.png?text=No+Image'"
                  alt="Imagen del episodio"
                  class="episode-image"
                />
                <strong>{{ episode.episode_number }}. {{ episode.name }}</strong> - {{ episode.overview || 'Sin descripción disponible.' }}
                
                <button @click="episode.showGuests = !episode.showGuests" class="guest-button">
                  {{ episode.showGuests ? 'Ocultar invitados' : 'Mostrar invitados' }}
                </button>
                
                <div v-if="episode.showGuests">
                  <p>Invitados:</p>
                  <ul>
                    <li v-for="guest in episode.guest_stars" :key="guest.id" class="guest-item">
                      <img
                        :src="guest.profile_path ? `https://image.tmdb.org/t/p/w500${guest.profile_path}` : 'https://via.placeholder.com/50x75.png?text=No+Image'"
                        alt="Imagen del invitado"
                        class="guest-image"
                      />
                      <span>{{ guest.name }} como {{ guest.character }}</span>
                    </li>
                    <li v-if="episode.guest_stars.length === 0">No hay invitados especiales.</li>
                  </ul>
                </div>
              </li>
            </ul>
            <p v-else>Cargando episodios...</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No se encontraron temporadas para esta serie.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from './Navbar.vue'; // Importar el componente Navbar

export default {
  components: {
    Navbar, // Registrar el componente Navbar
  },
  data() {
    return {
      serie: {},
      seasons: [],
      activeSeason: null,
    };
  },
  async mounted() {
    const serieId = this.$route.params.id;

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7', language: 'es-ES' }
      });
      this.serie = response.data;
      this.seasons = response.data.seasons;
    } catch (error) {
      console.error('Error al obtener las temporadas:', error);
    }
  },
  methods: {
    async toggleSeason(seasonId) {
      if (this.activeSeason === seasonId) {
        this.activeSeason = null;
      } else {
        this.activeSeason = seasonId;

        const selectedSeason = this.seasons.find(season => season.id === seasonId);
        
        if (!selectedSeason.episodes) {
          try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${this.$route.params.id}/season/${selectedSeason.season_number}`, {
              params: { api_key: 'b27d7edb3072175fb8681650517059f7', language: 'es-ES' }
            });
            selectedSeason.episodes = response.data.episodes.map(episode => {
              return {
                ...episode,
                showGuests: false
              };
            });
          } catch (error) {
            console.error('Error al cargar los episodios:', error);
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.guest-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
}

.guest-button:hover {
  background-color: #0056b3;
}

.guest-item {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.guest-image {
  width: 50px;
  height: 75px;
  margin-right: 10px;
}

.season-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.episode-item {
  margin-top: 10px;
}

.episode-image {
  width: 100px;
  margin-right: 10px;
  display: inline-block;
}

.seasons-container {
  padding: 20px;
}

.season-card {
  display: flex;
  margin-bottom: 20px;
}

.season-poster {
  width: 150px;
  height: 225px; 
  margin-right: 20px;
}

.season-info {
  max-width: 600px;
}

.episode-list {
  margin-top: 10px;
}

h3 {
  cursor: pointer;
  display: flex;
  align-items: center;
}

span {
  margin-left: 10px;
  font-size: 14px;
}
</style>

