<template>
  <Header/>
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

<style lang="scss">

#app {
  position: relative;
}

</style>
