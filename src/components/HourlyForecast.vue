<template>
  <div class="flex justify-center mb-8">
    <div class="bg-gray-200 md:w-5/12 p-4 h-full w-11/12">
      <span class="text-xl font-semibold">
        Hourly Forecast
      </span>
      <template v-if="loading">
        <div 
          v-for="(day, index) in Array(10)" 
          :key="index" 
          class="flex justify-between flex-wrap items-center bg-gray-300 px-2 py-4 m-2 rounded-md shadow-md h-20"
          :class="{'animate-pulse' : !errorState}"
        >
         <div v-if="index==0" class="flex-1 p-1 text-md font-semibold">{{ statusMessage }}</div>
        </div>
      </template>
      <div v-for="hour in forecasts" :key="hour.number" class="flex justify-between items-center flex-wrap bg-gray-100 px-2 py-4 m-2 rounded-md shadow-md">
        <div class="text-gray-800 p-1 flex-1 text-md font-semibold">{{ prettyDate(hour.startTime) }}</div>
        <div class="text-gray-800 p-1 flex-1 text-sm">{{ hour.temperature }}°{{ hour.temperatureUnit }}</div>
        <div class="text-gray-800 p-1 flex-1 text-md">{{ hour.shortForecast }}</div>
        <div class="text-gray-800 p-1 flex-1 text-md">
          {{ hour.windSpeed }}
          <WindCompass :compassDirection="hour.windDirection" />
        </div>
        <img :src="hour.icon" :alt="hour.shortForecast" class="rounded-full shadow-md h-8 w-8" style="filter: saturate(40%);">
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import WindCompass from './WindCompass.vue';
import { store } from '../store.js';

export default {
  props: {

  },
  components: {
    WindCompass,
  },
  setup(props) {
    const forecasts = ref([]);
    const statusMessage = ref('Loading ...');
    const loading = ref(true);
    const errorState = ref(false);
    
    const getForecasts = async () => {
      try {
        loading.value = true;
        const url = `${store.baseURL}/gridpoints/${store.wfo}/${store.x},${store.y}/forecast/hourly`
        const response = await fetch(url, {mode: 'cors'});
        const json = await response.json()
        forecasts.value = json['properties']['periods'];
        loading.value = false;
      } catch(err) {
        statusMessage.value = 'Error fetching data from api.weather.gov.';
        errorState = true;
      }
    }

    const prettyDate = (date) => {
      return new Date(date).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: 'numeric'});
    }
    
    watchEffect(getForecasts);

    const icons = {
      
    }

    return {
      forecasts,
      prettyDate,
      statusMessage,
      loading,
      errorState
    }
  }

}
</script>
