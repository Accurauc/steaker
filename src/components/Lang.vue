<template>
  <div class="wrapper">
    <div @click="handleLocaleClick" class="lang-select current-locale">
      <span class="label">{{ state.targetLocale.label }}</span>
      <span class="triangle"></span>
    </div>
    <div v-if="this.isOpen"
      @click="handleChangeLanguage(state.anotherLocale), handleLocaleClick()"
      class="lang-select">
      <span class="label">{{ state.anotherLocale.label }}</span>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  props: {
  },
  data() {
    return {
      isOpen: false,
    };
  },
  setup() {
    const locales = [
      {
        label: 'EN',
        value: 'en',
      },
      {
        label: '繁體',
        value: 'zh',
      },
    ];
    const { locale } = useI18n();
    const handleChangeLanguage = (e) => {
      locale.value = e.value;
    };
    const state = reactive({
      locale: locale.value,
      targetLocale: computed(() => locales.find((el) => el.value === locale.value)),
      anotherLocale: computed(() => locales.find((el) => el.value !== locale.value)),
    });

    return {
      state,
      handleChangeLanguage,
    };
  },
  methods: {
    handleLocaleClick() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}
.lang-select {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #ffffff;
  width: 43px;
  padding: 7px 10px 7px 15px;
  position: relative;
  cursor: pointer;
  color: #ffffff;
  background: #17171A;

  &:not(.current-locale) {
    position: absolute;
    top: 31px;
    left: 0px;

    &:hover {
      color: #17171A;
      background: #ffffff;
    }
  }

  span.label {
    display: inline-block;
    font-family: Helvetica;
    font-size: 14px;
    color: inherit;
    font-weight: 400;
  }

  span.triangle {
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    border-color: #ffffff transparent transparent transparent;
  }
}

</style>
