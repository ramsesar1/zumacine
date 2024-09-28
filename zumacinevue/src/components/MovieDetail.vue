<template>
  <div>
    <h2>{{ movie.title }}</h2>
    <p>{{ movie.overview }}</p>

    <img
      v-if="movie.poster_path"
      :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
      :alt="movie.title"
      class="movie-poster"
    />

    <!--parte para categorias de pelicula-->

    <p v-if="movie.genres.length">
      <strong>Categorias: </strong>
      <span v-for="(genre, index) in movie.genres" :key="genre.id">
        {{ genre.name }}<span v-if="index !== movie.genres.length - 1">, </span>
      </span>
    </p>

    <p><strong>Fecha de estreno: </strong>{{ movie.release_date }}</p>

    <p><strong>Rating actual: </strong>{{ movie.vote_average }}/10</p>

    <!--parte para valoracion de pelicula, watchlist y favorito-->

    <div v-if="accountStates">
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
      <p>Valora la pelicula:</p>
      <button v-for="rating in ratings" :key="rating" @click="rateMovie(rating)">
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

    <!--parte para display de trailers-->

    <div v-if="trailers.length">
      <h3>Trailers</h3>
      <div v-for="trailer in trailers" :key="trailer.id">
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

    <!--Parte para recomendaciones -->

    <div v-if="recommendations.length">
      <h3>Peliculas Recomendadas</h3>
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

    <!--reparto de pelicula-->>

    <div>
      <h3>Reparto:</h3>
      <ul class="cast-list">
        <li v-for="actor in cast" :key="actor.id" class="cast-item">
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
        </li>
      </ul>
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
      accountStates: null,
      message: '',
      ratings: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
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
    } catch (error) {
      console.error('Failed to fetch movie data:', error)
    }
  },

  methods: {
    //puntuar rating pelicula

    async rateMovie(rating) {
      const sessionId = localStorage.getItem('sessionId')
      const apiRating = rating / 10

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
        this.setMessage(`Calificaste "${this.movie.title}" con ${rating}/100!`)
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

    //redirigir a la pagina de la pelicula recomendada

    goToMovie(movieId) {
      this.$router.push({ path: `/movie/${movieId}` })
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
.movie-poster {
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
</style>
