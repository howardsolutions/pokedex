import type { State } from "./state.js";

export async function commandMapBack(state: State): Promise<void> {
  try {
    if (!state.prevLocationsURL) {
      console.log("No previous locations to show. Use 'map' first to explore locations.");
      return;
    }
    
    const locations = await state.pokeAPI.fetchLocations(state.prevLocationsURL);
    
    // Display the location names
    for (const location of locations.results) {
      console.log(location.name);
    }
    
    // Update pagination URLs in state
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
    
    // Show pagination info
    if (locations.next) {
      console.log(`\nType 'map' to see the next ${Math.min(20, locations.count)} locations.`);
    }
    if (locations.previous) {
      console.log("Type 'mapb' again to go back to previous locations.");
    }
    
  } catch (error) {
    console.error("Error fetching previous locations:", error);
  }
}
