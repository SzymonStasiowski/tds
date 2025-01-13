<template>
  <div ref="autocomplete" class="autocomplete">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="USD / $ / Dollar"
      class="search-input"
      @focus="isOpen = true"
    />
    <ul v-show="isOpen" class="dropdown">
      <li
        v-for="currency in filteredCurrencies"
        class="dropdown-item"
        @click="selectItem(currency)"
      >
        <strong
          >{{ currency.code }} <mark>{{ currency.symbol }}</mark></strong
        >
        <span>
          {{ currency.name }}
        </span>
      </li>
      <li
        v-if="filteredCurrencies?.length === 0"
        class="dropdown-item disabled"
      >
        No results found
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import type { AutocompleteProps, CurrencyItem } from "../types";

const { currencies } = defineProps<AutocompleteProps>();
const emit = defineEmits(["update:currency"]);
const isOpen = ref(false);
const autocompleteRef = useTemplateRef("autocomplete");
const searchTerm = ref<string>();
const selectedOption = ref();

const filteredCurrencies = computed(() => {
  if (!searchTerm.value) {
    return currencies;
  }
  const search = searchTerm.value.trim().toLowerCase();
  return currencies?.filter((currency) => {
    return (
      currency.code?.toLowerCase().includes(search) ||
      currency.name?.toLowerCase().includes(search) ||
      currency.symbol?.toLowerCase().includes(search)
    );
  });
});

const selectItem = (currency: CurrencyItem) => {
  selectedOption.value = currency;
  searchTerm.value = `${currency.code} ${currency.symbol} - ${currency.name}`;
  emit("update:currency", currency);
  isOpen.value = false;
};

const hideMenu = (event: Event) => {
  if (!autocompleteRef.value?.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", hideMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", hideMenu);
});
</script>

<style scoped>
.autocomplete {
  width: 300px;
}

.search-input {
  background-color: var(--background-color);
}

.dropdown {
  height: auto;
  max-height: 320px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0;
  transition: border-color 200ms ease-in;

  &:hover {
    border-color: var(--text-color);
  }
}

.dropdown-item {
  text-overflow: ellipsis;
  height: 32px;
  overflow: hidden;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: var(--search-background-color);
  }
}
</style>
