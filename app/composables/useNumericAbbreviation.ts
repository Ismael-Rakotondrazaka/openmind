import { computed, type MaybeRefOrGetter, toValue } from 'vue';

type FormatOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export const toNumericAbbreviation = (
  value: number,
  options?: FormatOptions
) => {
  const optionsObject: Intl.NumberFormatOptions = {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    ...options,
    compactDisplay: 'short',
    notation: 'compact',
  };

  const numberFormat = new Intl.NumberFormat('en-US', toValue(optionsObject));

  if (value > 999) {
    const parts = numberFormat.formatToParts(value);
    const lastPart = parts.pop();

    if (lastPart?.type === 'integer' && lastPart.value.length > 4) {
      const order = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
      const suffixes = ['', 'K', 'M', 'B', 'T'];
      lastPart.value = `${lastPart.value.slice(0, lastPart.value.length - 3)}${suffixes[order]}`;
    }

    return parts
      .concat(lastPart ?? [])
      .map(part => part.value)
      .join('');
  } else {
    return `${Math.floor(value)}`;
  }
};

export const useNumericAbbreviation = (
  value: MaybeRefOrGetter<number>,
  options?: FormatOptions
) => {
  return computed<string>(() => toNumericAbbreviation(toValue(value), options));
};
