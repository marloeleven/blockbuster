export const peso = (number: number) =>
  new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(number);

export default peso;
