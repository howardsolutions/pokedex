import { createInterface, type Interface } from "readline";
import { getCommands } from "./command_registry.js";
import { PokeAPI } from "./pokeapi.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
};

export type State = {
  readline: Interface;
  commands: Record<string, CLICommand>;
  pokeAPI: PokeAPI;
  nextLocationsURL: string | null;
  prevLocationsURL: string | null;
};

export function initState(): State {
  // Create the readline interface
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Pokedex > '
  });

  // Get the command registry
  const commands = getCommands();

  // Initialize PokeAPI
  const pokeAPI = new PokeAPI();

  return {
    readline,
    commands,
    pokeAPI,
    nextLocationsURL: null,
    prevLocationsURL: null
  };
}
  