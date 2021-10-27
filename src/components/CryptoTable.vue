<template>
  <table>
    <thead>
      <tr>
        <th :class="handleThClass('rank')"
            @click="handleChangeSort('rank')">#</th>
        <th :class="handleThClass('name')"
            @click="handleChangeSort('name')">{{ $t('name') }}</th>
        <th :class="handleThClass('price')"
            @click="handleChangeSort('price')">{{ $t('price') }}</th>
        <th :class="handleThClass('24h')"
            @click="handleChangeSort('24h')">{{ $t('24h') }}</th>
        <th :class="handleThClass('7d')"
            @click="handleChangeSort('7d')">{{ $t('7d') }}</th>
        <th :class="handleThClass('marketCap')"
            @click="handleChangeSort('marketCap')">{{ $t('market-cap') }}</th>
        <th :class="handleThClass('volume')"
            @click="handleChangeSort('volume')">{{ $t('volume') }}</th>
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
      <col style='width: 197px;'>
    </colgroup>
    <tbody>
      <tr v-for='item,index in state.sortedData' :key='index'>
        <td>{{ item.market_cap_rank }}</td>
        <td>
          <img :src='item.image' :alt='item.symbol'>
          <div class='detail'>
            <div class='name'>{{ item.name }}</div>
            <div class='symbol'>{{ toUpperCase(item.symbol) }}</div>
          </div>
        </td>
        <td>{{ toUSD(item.current_price) }}</td>
        <td class="trian" :class="item.price_change_percentage_24h_in_currency > 0 ? 'up' : 'down'">
          {{ roundDecimal(item.price_change_percentage_24h_in_currency, 1) }}</td>
        <td class="trian" :class="item.price_change_percentage_7d_in_currency > 0 ? 'up' : 'down'">
          {{ roundDecimal(item.price_change_percentage_7d_in_currency, 1) }}</td>
        <td>{{ toUSD(item.market_cap) }}</td>
        <td>{{ toUSD(item.total_volume) }}</td>
        <td><LineChart
                :dataset="item.sparkline_in_7d.price"
                :color="item.price_change_percentage_7d_in_currency > 0 ? '#16C784' : '#EA3943'"
                :index='index'/>
        </td>
      </tr>
    </tbody>
  </table>
  <div class='wrapper'>
    <v-pagination
      v-model='state.page'
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
  reactive, computed,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VPagination from '@hennge/vue3-pagination';
import '@hennge/vue3-pagination/dist/vue3-pagination.css';
import LineChart from '@/components/LineChart.vue';

export default {
  name: 'CryptoTable',
  components: {
    VPagination,
    LineChart,
  },
  setup() {
    const data = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const pages = ref(100);
    const sortBy = ref({
      sort: 'market_cap_rank',
      order: true,
    });
    const route = useRoute();
    const { query, path, hash } = route;
    const router = useRouter();
    const sortMapper = new Map([
      ['rank', 'market_cap_rank'],
      ['name', 'name'],
      ['price', 'current_price'],
      ['24h', 'price_change_percentage_24h_in_currency'],
      ['7d', 'price_change_percentage_7d_in_currency'],
      ['marketCap', 'market_cap'],
      ['volume', 'total_volume'],
    ]);

    const state = reactive({
      page: Number.isNaN(query.page)
            || query.page === undefined ? 1 : Number.parseInt(query.page, 10),
      sortedData: computed(() => [...data.value].sort((a, b) => {
        let aValue = a[sortBy.value.sort];
        let bValue = b[sortBy.value.sort];
        if (sortBy.value.sort === 'name') {
          aValue = aValue.toUpperCase();
          bValue = bValue.toUpperCase();

          if (sortBy.value.order) {
            if (aValue > bValue) return -1;
            if (bValue > aValue) return 1;
          } else {
            if (aValue > bValue) return 1;
            if (bValue > aValue) return -1;
          }
        }

        if (sortBy.value.sort === 'market_cap_rank') {
          if (sortBy.value.order) {
            return aValue - bValue;
          }
          return bValue - aValue;
        }
        if (sortBy.value.order) {
          return bValue - aValue;
        }
        return aValue - bValue;
      })),
    });

    function fetchData() {
      loading.value = true;
      return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${state.page}&sparkline=true&price_change_percentage=7d%2C24h`, {
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
      return Number.isNaN(value) || value === null ? '-' : `${value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 8 })}`;
    }
    function roundDecimal(val, prec) {
      const result = Math.round(Math.round(val * 10 ** ((prec || 0) + 1)) / 10) / 10 ** (prec || 0);
      return `${Math.abs(result)}%`;
    }

    function toUpperCase(string) {
      return string.toUpperCase();
    }

    function updateHandler(e) {
      state.page = e;
      router.push({ path, hash, query: { page: e } });
      fetchData().then((res) => res.json()).then((items) => {
        data.value = items;
        loading.value = false;
      });
    }

    function handleChangeSort(sort) {
      const key = sortMapper.get(sort);
      if (sortBy.value.sort === key) {
        sortBy.value = {
          sort: key,
          order: !sortBy.value.order,
        };
      } else {
        sortBy.value = {
          sort: key,
          order: true,
        };
      }
    }

    function handleThClass(sort) {
      const key = sortMapper.get(sort);
      if (sortBy.value.sort === key) {
        if (sortBy.value.order) {
          return 'desc';
        }
        return 'asc';
      }

      return '';
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
      sortBy,
      roundDecimal,
      toUpperCase,
      updateHandler,
      state,
      handleChangeSort,
      handleThClass,
    };
  },
};
</script>

<style scoped lang='scss'>
  table {
    margin: auto;
    min-width: 871px;
    th {
      font-family: Helvetica-Bold;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 14px;
      font-weight: 700;
      cursor: pointer;

      &.desc::after,
      &.asc::after {
        display: inline-block;
        vertical-align: middle;
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        margin-left: 3px;
      }

      &.desc::after {
        border-width: 5px 4px 0 4px;
        border-color: #FFFFFF transparent transparent transparent;
      }

      &.asc::after {
        border-width: 0px 4px 5px 4px;
        border-color: transparent transparent #FFFFFF transparent;
      }
    }
    td {
      font-family: Helvetica;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      font-weight: 400;
      padding: 20px 0px;

      &.trian {
        &::before {
            display: inline-block;
            vertical-align: middle;
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            margin-right: 3px;
        }
        &.up {
          color: #16C784;
          &::before {
            border-width: 0px 4px 5px 4px;
            border-color: transparent transparent #16C784 transparent;
          }
        }

        &.down {
          color: #EA3943;
          &::before {
            border-width: 5px 4px 0 4px;
            border-color: #EA3943 transparent transparent transparent;
          }
        }
      }
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
