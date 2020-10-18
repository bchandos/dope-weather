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

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    SettingsMenu,
  }
}
</script>
