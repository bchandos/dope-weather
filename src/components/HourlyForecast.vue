<template>
  <div class="flex justify-center">
    <div class="bg-teal-200 md:w-5/12 p-4 h-full w-11/12">
      <span class="text-xl font-semibold">
        Hourly Forecast
      </span>
      <div v-for="hour in forecasts" :key="hour.number" class="flex justify-between items-center bg-teal-100 px-2 py-4 m-2 rounded-md shadow-md">
        <div class="text-md font-semibold">{{ prettyDate(hour.startTime) }}</div>
        <div class="text-sm">{{ hour.temperature }}°{{ hour.temperatureUnit }}</div>
        <div class="text-md">{{ hour.shortForecast }}</div>
        <div class="text-md">{{ hour.windSpeed }} {{ hour.windDirection }}</div>
        <img :src="hour.icon" :alt="hour.shortForecast" class="rounded-full shadow-md h-8 w-8" style="filter: saturate(40%);">
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {

  },
  setup(props) {
    const url = 'https://api.weather.gov/gridpoints/PQR/87,38/forecast/hourly';
    const forecasts = ref([]);
    
    const getForecasts = async () => {
      const response = await fetch('https://api.weather.gov/gridpoints/PQR/87,38/forecast/hourly');
      const json = await response.json()
      forecasts.value = json['properties']['periods'];
    }

    const prettyDate = (date) => {
      return new Date(date).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: 'numeric'});
    }
    
    onMounted(getForecasts);

    const icons = {
      
    }

    return {
      forecasts,
      prettyDate
    }
  }

}
</script>
