export default defineI18nConfig(() => ({
  datetimeFormats: {
    en: {
      long: {
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        year: 'numeric',
      },
      short: {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
      },
    },
    fr: {
      long: {
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        year: 'numeric',
      },
      short: {
        day: 'numeric',
        month: 'numeric',
        year: '2-digit',
      },
    },
  },
  legacy: false,
  locale: 'fr',
  numberFormats: {
    en: {
      currency: {
        currency: 'EUR',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        notation: 'standard',
        style: 'currency',
      },
      decimal: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        style: 'decimal',
        useGrouping: true,
      },
      percent: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'percent',
        useGrouping: false,
      },
    },
    fr: {
      currency: {
        currency: 'EUR',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        notation: 'standard',
        style: 'currency',
      },
      decimal: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        style: 'decimal',
        useGrouping: true,
      },
      percent: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'percent',
        useGrouping: false,
      },
    },
  },
}));
