<template>
  <div class="flex justify-center">
    <div class="bg-teal-200 md:w-5/12 p-4 h-full w-11/12">
      <span class="text-xl font-semibold">
        Daily Forecast
      </span>
      <div v-if="!forecasts.length" class="flex justify-between items-center bg-teal-100 px-2 py-4 m-2 rounded-md shadow-md">
        <span>Loading ... </span>
      </div>
      <div v-for="day in forecasts" :key="day.number" class="flex justify-between items-center bg-teal-100 px-2 py-4 m-2 rounded-md shadow-md">
        <div class="flex-1 text-md font-semibold">{{ day.name }}</div>
        <div class="flex-1 text-sm">{{ day.temperature }}°{{ day.temperatureUnit }}</div>
        <div class="flex-1 text-md">{{ day.shortForecast }}</div>
        <div class="flex-1 text-md">
          {{ day.windSpeed }}
          <WindCompass :direction="day.windDirection" />
        </div>
        <img :src="day.icon" :alt="day.shortForecast" class="rounded-full shadow-md h-8 w-8" style="filter: saturate(40%);">
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import WindCompass from './WindCompass.vue';

export default {
  props: {

  },
  components: {
    WindCompass,
  },
  setup(props) {
    const url = 'https://api.weather.gov/gridpoints/PQR/87,38/forecast/hourly';
    const forecasts = ref([]);
    
    const getForecasts = async () => {
      const response = await fetch('https://api.weather.gov/gridpoints/PQR/87,38/forecast');
      const json = await response.json()
      forecasts.value = json['properties']['periods'];
    }
    
    onMounted(getForecasts);

    return {
      forecasts,
    }
  }

}
</script>
