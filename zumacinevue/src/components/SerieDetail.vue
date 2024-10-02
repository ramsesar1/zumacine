<template>
  <Navbar />
  <div class="series-header">
    <img v-if="serie.poster_path" 
     :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`" 
     :alt="serie.name" 
     class="serie-poster" 
/>
    <img v-else src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/640px-No-Image-Placeholder.svg.png" alt="Sin imagen disponible" class="serie-poster" />

    <div class="serie-info">
      <h2> {{ serie.name }} ({{ serie.first_air_date }})</h2>
      <p class = "descripcion">{{ serie.overview }}</p>

      <p v-if="serie.status"><strong>Estado: </strong> {{ getLanguageName(serie.status) }}</p>
      <p v-if="serie.type"><strong>Tipo: </strong> {{ getLanguageName(serie.type) }}</p>
      
      <div v-if="providers.length" class="providers-container">
        <h3>Donde ver:</h3>
        <div class="providers-list">
          <div v-for="provider in providers" :key="provider.provider_id" class="provider-item">
            <img :src="`https://image.tmdb.org/t/p/w200${provider.logo_path}`" :alt="provider.provider_name" class="provider-logo" />
          </div>
        </div>
      </div>

   <div v-if="serie.genres.length" class="categories">
  <strong>Categorías: </strong>
  <span
    v-for="genre in serie.genres"
    :key="genre.id"
    class="category"
    @click="$router.push({ path: `/category/${genre.id}`, query: { filter: 'tv' } })"
    style="cursor: pointer; color: inherit;"
  >
    {{ genre.name }}
  </span>
</div>

    <div class="keywords"> 
  <strong>Palabras clave: </strong>
  <span 
    v-for="keyword in serie.keywords" 
    :key="keyword.id" 
    class="keyword" 
    @click="$router.push({ path: `/keyword/${keyword.id}`, query: { filter: 'tv' } })" 
    style="cursor: pointer; color: inherit;"
  >
    {{ keyword.name }}
  </span>
</div> 
      <div v-if="serie.created_by.length" class="categories">
        <strong>Creador: </strong>
        <span v-for="creator in serie.created_by" :key="creator.id" class="category">
          {{ creator.name }}
        </span>
      </div>
      
      <div v-if="accountStates" class="user-actions">
        <div>
          <p>
            <strong>Favorito: </strong>
            {{ accountStates?.favorite ? 'Si' : 'No' }}
          </p>
          <p>
            <strong>Planeas por ver: </strong>
            {{ accountStates?.watchlist ? 'Si' : 'No' }}
          </p>
          <button @click="showRatingModal = true">Valora la serie</button>
        </div>

        <div v-if="showRatingModal" class="modal-overlay">
          <div class="modal-content">
            <h3>Valora la pelicula</h3>
            <p>Selecciona un puntaje:</p>
            <input type="range" min="10" max="100" step="10" v-model="selectedRating" />
            <p>Puntaje seleccionado {{ selectedRating }}</p>
            <button @click="rateSerie">Enviar rating</button>
            <button @click="showRatingModal = false">Cancelar</button>
          </div>
        </div>

        <p v-if="message">{{ message }}</p>

        <button @click="deleteRate()">Borra Rating</button>

        <div>
          <button @click="toggleFavorite">
            {{ accountStates?.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
          </button>
          <button @click="toggleWatchlist">
            {{ accountStates?.watchlist ? 'Quitar de lista' : 'Añadir a lista' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="recommendations.length" class="recommendations">
      <h3>Series Recomendadas</h3>
      <div class="scroll-section">
        <div class="scroll-content">
          <div v-for="recommendation in recommendations" :key="recommendation.id" class="recommendation-item"
            @click="goToSerie(recommendation.id)">
            <img v-if="recommendation.poster_path" :src="`https://image.tmdb.org/t/p/w200${recommendation.poster_path}`"
              :alt="recommendation.name" class="recommendation-poster" />
            <p>{{ recommendation.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!--codigo de no disponible foto-->
    <div v-if="cast.length">
      <h3>Reparto:</h3>
      <div class="cast-list">
        <div v-for="actor in cast" :key="actor.id" class="cast-item">
          <img 
            :src="actor.profile_path 
              ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
              : 'https://openclipart.org/image/2000px/297004'" 
            alt="Foto de {{ actor.name }}" 
            class="cast-photo" 
          />
          <p>
            <strong>
              <router-link :to="{ name: 'ActorDetail', params: { id: actor.id } }">
                {{ actor.name }}
              </router-link>
            </strong>
             {{ actor.roles && actor.roles.length > 0 ? actor.roles[0].character : 'Desconocido' }}
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="trailers.length" class="trailers">
      <h3>Trailers</h3>
      <div v-for="trailer in trailers" :key="trailer.id" class="trailer-item">
        <p>{{ trailer.name }}</p>
        <iframe
          v-if="trailer.site === 'YouTube'"
          width="560"
          height="315"
          :src="`https://www.youtube.com/embed/${trailer.key}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div class="current-season">
      <h3>Temporada actual</h3>
      <div class="season-info">
        <img 
        v-if="latestSeason.poster_path" :src="`https://image.tmdb.org/t/p/w500${latestSeason.poster_path}`" :alt="latestSeason.name" style="width: 200px; border-radius: 8px;"
        />
        <div class="season-details">
          <p>Temporada {{ latestSeason.season_number }}</p>
          
          <p>{{ latestSeason.episode_count}} Episodios</p>
          
        </div>
      </div>
    </div>
    <br>
    
    <button @click="goToSeasons">Ver todas las temporadas</button>
    

  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import axios from 'axios'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      serie: {
        genres: [],
        created_by: [],
        keywords: []
      },
      cast: [],
      providers: [],
      accountStates: null,
      message: '',
      selectedRating: 50,
      showRatingModal: false,
      recommendations: [],
      trailers: [],
      latestSeason: {}
    }
  },
  async mounted() {
    const serieId = this.$route.params.id
    const sessionId = localStorage.getItem('sessionId')

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.serie = response.data

      const keywordsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/keywords`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.serie.keywords = keywordsResponse.data.results || []

      const castResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/aggregate_credits`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.cast = castResponse.data.cast || []

      const recommendationResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${serieId}/recommendations`,
        {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            language: 'en-US',
            page: 1
          }
        }
      )
      this.recommendations = recommendationResponse.data.results

      const accountStatesResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${serieId}/account_states`,
        {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        }
      )
      if (accountStatesResponse && accountStatesResponse.data) {
        this.accountStates = accountStatesResponse.data
      } else {
        console.warn('AccountState es null o sin definir')
        this.accountStates = null
      }

      const trailersResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${serieId}/videos`,
        {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            language: 'en-US'
          }
        }
      )
      this.trailers = trailersResponse.data.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      )

      const seasonsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      const seasons = seasonsResponse.data.seasons;
      this.latestSeason = seasons[seasons.length - 1];

      const providersResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/watch/providers`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.providers = providersResponse.data.results?.US?.flatrate || [];

    } catch (error) {
      console.error('Fallo en obtener información de la serie:', error)
    }
  },
  methods: {
    
    goToSeasons() {
    this.$router.push({ name: 'seasons_Episodes', params: { id: this.serie.id } });
  },
    async rateSerie() {
      const sessionId = localStorage.getItem('sessionId')
      const apiRating = this.selectedRating / 10

      try {
        await axios.post(
          `https://api.themoviedb.org/3/tv/${this.serie.id}/rating`,
          { value: apiRating },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.message = `Calificaste "${this.serie.name}" con ${this.selectedRating}/100!`
        this.accountStates.rated = { value: apiRating }
        this.showRatingModal = false
      } catch (error) {
        this.message ='Fallo dar rating, intentelo de nuevo'
        console.error(error)
      }
    },

    async deleteRate() { 
      const sessionId = localStorage.getItem('sessionId')
      try {
        await axios.delete(`https://api.themoviedb.org/3/tv/${this.serie.id}/rating`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        })
        this.message = `Tu rating de "${this.serie.name}" ha sido removido.`;
      } catch (error) {
        this.message = 'Fallo dar rating, intentelo de nuevo';
        console.error(error)
      }
    },

    //lenguajes

    getLanguageName(languageCode) {
      const languageMap = {
        Returning_Series: 'Serie de reestreno',
        Ended: "Finalizada",
        Scripted: "Guion",
        Miniseries: "Mini serie"
      }
      return languageMap[languageCode] || languageCode.toUpperCase()
    },

    formatBudget(budget) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget)
    },

    async toggleFavorite() {
      const sessionId = localStorage.getItem('sessionId')
      const isFavorite = this.accountStates.favorite

      try {
        const accountResponse = await axios.get(`https://api.themoviedb.org/3/account`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        })
        const accountId = accountResponse.data.id

        await axios.post(
          `https://api.themoviedb.org/3/account/${accountId}/favorite`,
          {
            media_type: 'tv',
            media_id: this.serie.id,
            favorite: !isFavorite
          },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )

        this.setMessage = isFavorite ? 'Removida de favoritos' : 'Añadida a favoritos'
        this.accountStates.favorite = !isFavorite
      } catch (error) {
        console.error('Fallo al cambiar favorito: ', error)
      }
    },

    async toggleWatchlist() {
      const sessionId = localStorage.getItem('sessionId')
      const isInWatchlist = this.accountStates.watchlist

      try {
        const accountResponse = await axios.get('https://api.themoviedb.org/3/account', {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        })
        const accountId = accountResponse.data.id

        await axios.post(
          `https://api.themoviedb.org/3/account/${accountId}/watchlist`,
          {
            media_type: 'tv',
            media_id: this.serie.id,
            watchlist: !isInWatchlist
          },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.setMessage = isInWatchlist ? 'Removida de la lista' : 'Añadida a la lista'
        this.accountStates.watchlist = !isInWatchlist
      } catch (error) {
        console.error('Fallo en actualizar la lista de planeadas', error)
      }
    },

    async fetchSerieData(serieId) {
      const sessionId = localStorage.getItem('sessionId')

      try {
        
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
          params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
        })
        this.serie = response.data

        const seasons = response.data.seasons;
        this.latestSeason = seasons[seasons.length - 1];

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${serieId}/credits`,
          {
            params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
          }
        )
        this.cast = creditsResponse.data.cast

        const accountStatesResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${serieId}/account_states`,
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.accountStates = accountStatesResponse.data || null

        const trailersResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${serieId}/videos`,
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              language: 'en-US'
            }
          }
        )
        this.trailers = trailersResponse.data.results.filter(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        )

        const recommendationsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${serieId}/recommendations`,
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              language: 'en-US',
              page: 1
            }
          }
        )
        this.recommendations = recommendationsResponse.data.results
        
        
      } catch (error) {
        console.error('Fallo en obtener información de serie:', error)
      }
    },

    goToSerie(serieId) {
      this.$router.push({ path: `/serie/${serieId}` })
      this.fetchSerieData(serieId) 
    }
  }

}
</script>
<style scoped>

button {
  margin-right: 10px;
}

.providers-container {
  margin: 20px 0;
  text-align: center; 
}

.providers-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; 
  gap: 15px; 
}

.provider-item {
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: center;
  max-width: 100px;
}

.provider-logo {
  width: 50px;
  height: auto; 
  border-radius: 8px; 
  margin-top: 15px;
}


.descripcion{
  margin-bottom: 15px;
}
.current-season {
  margin-top: 20px;
}

.season-info {
  display: flex;
  align-items: flex-start;
}

.season-poster {
  width: 150px;
  height: auto;
  margin-right: 20px;
}

.season-details {
  max-width: 600px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

input[type='range'] {
  width: 100%;
  margin: 15px 0;
}

.serie-poster {
  width: 150px;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
}

.cast-list {
  list-style-type: none;
  padding: 0;
}

.cast-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cast-photo {
  width: 50px;
  height: 75px;
  border-radius: 5px;
  margin-right: 10px;
}

.recommendation-item {
  display: inline-block;
  margin-right: 15px;
  text-align: center;
  cursor: pointer;
}

.recommendation-poster {
  width: 100px;
  height: auto;
  margin-bottom: 5px;
  border-radius: 5px;
}

.serie-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.serie-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.serie-poster {
  width: 300px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.serie-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
}

/* palabras clave y categorias */
.keywords,
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword,
.category {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9em;
}

/* scroll horizontal */
.scroll-section {
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
}

.scroll-content {
  display: inline-flex;
  gap: 15px;
}

/* recomendaciones */
.recommendations {
  margin-top: 20px;
}

.recommendation-item {
  display: inline-block;
  width: 150px;
  margin-right: 15px;
  text-align: center;
  vertical-align: top;
}

.recommendation-poster {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 5px;
}

/* reparto */
.cast-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  overflow-x: auto;
  gap: 20px;
}

.cast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150px;
  text-align: center;
}

.cast-photo {
  width: 100px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.cast-item p {
  font-size: 14px;
  color: #333;
}

/* acciones de usuario */
.user-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.user-actions button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.user-actions button:hover {
  background-color: #0056b3;
}

/* botones */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #0056b3;
}

/* modal */
.modal-content button {
  margin-top: 10px;
  padding: 10px;
}

</style>

