export function cleanInput(input: string): string[] {
  const words = input.split(' ');
  // const results: string[] = []

  // for (const word of words) {
  //     results.push(word.trim().toLocaleLowerCase())
  // }

  return words
    .map(word => word.trim().toLocaleLowerCase())
    .filter(word => word !== '');
}