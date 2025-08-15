import type { State } from "./state.js";

export async function commandCache(state: State): Promise<void> {
  console.log("\n📊 Cache Statistics");
  console.log("==================");
  
  const stats = state.pokeAPI.getCacheStats();
  console.log(`Cache Hits: ${stats.hits}`);
  console.log(`Cache Misses: ${stats.misses}`);
  console.log(`Hit Rate: ${stats.hitRate.toFixed(1)}%`);
  
  if (stats.hits + stats.misses === 0) {
    console.log("No cache activity yet. Try using 'map' or 'mapb' commands first!");
  } else if (stats.hitRate > 50) {
    console.log("🎯 Great cache performance! Most requests are being served from cache.");
  } else if (stats.hitRate > 20) {
    console.log("📈 Good cache performance. Some requests are being served from cache.");
  } else {
    console.log("🔄 Cache is working but most requests are still hitting the API.");
  }
  
  console.log("\n💡 Tip: Use 'map' and 'mapb' commands to see cache in action!");
  console.log("   First request will be slow (API call), subsequent requests will be fast (cache hit).");
}
