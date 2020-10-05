<template>
  <div class="flex justify-center">
    <nav class="flex items-center justify-center flex-wrap bg-teal-500 p-6 md:w-1/2 w-full rounded-b-lg shadow-lg">
      <div class="text-white mr-6">
        <div class="font-semibold text-xl tracking-tight">The Weather</div>
        <div class="flex items-center justify-around">
          <router-link class="text-sm italic" to='/hourly'>Hourly</router-link>
          <router-link class="text-sm italic" to='/daily'>Daily</router-link>
        </div>
      </div>
      <input class="py-2 px-2 rounded flex-grow" type="text"/>
    </nav>
  </div>
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
