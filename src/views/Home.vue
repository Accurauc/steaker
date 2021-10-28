<template>
  <div class="home">
    <div class="title">{{ $t('title') }}</div>
    <CryptoTable />
  </div>
</template>

<script>
// @ is an alias to /src
import CryptoTable from '@/components/CryptoTable.vue';

export default {
  name: 'Home',
  components: {
    CryptoTable,
  },
};
</script>

<style scoped lang="scss">
.home {
  min-height: calc(100vh - 217px);
  margin: 53px 53px 80px 53px;
  overflow: auto;
}
.title {
  font-family: Helvetica-Bold;
  font-size: 24px;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 700;
  margin-bottom: 35px;
}

@media screen and (max-width: 414px) {
  .home{
    margin: 38px 16px 60px 16px;
  }
  .title {
    white-space: break-spaces;
  }
}
</style>
