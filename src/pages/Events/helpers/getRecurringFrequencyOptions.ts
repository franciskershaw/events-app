import { Frequency } from "../../../types/globalTypes";

interface FrequencyOption {
  value: Frequency;
  label: string;
}

export const getFrequencyOptions = (): FrequencyOption[] => {
  const frequencies: Frequency[] = ["daily", "weekly", "monthly", "yearly"];

  return frequencies.map((freq) => ({
    value: freq,
    label: freq.charAt(0).toUpperCase() + freq.slice(1),
  }));
};
