<template>
  <div>
    <h1>Detalles de Palabra Clave</h1>
    <div v-if="keyword">
      <h2>{{ keyword.name }}</h2>
      <p>Filtrado por: 
        <select v-model="filter">
          <option value="movies">Películas</option>
          <option value="tv">Series</option>
        </select>
      </p>
      <p>Ordenar por: 
        <select v-model="sortOrder" @change="fetchFilteredResults">
          <option value="popularity.desc">Popularidad (descendente)</option>
          <option value="popularity.asc">Popularidad (ascendente)</option>
        </select>
      </p>
      <h3>Resultados:</h3>
      <ul>
        <li v-for="item in filteredResults" :key="item.id">
          {{ item.title || item.name }} ({{ item.release_date || item.first_air_date }})
        </li>
      </ul>
    </div>
    <p v-else>Cargando detalles de la palabra clave...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      keyword: null, // Almacena los detalles de la palabra clave
      filter: 'movies', // Filtro inicial
      sortOrder: 'popularity.desc', // Ordenar por popularidad descendente
      filteredResults: [], // Almacena los resultados filtrados
    };
  },
  mounted() {
    this.fetchKeywordDetails(); // Llamada a la API para obtener detalles de la palabra clave
  },
  methods: {
    async fetchKeywordDetails() {
      try {
        const keywordId = this.$route.params.id; // Obtener el ID de la palabra clave desde la URL
        const response = await axios.get(
          `https://api.themoviedb.org/3/keyword/${keywordId}?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        this.keyword = response.data;
        console.log("Detalles de palabra clave:", this.keyword);
        this.fetchFilteredResults(); // Llama a la función para obtener resultados filtrados
      } catch (error) {
        console.error("Error al obtener detalles de la palabra clave:", error);
      }
    },
    async fetchFilteredResults() {
      try {
        const keywordId = this.$route.params.id;
        const response = await axios.get(
          `https://api.themoviedb.org/3/keyword/${keywordId}/movies?api_key=b27d7edb3072175fb8681650517059f7&language=es&sort_by=${this.sortOrder}&include_adult=false&with_type=${this.filter}`
        );
        this.filteredResults = response.data.results;
        console.log("Resultados filtrados:", this.filteredResults);
      } catch (error) {
        console.error("Error al obtener resultados filtrados:", error);
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 2em;
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>
