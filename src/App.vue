<template>
  <Header/>
  <!-- <div id='nav'>
    <router-link to='/'>Home</router-link> |
    <router-link to='/about'>About</router-link>
  </div> -->
  <router-view/>
  <Footer/>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/layout/Footer.vue';
import Header from '@/components/layout/Header.vue';

export default {
  components: {
    Footer,
    Header,
  },
};
</script>
