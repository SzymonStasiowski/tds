<template>
  <div class="currency-calculator">
    <div v-if="error.value" class="error-message">
      {{ error }}
    </div>

    <div v-if="shouldDisplaySummary" class="summary">
      <div v-if="isLoading.value" class="loading">Converting...</div>
      <template v-else>
        <span class="summary__from-currency">
          {{ `${fromCurrency.value?.toFixed(2)} ${fromCurrency.name} = ` }}
        </span>
        <mark>
          <span class="summary__to-currency">
            {{ `${toCurrency.value?.toFixed(2)} ${toCurrency.name}` }}
          </span>
        </mark>
      </template>
    </div>

    <div class="inputs">
      <CurrencyPicker
        :currencies="currencies"
        :currency="fromCurrency"
        :label="'From'"
        :disabled="isLoading"
        @update:currency="handleFromCurrencyChange"
        @update:value="handleFromValueChange"
      />
      <CurrencyPicker
        :currencies="currencies"
        :currency="toCurrency"
        :label="'To'"
        :disabled="isLoading"
        @update:currency="handleToCurrencyChange"
        @update:value="handleToValueChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import CurrencyPicker from "./CurrencyPicker.vue";
import { useGetCurrencies } from "../composables/useGetCurrencies";
import type { CurrencyState } from "../types";
import { useConvertCurrency } from "../composables/useConvertCurrency";

const { currencies } = useGetCurrencies();

const fromCurrency = ref<CurrencyState>({
  code: "",
  name: "",
  value: null,
});

const toCurrency = ref<CurrencyState>({
  code: "",
  name: "",
  value: null,
});

const fromCode = computed(() => fromCurrency.value.code);
const toCode = computed(() => toCurrency.value.code);
const fromAmount = computed(() => fromCurrency.value.value);
const toAmount = computed(() => toCurrency.value.value);

const {
  convertedValue: convertedToValue,
  isLoading: isLoadingToConversion,
  error: toConversionError,
  convert: convertFrom,
} = useConvertCurrency(fromCode, toCode, fromAmount);

const {
  convertedValue: convertedFromValue,
  isLoading: isLoadingFromConversion,
  error: fromConversionError,
  convert: convertTo,
} = useConvertCurrency(toCode, fromCode, toAmount);

const isLoading = computed(
  () => isLoadingToConversion || isLoadingFromConversion
);

const error = computed(() => toConversionError || fromConversionError);

const handleFromCurrencyChange = async (newCurrency: CurrencyState) => {
  fromCurrency.value = { ...fromCurrency.value, ...newCurrency };
  await convertFrom();
  toCurrency.value = { ...toCurrency.value, value: convertedToValue.value };
};

const handleToCurrencyChange = async (newCurrency: CurrencyState) => {
  toCurrency.value = { ...toCurrency.value, ...newCurrency };
  await convertFrom();
  toCurrency.value = { ...toCurrency.value, value: convertedToValue.value };
};

const handleFromValueChange = async (newValue: number) => {
  fromCurrency.value = { ...fromCurrency.value, value: newValue };
  await convertFrom();
  toCurrency.value = { ...toCurrency.value, value: convertedToValue.value };
};

const handleToValueChange = async (newValue: number) => {
  toCurrency.value = { ...toCurrency.value, value: newValue };
  await convertTo();
  fromCurrency.value = {
    ...fromCurrency.value,
    value: convertedFromValue.value,
  };
};

const shouldDisplaySummary = computed(
  () => fromCode.value && toCode.value && fromAmount.value && toAmount.value
);
</script>

<style scoped>
.currency-calculator {
  padding: 16px;
}

.inputs {
  display: flex;
  gap: 16px;
}

.summary {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 16px;
}

.summary__from-currency {
  font-size: 18px;
  line-height: 22px;
  font-weight: 400;
}

.summary__to-currency {
  font-size: 28px;
  line-height: 32px;
  font-weight: 600;
}

.error-message {
  color: #dc2626;
  padding: 8px;
  margin-bottom: 16px;
  background-color: #fee2e2;
  border-radius: 4px;
}

.loading {
  font-size: 18px;
  color: #6b7280;
  font-style: italic;
}
</style>
