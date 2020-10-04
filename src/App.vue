<template>
  <Header />
  <HourlyForecast />
</template>

<script>
import Header from './components/Header.vue';
import HourlyForecast from './components/HourlyForecast.vue';

export default {
  name: 'App',
  components: {
    Header,
    HourlyForecast,
  }
}
</script>
