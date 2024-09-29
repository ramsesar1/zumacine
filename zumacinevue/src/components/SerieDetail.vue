<template>
  <div class="series-header">
    <img
      v-if="serie.poster_path"
      :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`"
      :alt="serie.name"
      class="serie-poster"
    />
    <div class="serie-info">
      <h2> {{ serie.name }}</h2>
      <p>{{ serie.overview }}</p>

      <div class="keywords">
        <strong>Palabras clave: </strong>
        <span v-for="keyword in serie.keywords" :key="keyword.id" class="keywords">
          {{ keyword.name }}
        </span>
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
        keywords: [] 
      }
    }
  },
  async mounted() {
    const serieId = this.$route.params.id

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.serie = response.data

      const keywordsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${serieId}/keywords`, {
        params: { api_key: 'b27d7edb3072175fb8681650517059f7' }
      })
      this.serie.keywords = keywordsResponse.data.results || [] 
    } catch (error) {
      console.error('Fallo en obtener información de la serie:', error)
    }
  }
}
</script>
