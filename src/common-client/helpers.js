const ordinalSuffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th']
]);
const ordinalIntl = new Intl.PluralRules('en-IN', { type: 'ordinal' });

export function formatOrdinals(n) {
  return `${n}${ordinalSuffixes.get(ordinalIntl.select(n))}`;
}
