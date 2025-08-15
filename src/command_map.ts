import type { State } from "./state.js";

export async function commandMap(state: State): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log("🗺️  Fetching locations...");
    const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);
    
    // Display the location names
    for (const location of locations.results) {
      console.log(location.name);
    }
    
    // Update pagination URLs in state
    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;
    
    // Show pagination info
    if (locations.next) {
      console.log(`\nType 'map' again to see the next ${Math.min(20, locations.count)} locations.`);
    }
    if (locations.previous) {
      console.log("Type 'mapb' to go back to previous locations.");
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`\n⏱️  Total execution time: ${totalTime}ms`);
    
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
}
