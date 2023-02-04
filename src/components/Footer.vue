<template>
  <footer
    class="font-semibold fixed bottom-0 w-full text-right border-t border-teal bg-gray-400 py-2 px-4"
  >
    &#169; 2020-{{ new Date().getFullYear() }}
    <a class="underline text-blue-900" href="https://billchandos.dev"
      >billchandos.dev</a
    >
  </footer>
</template>

<script>
import { ref } from "vue";

export default {
  props: {},
  setup(props) {
    return {};
  },
};
</script>
