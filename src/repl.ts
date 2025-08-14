import type { State } from "./state.js";

export function startREPL(state: State) {
  // display the prompt
  state.readline.prompt();

  state.readline.on("line", async (line: string) => {
    const cleanedInputs = cleanInput(line);

    if (cleanedInputs.length == 0) {
      state.readline.prompt();
      return;
    }
    
    const commandName = cleanedInputs[0];
    const command = state.commands[commandName];
    
    if (command) {
      try {
        await command.callback(state);
      } catch (error) {
        console.error("Error executing command:", error);
      }
    } else {
      console.log("Unknown command");
    }
    
    state.readline.prompt();
  });

  // Handle process exit to close readline properly
  state.readline.on("close", () => {
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