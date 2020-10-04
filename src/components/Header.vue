<template>
  <div class="flex justify-center">
    <nav class="flex items-center justify-center flex-wrap bg-teal-500 p-6 md:w-1/2 w-full rounded-b-lg shadow-lg">
      <div class="text-white mr-6">
        <span class="font-semibold text-xl tracking-tight">The Weather</span>
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
