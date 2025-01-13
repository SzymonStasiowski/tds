import { ref, type Ref } from "vue";

export const useConvertCurrency = (
  from: Ref<string | null | undefined>,
  to: Ref<string | null | undefined>,
  amount: Ref<number | null | undefined>
) => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const convertedValue = ref<number | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const convert = async () => {
    if (!from.value || !to.value || !amount.value) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `${BASE_URL}/convert?api_key=${API_KEY}&from=${from.value}&to=${to.value}&amount=${amount.value}`
      );

      if (!response.ok) throw new Error("Conversion failed");

      const data = await response.json();
      convertedValue.value = Number(data.value.toFixed(2));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    convertedValue,
    isLoading,
    error,
    convert,
  };
};
