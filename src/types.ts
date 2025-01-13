export interface CurrencyItem {
  code?: string;
  name?: string;
  symbol?: string;
}

export interface AutocompleteProps {
  currencies?: CurrencyItem[];
  currency?: CurrencyItem;
  label: string;
}

export interface CurrencyState extends CurrencyItem {
  value?: number | null;
}

export type CurrencyPickerProps = Omit<AutocompleteProps, "currency"> & {
  currency: CurrencyState;
};
