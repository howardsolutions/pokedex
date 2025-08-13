import { createInterface } from "readline";

export function startREPL() {
  // Readline interface
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Pokedex > '
  })

  // display the prompt
  rl.prompt();

  rl.on("line", (line) => {
    console.log(`Received: ${line}`);

    const cleanedInputs = cleanInput(line);

    if (cleanedInputs.length == 0) {
      rl.prompt();
      return;
    }
    
    console.log(`Your command was: ${cleanedInputs[0]}`);
    rl.prompt();
  });

  // Handle process exit to close readline properly
  rl.on("close", () => {
    process.exit(0);
  });
}

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