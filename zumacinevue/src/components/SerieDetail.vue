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
        keywords: [] // Almacenamos aquí las palabras clave
      },
      cast: [] // Almacenamos aquí el reparto (cast)
    }
  },
  async mounted() {
    const serieId = this.$route.params.id

    try {
      // Obtienes los detalles de la serie
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.serie = response.data

      // Obtienes las palabras clave (keywords) de la serie
      const keywordsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/keywords`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.serie.keywords = keywordsResponse.data.results || [] 

      // Obtienes el reparto (cast) de la serie
      const castResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/aggregate_credits`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.cast = castResponse.data.cast || []

    } catch (error) {
      console.error('Fallo en obtener información de la serie:', error)
    }
  }
}
</script>
