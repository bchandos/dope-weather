<template>
  <header class="flex justify-center">
    <nav class="flex items-center justify-center flex-wrap bg-gray-500 p-6 md:w-1/2 w-full rounded-b-lg shadow-lg">
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
      <input class="mt-2 py-2 px-2 rounded flex-grow" type="text"/>
    </nav>
  </header>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {

  },
  setup(props) {
    return {
    }
  }

}
</script>
