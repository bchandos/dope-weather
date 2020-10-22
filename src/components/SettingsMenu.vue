<template>
  <div
    v-show="store.settingsMenu"
    class="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-gray-500 bg-opacity-75"
  >
    <div class="z-50 relative p-4 mx-auto my-0 max-w-full sm:w-1/2" style="top: 25vh;">
      <div
        class="bg-white rounded shadow-lg border flex flex-col overflow-hidden"
      >
        <button
          @click="store.settingsMenu = false"
          class="fill-current h-6 w-6 absolute right-0 top-0 m-6 font-3xl font-bold"
        >
          &times;
        </button>
        <!-- Header -->
        <div class="px-6 py-3 text-xl border-b font-bold">Settings</div>
        <h2 class="px-6 pt-1 font-semibold font-md">Background Image</h2>
        <div class="px-6 py-3 flex-grow">
          <div class="flex items-center">
            <input
              v-model="weatherConditions"
              @change="bgSetting"
              type="checkbox"
              name="bg-image-condition"
              id="bg-image-condition"
              class="mr-3"
            />
            Weather conditions
          </div>
        </div>
        <div class="px-6 pb-3 flex-grow">
          <div class="flex items-center">
            <input
              v-model="weatherOffice"
              @change="bgSetting"
              type="checkbox"
              name="bg-image-location"
              id="bg-image-location"
              class="mr-3"
            />
            Weather office location
          </div>
        </div>
        <div class="px-6 py-3 border-t">
          <div class="flex justify-end">
            <button
              @click="store.settingsMenu = false"
              type="button"
              class="bg-gray-700 text-gray-100 rounded px-4 py-2 mr-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "../store.js";
import { ref } from "vue";
export default {
  setup() {
    const cookie = store.getCookie('imageChoice','');
    const weatherConditions = ref(cookie=='weather');
    const weatherOffice = ref(cookie=='city');
    const bgSetting = () => {
      if (event.target.id == "bg-image-condition") {
        weatherOffice.value = false;
      } else if (event.target.id == "bg-image-location") {
        weatherConditions.value = false;
      }

      if (weatherOffice.value) {
        store.setCookie('imageChoice', 'city');
        store.imageChoice = 'city';
      } else if (weatherConditions.value) {
        store.setCookie('imageChoice', 'weather');
        store.imageChoice = 'weather';
      } else {
        store.setCookie('imageChoice', '');
        store.imageChoice = '';
      }
    };
    return {
      store,
      bgSetting,
      weatherConditions,
      weatherOffice,
    };
  },
};
</script>

<style>
</style>