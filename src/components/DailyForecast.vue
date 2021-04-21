<template>
  <div class="flex justify-center mb-8">
    <div class="bg-gray-200 py-4 px-2 h-full w-full mx-2 md:w-5/6 lg:w-3/4 xl:w-1/2">
      <span class="text-xl font-semibold">
        Daily Forecast
      </span>
      <template v-if="loading">
        <div 
          v-for="(day, index) in Array(10)" 
          :key="index" 
          class="flex justify-between flex-wrap items-center bg-gray-300 px-2 py-4 my-2 rounded-md shadow-md h-20"
          :class="{'animate-pulse' : !errorState}"
        >
          <div 
            v-if="index==0" 
            class="flex-1 p-1 text-base font-semibold cursor-pointer"
            @click.stop="getForecasts"
          >
           {{ statusMessage }}
          </div>
        </div>
      </template>
      <div v-for="day in forecasts" :key="day.number" class="flex justify-between flex-wrap items-center bg-gray-100 px-2 py-4 my-2 rounded-md shadow-md">
        <div class="text-gray-800 flex-1 p-1 text-sm md:text-base lg:text-lg font-semibold">{{ day.name }}</div>
        <div class="text-gray-800 flex-1 p-1 text-sm md:text-base lg:text-lg">{{ day.shortForecast }}</div>
        <div class="text-gray-800 flex-1 p-1 text-sm md:text-base lg:text-lg">
          {{ day.windSpeed }}
          <WindCompass :compassDirection="day.windDirection" />
        </div>
        <div class="flex flex-col">
          <img :src="day.icon" :alt="day.shortForecast" class="rounded-full shadow-md h-8 w-8" style="filter: saturate(40%);">
          <div class="text-gray-800 flex-1 p-1 text-sm md:text-base lg:text-lg">{{ day.temperature }}°{{ day.temperatureUnit }}</div>
        </div>
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
        const url = `${store.baseURL}/gridpoints/${store.wfo}/${store.x},${store.y}/forecast`;
        const response = await fetch(url, {mode: 'cors'});
        const json = await response.json()
        forecasts.value = json['properties']['periods'];
        loading.value = false;
      } catch(err) {
        statusMessage.value = 'Error fetching data from api.weather.gov.';
        errorState.value = true;
      }
    }
    
    watchEffect(getForecasts);

    return {
      forecasts,
      statusMessage,
      loading,
      errorState,
      getForecasts,
    }
  }

}
</script>
