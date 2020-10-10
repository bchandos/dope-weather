<template>
  <div class="flex justify-center mb-8">
    <div class="bg-gray-200 md:w-5/12 p-4 h-full w-11/12">
      <span class="text-xl font-semibold">
        Hourly Forecast
      </span>
      <div v-if="!forecasts.length" class="flex justify-between items-center bg-gray-100 px-2 py-4 m-2 rounded-md shadow-md">
        <span>{{ statusMessage }}</span>
      </div>
      <div v-for="hour in forecasts" :key="hour.number" class="flex justify-between items-center bg-gray-100 px-2 py-4 m-2 rounded-md shadow-md">
        <div class="text-gray-800 flex-1 text-md font-semibold">{{ prettyDate(hour.startTime) }}</div>
        <div class="text-gray-800 flex-1 text-sm">{{ hour.temperature }}°{{ hour.temperatureUnit }}</div>
        <div class="text-gray-800 flex-1 text-md">{{ hour.shortForecast }}</div>
        <div class="text-gray-800 flex-1 text-md">
          {{ hour.windSpeed }}
          <WindCompass :direction="hour.windDirection" />
        </div>
        <img :src="hour.icon" :alt="hour.shortForecast" class="rounded-full shadow-md h-8 w-8" style="filter: saturate(40%);">
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
    const forecasts = ref([]);
    const statusMessage = ref('Loading ...');
    
    const getForecasts = async () => {
      try {
        const response = await fetch('https://api.weather.gov/gridpoints/PQR/87,38/forecast/hourly', {mode: 'cors'});
        const json = await response.json()
        forecasts.value = json['properties']['periods'];
      } catch(err) {
        statusMessage.value = 'Error fetching data from api.weather.gov.';
      }
    }

    const prettyDate = (date) => {
      return new Date(date).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: 'numeric'});
    }
    
    onMounted(getForecasts);

    const icons = {
      
    }

    return {
      forecasts,
      prettyDate,
      statusMessage
    }
  }

}
</script>
