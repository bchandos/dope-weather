<template>
  <div v-if="!time" class="flex flex-col mt-2 px-4 py-3 bg-gray-500 bg-opacity-50 rounded-md">
    {{ statusMessage }}
  </div>
  <div v-else class="flex flex-col mt-2 px-4 py-3 bg-gray-500 bg-opacity-50 rounded-md">
    <div class="italic text-sm md:text-lg font-medium">{{ cityStr }}</div>
    <div class="italic text-sm md:text-lg">Current conditions on {{ prettyDate(time) }}:</div>
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
      <img v-if="icon" :src="icon" :alt="description" class="w-8 h-8 shadow-md rounded-full">
    </div>
    <div class="text-sm md:text-lg">{{ description }}</div>
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
  setup() {
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
        // Pick the nearest airport station, designated by starting the "K",
        // as that is the likeliest to have completed data. In case it does not
        // loop through all possibilities.
        const nearestAirports = availableStations.filter(s => s.properties.stationIdentifier.startsWith('K'));
        for (let nearestAirport of nearestAirports) {
          const stationId = nearestAirport.properties.stationIdentifier;
          // Get current observations for said station
          const url = `${store.baseURL}/stations/${stationId}/observations/latest`;
          const response = await fetch(url, {mode: 'cors'});
          if (response.ok) {
            const json = await response.json()
            const currentConditions = json['properties'];    
            icon.value = currentConditions.icon;
            time.value = currentConditions.timestamp;
            temperature.value = currentConditions.temperature.value * 1.8 + 32;
            humidity.value = currentConditions.relativeHumidity.value;
            windDirection.value = currentConditions.windDirection.value;
            windSpeed.value = currentConditions.windSpeed.value * 0.6214;
            description.value = currentConditions.textDescription;
            // Store current description text
            store.currentDescription = description.value;
            break;
          }
        }
        
      } catch(err) {
        statusMessage.value = 'Error fetching current conditions.';
      }
    }

    const prettyDate = (date) => {
      return new Date(date).toLocaleString('en-US', {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
    }
    const cityStr = `${store.city}, ${store.state} (${store.zip})`;
    
    watchEffect(getConditions);

    return {
      icon,
      time,
      temperature,
      humidity,
      windDirection,
      windSpeed,
      prettyDate,
      statusMessage,
      description,
      cityStr
    }
  }

}
</script>
