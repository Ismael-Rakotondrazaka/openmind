import { computed, type MaybeRefOrGetter, toValue } from "vue";

type FormatOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function useNumericAbbreviation(
  value: MaybeRefOrGetter<number>,
  options?: FormatOptions,
) {
  const formatter = computed(() => {
    const optionsObject: Intl.NumberFormatOptions = {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      ...options,
      notation: "compact",
      compactDisplay: "short",
    };

    return new Intl.NumberFormat("en-US", toValue(optionsObject));
  });

  const formattedNumber = computed<string>(() => {
    const rawValue = toValue(value);

    if (rawValue > 999) {
      const parts = formatter.value.formatToParts(rawValue);
      const lastPart = parts.pop();

      if (lastPart?.type === "integer" && lastPart.value.length > 4) {
        const order = Math.floor(Math.log(Math.abs(rawValue)) / Math.log(1000));
        const suffixes = ["", "K", "M", "B", "T"];
        lastPart.value = `${lastPart.value.slice(0, lastPart.value.length - 3)}${suffixes[order]}`;
      }

      return parts
        .concat(lastPart ?? [])
        .map((part) => part.value)
        .join("");
    } else {
      return `${Math.floor(rawValue)}`;
    }
  });

  return formattedNumber;
}
