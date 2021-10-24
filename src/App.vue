<template>
  <SettingsMenu />
  <Header />
  <router-view/>
  <Footer />
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import { store } from './store';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    SettingsMenu,
  },
  setup() {
    store.wfo = store.getCookie('wfo', 'PQR');
    store.x = parseInt(store.getCookie('x', 115));
    store.y = parseInt(store.getCookie('y', 105));
    store.city = store.getCookie('city', 'Portland');
    store.zip = store.getCookie('zip', '97218');
    store.zoneId = store.getCookie('zoneId', 'ORZ006');
  }
}
</script>
