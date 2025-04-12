

export function formatCurrency(value: number, currency = "EUR", locale = "de-DE") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("de-DE");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}


export const supportedCurrencies = Intl.supportedValuesOf("currency")


export function formatCurrencyFromCents(amountInCents: number, currency: string, locale = "de-DE") {
  const fractionDigits = getCurrencyFractionDigits(currency);
  const amount = amountInCents / Math.pow(10, fractionDigits);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}
function getCurrencyFractionDigits(currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).resolvedOptions().maximumFractionDigits ?? 2;
}
