import { ref, watchEffect } from "vue";

interface CurrenciesResponseItem {
  code: string;
  decimal_mark: string;
  id: number;
  name: string;
  precision: number;
  short_code: string;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  thousands_separator: string;
}

interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
}

export const useGetCurrencies = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const currencies = ref<CurrencyItem[]>();

  watchEffect(async () => {
    const response = await fetch(
      `https://api.currencybeacon.com/v1/currencies?api_key=${API_KEY}`
    );
    const json: CurrenciesResponseItem[] = await response.json();
    currencies.value = Object.values(json)
      .map((currency) => ({
        name: currency.name,
        symbol: currency.symbol,
        code: currency.short_code,
      }))
      .filter((item) => item.name);
  });

  return {
    currencies,
  };
};
