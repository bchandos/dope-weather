<template>
  <header class="flex justify-center">
    <nav class="bg-gray-500 p-6 pb-4 w-full rounded-b-lg shadow-lg bg-cover md:w-5/6 lg:w-3/4 xl:w-1/2" :style="imageUrl">
      <div class="flex items-center justify-center flex-wrap">
        <div class="text-white mr-6 p-2 rounded-md bg-gray-500 bg-opacity-50">
          <a class="font-semibold text-xl tracking-tight" href="/">The Weather</a>
          <div class="flex items-center justify-around">
            <router-link to='/hourly'>
              <img class="w-5 h-5" src="../assets/icons/clock.svg" alt="Hourly Forecast"/>
            </router-link>
            <router-link to='/daily'>
              <img class="w-5 h-5" src="../assets/icons/calendar.svg" alt="Daily Forecast"/>
            </router-link>
          </div>
        </div>
        <ZipCodeInput />
        <img @click="store.settingsMenu=true" src="../assets/icons/settings.svg" alt="Settings" class="mt-2 ml-2 h-5 w-5 cursor-pointer"/>
      </div>
      <div class="flex items-center justify-center flex-wrap">
        <CurrentConditions :key="store.zip" />
      </div>
    </nav>
  </header>
</template>

<script>
import { ref, watchEffect } from 'vue';
import CurrentConditions from './CurrentConditions.vue';
import ZipCodeInput from './ZipCodeInput.vue';
import { store } from '../store.js';

export default {
  components: {
    CurrentConditions,
    ZipCodeInput,
  },
  props: {

  },
  setup() {
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

    

    watchEffect(getImage);

    return {
      imageUrl,
      store,
    }
  }

}
</script>
