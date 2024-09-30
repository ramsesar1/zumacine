<template>
  <div class="series-header">
    <img v-if="serie.poster_path" :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`" :alt="serie.name"
      class="serie-poster" />
    <div class="serie-info">
      <h2> {{ serie.name }} ({{ serie.first_air_date }})</h2>
      <p>{{ serie.overview }}</p>

      <div v-if="serie.genres.length" class="categories">
        <strong>Categorías: </strong>
        <span v-for="genre in serie.genres" :key="genre.id" class="category">
          {{ genre.name }}
        </span>
      </div>

      <div class="keywords">
        <strong>Palabras clave: </strong>
        <span v-for="keyword in serie.keywords" :key="keyword.id" class="keywords">
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
          <p>
            <strong>Tu rating: </strong>
            {{ accountStates?.rated?.value ? accountStates.rated.value * 10 : 'Sin calificar' }}
          </p>
        </div>
        <div>
          <p>Valora la serie:</p>
          <button v-for="rating in ratings" :key="rating" @click="rateSerie(rating)">
            Puntaje {{ rating }}
          </button>
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

    <div v-if="cast.length">
      <h3>Reparto:</h3>
      <div class="cast-list">
        <div v-for="actor in cast" :key="actor.id" class="cast-item">
          <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`" :alt="actor.name"
            class="cast-photo" />
          <p>
            <strong>{{ actor.name }}</strong> como: 
             {{ actor.roles && actor.roles.length > 0 ? actor.roles[0].character : 'Desconocido' }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      serie: {
        genres: [],
        created_by: [],
        keywords: []
      },
      cast: [],
      accountStates: null,
      message: '',
      ratings: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      recommendations: []
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

    } catch (error) {
      console.error('Fallo en obtener información de la serie:', error)
    }
  },
  methods: {
    async rateSerie(rating) {
      const sessionId = localStorage.getItem('sessionId')
      const serieId = this.$route.params.id
      const apiRating = rating / 10
      try {
        await axios.post(
          `https://api.themoviedb.org/3/tv/${serieId}/rating`,
          { value: apiRating },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.message = `Calificaste "${this.serie.name}" con ${rating}/100!`
        this.accountStates.rated = { value: apiRating }
      } catch (error) {
        console.error('Fallo en ratear, intente de nuevo.', error)
        this.message = 'Error al valorar la serie, intenta nuevamente.'
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
      this.fetchSerieData(serieId) //todavia falta de hacer esto :'v
    }
  }

}
</script>
