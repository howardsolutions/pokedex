import { createInterface, type Interface } from "readline";
import { getCommands } from "./command_registry.js";
import { PokeAPI } from "./pokeapi.js";
import { Cache } from "./pokecache.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
};

export type State = {
  readline: Interface;
  commands: Record<string, CLICommand>;
  pokeAPI: PokeAPI;
  cache: Cache;
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

  // Initialize Cache with 5 minute expiration
  const cache = new Cache(5 * 60 * 1000);

  // Initialize PokeAPI with cache
  const pokeAPI = new PokeAPI(cache);

  return {
    readline,
    commands,
    pokeAPI,
    cache,
    nextLocationsURL: null,
    prevLocationsURL: null
  };
}
  