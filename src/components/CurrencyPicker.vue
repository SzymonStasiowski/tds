<template>
  <div class="currency-picker">
    <Autocomplete
      :currencies="currencies"
      :currency="autocompleteCurrency"
      :label="label"
      @update:currency="handleCurrencyChange" 
    />
    <input type="number" :value="currency.value" @change="(e) => handleValueChange((e.target as HTMLInputElement).valueAsNumber)" min="0"></input>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Autocomplete from "./Autocomplete.vue";
import type { CurrencyPickerProps, CurrencyState } from "../types";

const { currencies, currency, label } = defineProps<CurrencyPickerProps>();
const emit = defineEmits(['update:currency', 'update:value']);

const handleCurrencyChange = (newCurrency: CurrencyState) => {
  emit('update:currency', newCurrency);
};

const handleValueChange = (newValue: number) => {
  emit('update:value', newValue);
};

const autocompleteCurrency = computed(() => ({
  name: currency.name,
  symbol: currency.symbol,
  code: currency.code,
}));
</script>

<style scoped>
.currency-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
