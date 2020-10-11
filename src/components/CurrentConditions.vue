<template>
  <div v-if="!time">
    {{ statusMessage }}
  </div>
  <div v-else class="flex flex-col">
    <span class="italic">Current conditions on {{ prettyDate(time) }}:</span>
    <div class="flex justify-between items-center font-semibold text-lg">
      <div>
        {{ Math.round(temperature) }}°F
      </div>
      <div>
        {{ Math.round(windSpeed, 2) }}mph
        <WindCompass :degreeDirection="windDirection" />
      </div>
      <div>
        {{ Math.round(humidity) }}%
      </div>
      <img :src="icon" :alt="description" class="w-8 h-8 shadow-md rounded-full">
    </div>
    <div>{{ description }}</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import WindCompass from './WindCompass.vue';
import { store } from '../store.js';

export default {
  props: {

  },
  components: {
    WindCompass,
  },
  setup(props) {
    const icon = ref('');
    const time = ref('');
    const temperature = ref(0);
    const humidity = ref(0);
    const windDirection = ref(0);
    const windSpeed = ref(0);
    const description = ref('');
    
    const statusMessage = ref('Loading ...');
    
    const getConditions = async () => {
      try {
        // First retrieve stations for current WFO and gridpoints
        const stationUrl = `${store.baseURL}/gridpoints/${store.wfo}/${store.x},${store.y}/stations`;
        const stationResponse = await fetch(stationUrl, {mode: 'cors'});
        const stationJson = await stationResponse.json()
        const availableStations = stationJson['features'];
        // Pick the first station, for now...
        const stationId = availableStations[0]['properties']['stationIdentifier'];
        // Get current observations for said station
        const url = `${store.baseURL}/stations/${stationId}/observations/latest`;
        const response = await fetch(url, {mode: 'cors'});
        const json = await response.json()
        const currentConditions = json['properties'];      
        icon.value = currentConditions.icon;
        time.value = currentConditions.timestamp;
        temperature.value = currentConditions.temperature.value * 1.8 + 32;
        humidity.value = currentConditions.relativeHumidity.value;
        windDirection.value = currentConditions.windDirection.value;
        windSpeed.value = currentConditions.windSpeed.value * 0.6214;
        description.value = currentConditions.textDescription;
        
      } catch(err) {
        statusMessage.value = 'Error fetching current conditions.';
      }
    }

    const prettyDate = (date) => {
      return new Date(date).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
    }
    
    onMounted(getConditions);

    return {
      icon,
      time,
      temperature,
      humidity,
      windDirection,
      windSpeed,
      prettyDate,
      statusMessage,
      description
    }
  }

}
</script>
