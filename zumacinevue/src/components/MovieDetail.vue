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

    <p v-if="movie.genres.length">
      <strong>Categorias: </strong>
      <span v-for="(genre, index) in movie.genres" :key="genre.id">
        {{ genre.name }}<span v-if="index !== movie.genres.length - 1"></span>
      </span>
    </p>

    <p><strong>Fecha de estreno: </strong>{{ movie.release_date }}</p>

    <p><strong>Rating actual: </strong>{{ movie.vote_average }}/10</p>

    <div>
      <p>Valora la pelicula:</p>
      <button v-for="rating in ratings" :key="rating" @click="rateMovie(rating)">
        Puntaje {{ rating }}
      </button>
    </div>

    <button @click="deleteRate()">Borra Rating</button>
    <p v-if="message">{{ message }}</p>

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
      message: '',
      ratings: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    }
  },

  async mounted() {
    const movieId = this.$route.params.id
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
    } catch (error) {
      console.error('Fallo fetch de película:', error)
    }
  },

  methods: {
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
</style>
