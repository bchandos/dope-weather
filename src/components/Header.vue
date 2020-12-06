<template>
  <header class="flex justify-center">
    <nav class="bg-gray-500 p-6 pb-4 md:w-1/2 w-full rounded-b-lg shadow-lg bg-cover" :style="imageUrl">
      <div class="flex items-center justify-center flex-wrap">
        <div class="text-white mr-6">
          <a class="font-semibold text-xl tracking-tight" href="/">The Weather</a>
          <div class="flex items-center justify-around">
            <router-link class="text-sm italic" to='/hourly'>
              <img class="mt-2 w-5 h-5" src="../assets/icons/clock.svg" alt="Hourly Forecast"/>
            </router-link>
            <router-link class="text-sm italic" to='/daily'>
              <img class="mt-2 w-5 h-5" src="../assets/icons/calendar.svg" alt="Daily Forecast"/>
            </router-link>
          </div>
        </div>
        <div class="flex-grow relative">
          <input v-model="zipCode" @keyup.enter="lookupZip" class="w-full mt-2 py-2 px-2 rounded" type="text" placeholder="ZIP Code"/>
          <button v-if="zipCode.length == 5" @click="lookupZip" class="absolute inset-y-0 right-0 border border-indigo-400 bg-indigo-400 text-white rounded px-2 py-2 mt-2 disabled:opacity-90">Submit</button>
          <span v-else class="absolute inset-y-0 right-0 border border-indigo-400 bg-indigo-400 text-white rounded px-2 py-2 mt-2 opacity-50">Submit</span>
        </div>
        <img @click="store.settingsMenu=true" src="../assets/icons/settings.svg" alt="Settings" class="mt-2 ml-2 h-5 w-5 cursor-pointer"/>
      </div>
      <div class="flex items-center justify-center flex-wrap">
        <CurrentConditions />
      </div>
    </nav>
  </header>
</template>

<script>
import { ref, onMounted, watchEffect } from 'vue';
import CurrentConditions from './CurrentConditions.vue';
import { store } from '../store.js';

export default {
  components: {
    CurrentConditions,
  },
  props: {

  },
  setup(props) {
    const zipCode = ref('');
    const imageUrl = ref('');
    const imageChoice = store.getCookie('imageChoice', '');
    store.imageChoice = imageChoice;
    const getImage = async () => {
      try {
        let keyword;
        if (store.imageChoice=='city') {
          const url = `${store.baseURL}/offices/${store.wfo}`;
          const response = await fetch(url, {mode: 'cors'});
          const json = await response.json()
          const address = json.address;
          const city = address.addressLocality;
          const state = store.stateLookup[address.addressRegion];
          keyword = `${city.split(' ').join(',')},${state}`;
        } else if (store.imageChoice=='weather') {
          const possibleWords = store.currentDescription.split(' ');
          const badWords = ['then', 'likely', 'chance', 'slight', 'mostly'];
          const filteredWords = possibleWords.filter(word => !badWords.includes(word.toLowerCase()));
          keyword = filteredWords.join();
        } else {
          keyword = null;
        }
        if (keyword) {
          imageUrl.value = `background-image: url(https://source.unsplash.com/featured?${keyword});`;
        } else {
          imageUrl.value = '';
        }
      } catch(err) {
        
      }
    }

    const lookupZip = async () => {
      if (zipCode.value.length == 5) {
        const zipResponse = await fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipCode.value}`);
        const zipJson = await zipResponse.json();
        const geopoint = zipJson.records[0].fields;
        const latitude = geopoint.latitude;
        const longitude = geopoint.longitude;

        const weatherResponse = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
        const weatherJson = await weatherResponse.json();
        store.wfo = weatherJson.properties.gridId;
        store.x = weatherJson.properties.gridX;
        store.y = weatherJson.properties.gridY;
        store.setCookie('wfo', store.wfo);
        store.setCookie('x', store.x);
        store.setCookie('y', store.y);
      }
    zipCode.value = '';
    }
    
    watchEffect(getImage);

    return {
      imageUrl,
      store,
      zipCode,
      lookupZip
    }
  }

}
</script>
