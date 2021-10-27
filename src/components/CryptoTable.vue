<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ $t('name') }}</th>
        <th>{{ $t('price') }}</th>
        <th>{{ $t('24h') }}</th>
        <th>{{ $t('7d') }}</th>
        <th>{{ $t('market-cap') }}</th>
        <th>{{ $t('volume') }}</th>
        <th>{{ $t('l7d') }}</th>
      </tr>
    </thead>
    <colgroup>
      <col style='width: 42px;'>
      <col style='width: 112px;'>
      <col style='width: 129px;'>
      <col style='width: 61px;'>
      <col style='width: 65px;'>
      <col style='width: 137px;'>
      <col style='width: 127px;'>
      <col style='width: 147px;'>
    </colgroup>
    <tbody>
      <tr v-for='item,index in data' :key='index'>
        <td>{{ item.market_cap_rank }}</td>
        <td>
          <img :src='item.image' :alt='item.symbol'>
          <div class='detail'>
            <div class='name'>{{ item.name }}</div>
            <div class='symbol'>{{ toUpperCase(item.symbol) }}</div>
          </div>
        </td>
        <td>{{ toUSD(item.current_price) }}</td>
        <td>{{ roundDecimal(item.price_change_percentage_24h_in_currency, 1) }}</td>
        <td>{{ roundDecimal(item.price_change_percentage_7d_in_currency, 1) }}</td>
        <td>{{ toUSD(item.market_cap) }}</td>
        <td>{{ toUSD(item.total_volume) }}</td>
      </tr>
    </tbody>
  </table>
  <div class='wrapper'>
    <v-pagination
      v-model='queryParams.page'
      :pages='pages'
      :range-size='1'
      active-color='#DCEDFF'
      @update:modelValue='updateHandler'
    />
  </div>
</template>

<script>
import {
  ref, onMounted,
  reactive,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VPagination from '@hennge/vue3-pagination';
import '@hennge/vue3-pagination/dist/vue3-pagination.css';

export default {
  name: 'CryptoTable',
  components: {
    VPagination,
  },
  setup() {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const pages = ref(100);
    const route = useRoute();
    const routePage = route.query.page;
    const router = useRouter();

    const queryParams = reactive({
      page: Number.isNaN(routePage) || routePage === undefined ? 1 : Number.parseInt(routePage, 10),
    });

    function fetchData() {
      loading.value = true;
      return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${queryParams.page}&sparkline=false&price_change_percentage=7d%2C24h`, {
        method: 'get',
        headers: {
          'content-type': 'application/json',
        },
      });
    }

    function fetchList() {
      return fetch('https://api.coingecko.com/api/v3/coins/list', {
        method: 'get',
        headers: {
          'content-type': 'application/json',
        },
      });
    }

    function toUSD(value) {
      return Number.isNaN(value) || value === null ? '-' : `$${value.toLocaleString()}`;
    }
    function roundDecimal(val, prec) {
      const result = Math.round(Math.round(val * 10 ** ((prec || 0) + 1)) / 10) / 10 ** (prec || 0);
      return `${result}%`;
    }

    function toUpperCase(string) {
      return string.toUpperCase();
    }

    function updateHandler(e) {
      queryParams.page = e;
      router.push({ path: '/', query: { page: e } });
      fetchData().then((res) => res.json()).then((items) => {
        data.value = items;
        loading.value = false;
      });
    }

    onMounted(() => {
      Promise.all([
        fetchList(),
        fetchData(),
      ]).then(async ([listRes, dataRes]) => {
        const list = await listRes.json();
        const items = await dataRes.json();
        return [list, items];
      }).then(([list, items]) => {
        data.value = items;
        loading.value = false;
        pages.value = Math.ceil(list.length / 100);
      });
    });

    return {
      data,
      loading,
      error,
      pages,
      toUSD,
      roundDecimal,
      toUpperCase,
      updateHandler,
      queryParams,
    };
  },
};
</script>

<style scoped lang='scss'>
  table {
    min-width: 821px;
    th {
      font-family: Helvetica-Bold;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    td {
      font-family: Helvetica;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 400;
      padding: 20px 0px;
    }

    th, td {
      &:nth-child(1),
      &:nth-child(4),
      &:nth-child(5) {
        text-align: center;
      }
      &:nth-child(2) {
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
        }
        .detail {
          margin-left: 7px;
          .symbol {
            font-family: Helvetica;
            font-size: 12px;
            color: #929292;
            letter-spacing: 0;
            font-weight: 400;
            margin-top: 2px;
          }

          .name {
            font-family: Helvetica-Bold;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            font-weight: 700;
          }
        }
      }
      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(7),
      &:nth-child(8) {
        text-align: right;
      }
    }
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
