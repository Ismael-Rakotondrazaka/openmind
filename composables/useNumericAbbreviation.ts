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
      maximumFractionDigits: 2,
      ...options,
      notation: "compact",
      compactDisplay: "short",
    };

    return new Intl.NumberFormat("en-US", toValue(optionsObject));
  });

  const formattedNumber = computed(() => {
    const parts = formatter.value.formatToParts(toValue(value));
    const lastPart = parts.pop();

    if (lastPart?.type === "integer" && lastPart.value.length > 4) {
      const order = Math.floor(
        Math.log(Math.abs(toValue(value))) / Math.log(1000),
      );
      const suffixes = ["", "K", "M", "B", "T"];
      lastPart.value = `${lastPart.value.slice(0, lastPart.value.length - 3)}${suffixes[order]}`;
    }

    return parts
      .concat(lastPart ?? [])
      .map((part) => part.value)
      .join("");
  });

  return formattedNumber;
}
