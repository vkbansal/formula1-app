export function formatPosition(position: number): string {
  if (typeof position !== 'number') {
    throw new TypeError(
      `Expected type "number" but got "${typeof position}"  instead. Given ${position}`
    );
  }
  switch (position) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    default:
      return `${position}th`;
  }
}
