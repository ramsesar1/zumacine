<template>
  <div class="movie-details">
    <div class="movie-header">
      <img
        v-if="movie.poster_path"
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        :alt="movie.title"
        class="movie-poster"
      />

      <div class="movie-info">
        <h2>{{ movie.title }}</h2>
        <p>{{ movie.overview }}</p>

        <!--parte para categorias de pelicula, palabras clave y personal-->

        <div v-if="movie.genres.length" class="categories">
          <strong>Categorias: </strong>
          <span v-for="genre in movie.genres" :key="genre.id" class="category">
            {{ genre.name }}
          </span>
        </div>

        <div v-if="keywords.length" class="keywords">
          <strong>Palabras clave: </strong>
          <span v-for="keyword in keywords" :key="keyword.id" class="keyword">
            {{ keyword.name }}
          </span>
        </div>

        <!-- Personal de la pelicula no cast -->
        <div v-if="crewRoles.length" class="crew">
          <strong>Crew: </strong>
          <span
            v-for="(crew, index) in crewRoles"
            :key="index"
            class="crew-name"
            @click="goToActor(crew.id)"
          >
            {{ crew.name }} ({{ crew.job }})
          </span>
        </div>

        <p><strong>Fecha de estreno: </strong>{{ movie.release_date }}</p>

        <p><strong>Rating actual: </strong>{{ movie.vote_average }}/10</p>

        <!--parte para valoracion de pelicula, watchlist y favorito-->

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
            <button @click="showRatingModal = true" class="button">Valora la pelicula</button>
          </div>

          <div v-if="showRatingModal" class="modal-overlay">
            <div class="modal-content">
              <h3>Valora la pelicula</h3>
              <p>Selecciona un puntaje:</p>
              <input type="range" min="10" max="100" step="10" v-model="selectedRating" />
              <p>Puntaje seleccionado {{ selectedRating }}</p>
              <button @click="rateMovie">Enviar rating</button>
              <button @click="showRatingModal = false">Cancelar</button>
            </div>
          </div>

          <p v-if="message">{{ message }}</p>

          <div>
            <button @click="deleteRate()" class="button">Borra Rating</button>

            <button @click="toggleFavorite" class="button">
              {{ accountStates?.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
            </button>
            <button @click="toggleWatchlist" class="button">
              {{ accountStates?.watchlist ? 'Quitar de lista' : 'Añadir a lista' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Parte para recomendaciones -->

    <div v-if="recommendations.length" class="recommendations">
      <h3>Peliculas Recomendadas</h3>
      <div class="scroll-section">
        <div class="scroll-content">
          <div
            v-for="recommendation in recommendations"
            :key="recommendation.id"
            class="recommendation-item"
            @click="goToMovie(recommendation.id)"
          >
            <img
              v-if="recommendation.poster_path"
              :src="`https://image.tmdb.org/t/p/w200${recommendation.poster_path}`"
              :alt="recommendation.title"
              class="recommendation-poster"
            />
            <p>{{ recommendation.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!--reparto de pelicula-->

    <div v-if="cast.length">
      <h3>Reparto:</h3>
      <div class="cast-list">
        <div v-for="actor in cast" :key="actor.id" class="cast-item" @click="goToActor(actor.id)">
          <img
            v-if="actor.profile_path"
            :src="`https://image.tmdb.org/t/p/w200${actor.profile_path}`"
            :alt="actor.name"
            class="cast-photo"
          />
          <p>
            <strong>{{ actor.name }}</strong
            >como: {{ actor.character }}
          </p>
        </div>
      </div>
    </div>

    <!--parte para display de trailers-->

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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      movie: {
        genres: []
      },
      cast: [],
      keywords: [],
      crewRoles: [],
      accountStates: null,
      message: '',
      selectedRating: 50,
      showRatingModal: false,
      trailers: [],
      recommendations: []
    }
  },

  async mounted() {
    const movieId = this.$route.params.id
    const sessionId = localStorage.getItem('sessionId')

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.movie = response.data

      const creditsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        {
          params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
        }
      )
      this.cast = creditsResponse.data.cast

      const crew = creditsResponse.data.crew
      const relevantRoles = [
        'Director',
        'Writer',
        'Characters',
        'Screenplay',
        'Story',
        'Screenplay/Story'
      ]
      this.crewRoles = crew.filter((member) => relevantRoles.includes(member.job))

      const accountStatesResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/account_states`,
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

      //get de trailers

      const trailersResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
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

      //get de recomendaciones

      const recommendationsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations`,
        {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            language: 'en-US',
            page: 1
          }
        }
      )
      this.recommendations = recommendationsResponse.data.results

      const keywordsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/keywords`,
        {
          params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
        }
      )

      this.keywords = keywordsResponse.data.keywords || []
    } catch (error) {
      console.error('Fallo en obtener informacion de pelicula:', error)
    }
  },

  methods: {
    //-------------redireccion a peliculas recomendadas-----------------------
    async fetchMovieData(movieId) {
      const sessionId = localStorage.getItem('sessionId')

      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
        })
        this.movie = response.data

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
          }
        )
        this.cast = creditsResponse.data.cast

        const accountStatesResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/account_states`,
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.accountStates = accountStatesResponse.data || null

        const trailersResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
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
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations`,
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
        console.error('Fallo en obtener informacion de pelicula:', error)
      }
    },

    //redirigir a la pagina de la pelicula recomendada

    goToMovie(movieId) {
      this.$router.push({ path: `/movie/${movieId}` })
      this.fetchMovieData(movieId)
    },

    //redirigir a la pagina de actor o personal

    goToActor(actorId) {
      this.$router.push({ path: `/actor/${actorId}` })
    },

    //----------------carga inicial------------------------
    //puntuar rating pelicula

    async rateMovie() {
      const sessionId = localStorage.getItem('sessionId')
      const apiRating = this.selectedRating / 10

      try {
        await axios.post(
          `https://api.themoviedb.org/3/movie/${this.movie.id}/rating`,
          { value: apiRating },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.setMessage(`Calificaste "${this.movie.title}" con ${this.selectedRating}/100!`)
        this.accountStates.rated = { value: apiRating }
        this.showRatingModal = false
      } catch (error) {
        this.setMessage('Fallo dar rating, intentelo de nuevo')
        console.error(error)
      }
    },

    async deleteRate() {
      const sessionId = localStorage.getItem('sessionId')
      try {
        await axios.delete(`https://api.themoviedb.org/3/movie/${this.movie.id}/rating`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        })

        if (this.accountStates && this.accountStates.rated) {
          this.accountStates.rated = null
        }

        this.setMessage(`Tu rating de "${this.movie.title}" ha sido removido.`)
      } catch (error) {
        this.setMessage('Fallo dar rating, intentelo de nuevo')
        console.error(error)
      }
    },

    //agregar si esta en favoritos

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
            media_type: 'movie',
            media_id: this.movie.id,
            favorite: !isFavorite
          },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )

        this.setMessage(isFavorite ? 'Removida de favoritos' : 'Añadida a favoritos')
        this.accountStates.favorite = !isFavorite
      } catch (error) {
        console.error('Fallo al cambiar favorito: ', error)
      }
    },

    //funcionalidad para ver si esta en lista de por ver

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
            media_type: 'movie',
            media_id: this.movie.id,
            watchlist: !isInWatchlist
          },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        )
        this.setMessage(isInWatchlist ? 'Removida de la lista' : 'Añadida a la lista')
        this.accountStates.watchlist = !isInWatchlist
      } catch (error) {
        console.error('Fallo en actualizar la lista de planeadas', error)
      }
    },

    setMessage(msg) {
      this.message = msg
      setTimeout(() => {
        this.message = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
/*estilo para los botones*/

.button {
  width: auto;
  min-width: 150px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  margin: 5px;
}

.button:hover {
  background-color: #0056b3;
}

.delete-rating-button {
  background-color: #dc3545;
}

.delete-rating-button:hover {
  background-color: #c82333;
}

/* sliders para rating */
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
.movie-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.movie-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.movie-poster {
  width: 400px;
  height: auto;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.movie-info {
  flex: 1;
}

/* palabras clave y categorias */
.keywords,
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
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

.crew-role-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.crew-role {
  font-weight: bold;
  margin-right: 10px;
}

.crew-name {
  display: inline-block;
  padding: 8px 12px;
  border: 2px solid #000;
  border-radius: 50px;
  text-align: center;
  min-width: 100px;
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

/* seccion para trailers */
.trailers {
  margin-top: 30px;
}

.trailer-item {
  margin-bottom: 20px;
}
</style>
