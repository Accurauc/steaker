<template>
  <header>
      <img src="../../assets/img/steaker-logo.png" alt="steaker-logo">
      <Lang />
  </header>
</template>

<script>
import Lang from '../Lang.vue';

export default {
  name: 'Header',
  components: {
    Lang,
  },
};
</script>

<style scoped lang="scss">
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 53px;
    border-bottom: 1px solid #ffffff;

    img {
      width: 190px;
    }
}
</style>
