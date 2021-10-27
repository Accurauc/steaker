<template>
  <footer>
      <div>Proudly powered by Steaker © 2021 Steaker. All rights reserved.</div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped lang="scss">
 footer {
  background:  #000000;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    font-family: Helvetica;
    font-size: 14px;
    color: #A0A0A0;
    font-weight: 400;
  }
}
</style>
