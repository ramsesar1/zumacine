<template>
    <div>
      <h1>{{ serie.name }}</h1>
      <p><strong>Resumen:</strong> {{ serie.overview }}</p>
      <div v-if="temporadas.length">
        <div v-for="temporada in temporadas" :key="temporada.id">
          <h2>Temporada {{ temporada.season_number }}: {{ temporada.name }}</h2>
          <p><strong>Fecha de emisión:</strong> {{ temporada.air_date }}</p>
          <ul>
            <li v-for="episodio in temporada.episodios" :key="episodio.id">
              {{ episodio.episode_number }}. {{ episodio.name }} - {{ episodio.air_date }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      serie: Object,
    },
    data() {
      return {
        temporadas: [],
      };
    },
    created() {
      this.obtenerTemporadas();
    },
    methods: {
      async obtenerTemporadas() {
        try {
          const respuesta = await axios.get(`https://api.themoviedb.org/3/tv/${this.serie.id}?language=en-US&api_key=YOUR_API_KEY`);
          this.temporadas = respuesta.data.seasons.map(temporada => ({
            id: temporada.id,
            season_number: temporada.season_number,
            name: temporada.name,
            air_date: temporada.air_date,
            episodios: [], // Aquí se llenará más tarde
          }));
  
          // Ahora obtenemos los episodios de cada temporada
          await Promise.all(this.temporadas.map(async (temporada) => {
            const episodiosResponse = await axios.get(`https://api.themoviedb.org/3/tv/${this.serie.id}/season/${temporada.season_number}?language=en-US&api_key=YOUR_API_KEY`);
            temporada.episodios = episodiosResponse.data.episodes;
          }));
        } catch (error) {
          console.error('Error al obtener las temporadas:', error);
        }
      },
    },
  };
  </script>
  