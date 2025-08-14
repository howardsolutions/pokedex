import { createInterface } from "readline";
import { getCommands } from "./command_registry.js";
export function startREPL() {
    // Readline interface
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Pokedex > '
    });
    // Get the command registry
    const commands = getCommands();
    // display the prompt
    rl.prompt();
    rl.on("line", (line) => {
        const cleanedInputs = cleanInput(line);
        if (cleanedInputs.length == 0) {
            rl.prompt();
            return;
        }
        const commandName = cleanedInputs[0];
        const command = commands[commandName];
        if (command) {
            try {
                command.callback(commands);
            }
            catch (error) {
                console.error("Error executing command:", error);
            }
        }
        else {
            console.log("Unknown command");
        }
        rl.prompt();
    });
    // Handle process exit to close readline properly
    rl.on("close", () => {
        process.exit(0);
    });
}
export function cleanInput(input) {
    const words = input.split(' ');
    // const results: string[] = []
    // for (const word of words) {
    //     results.push(word.trim().toLocaleLowerCase())
    // }
    return words
        .map(word => word.trim().toLocaleLowerCase())
        .filter(word => word !== '');
}
