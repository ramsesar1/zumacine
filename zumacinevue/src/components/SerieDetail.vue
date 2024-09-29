<template>
  <div class="series-header">
    <img
      v-if="serie.poster_path"
      :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`"
      :alt="serie.name"
      class="serie-poster"
    />
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

    <div v-if="cast.length">
      <h3>Reparto:</h3>
      <div class="cast-list">
        <div v-for="actor in cast" :key="actor.id" class="cast-item">
          <img
            v-if="actor.profile_path"
            :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
            :alt="actor.name"
            class="cast-photo"
          />
          <p>
            <strong>{{ actor.name }}</strong> como: {{ actor.roles[0]?.character || 'Desconocido' }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      serie: {
        genres: [],
        created_by: [],
        keywords: [] 
      },
      cast: [],
      accountStates: null,
      message: '',
      ratings: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
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
  }
}

}
</script>
