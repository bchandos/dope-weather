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
  setup(props) {
    const wfo = store.getCookie('wfo', 'PQR');
    const x = parseInt(store.getCookie('x', 87));
    const y = parseInt(store.getCookie('y', 38));
    store.wfo = wfo;
    store.x = x;
    store.y = y;
  }
}
</script>
