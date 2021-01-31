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
    store.x = parseInt(store.getCookie('x', 87));
    store.y = parseInt(store.getCookie('y', 38));
    store.city = store.getCookie('city', 'Springfield');
    store.zip = store.getCookie('zip', '97477');
  }
}
</script>
