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
      <col style="width: 42px;">
      <col style="width: 112px;">
      <col style="width: 129px;">
      <col style="width: 61px;">
      <col style="width: 65px;">
      <col style="width: 137px;">
      <col style="width: 127px;">
      <col style="width: 147px;">
    </colgroup>
    <tbody>
      <tr v-for="item,index in data" :key="index">
        <td>{{ item.market_cap_rank }}</td>
        <td>
          <img :src="item.image" :alt="item.symbol">
          <div class="detail">
            <div class="name">{{ item.name }}</div>
            <div class="symbol">{{ toUpperCase(item.symbol) }}</div>
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
</template>

<script>
import {
  ref, onMounted,
  reactive, watchEffect,
} from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'CryptoTable',
  setup() {
    const data = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const route = useRoute();

    const queryParams = reactive({
      page: route.query.page || 1,
      // anotherLocale: computed(() => locales.find((el) => el.value !== locale.value)),
    });

    watchEffect(() => console.log(queryParams.page));

    function fetchData() {
      loading.value = true;
      return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${queryParams.page}&sparkline=false&price_change_percentage=7d%2C24h`, {
        method: 'get',
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => {
          // a non-200 response code
          if (!res.ok) {
            // create error instance with HTTP status text
            const resError = new Error(res.statusText);
            resError.json = res.json();
            throw error;
          }

          return res.json();
        })
        .then((json) => {
          data.value = json;
        })
        .catch((err) => {
          error.value = err;
          // In case a custom JSON error response was provided
          if (err.json) {
            return err.json.then((json) => {
              // set the JSON response message
              error.value.message = json.message;
            });
          }
          return err;
        })
        .then(() => {
          loading.value = false;
        });
    }
    function toUSD(value) {
      return `$${value.toLocaleString()}`;
    }
    function roundDecimal(val, prec) {
      const result = Math.round(Math.round(val * 10 ** ((prec || 0) + 1)) / 10) / 10 ** (prec || 0);
      return `${result}%`;
    }

    function toUpperCase(string) {
      return string.toUpperCase();
    }

    onMounted(() => {
      fetchData();
    });

    return {
      data,
      loading,
      error,
      toUSD,
      roundDecimal,
      toUpperCase,
    };
  },
};
</script>

<style scoped lang="scss">
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
</style>
