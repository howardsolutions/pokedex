import { Cache } from './dist/pokecache.js';
import { PokeAPI } from './dist/pokeapi.js';

async function testCache() {
  console.log('🧪 Testing Cache Functionality\n');
  
  // Create a cache with 10 second expiration
  const cache = new Cache(10000);
  const api = new PokeAPI(cache);
  
  let time1 = 0;
  let time2 = 0;
  
  console.log('=== First Request (Cache Miss) ===');
  const start1 = Date.now();
  try {
    const locations1 = await api.fetchLocations();
    time1 = Date.now() - start1;
    console.log(`✅ First request completed in ${time1}ms`);
    console.log(`   Found ${locations1.results.length} locations\n`);
  } catch (error) {
    console.error('❌ First request failed:', error.message);
    return;
  }
  
  console.log('=== Second Request (Cache Hit) ===');
  const start2 = Date.now();
  try {
    const locations2 = await api.fetchLocations();
    time2 = Date.now() - start2;
    console.log(`✅ Second request completed in ${time2}ms`);
    console.log(`   Found ${locations2.results.length} locations\n`);
  } catch (error) {
    console.error('❌ Second request failed:', error.message);
    return;
  }
  
  console.log('=== Cache Statistics ===');
  const stats = api.getCacheStats();
  console.log(`Cache Hits: ${stats.hits}`);
  console.log(`Cache Misses: ${stats.misses}`);
  console.log(`Hit Rate: ${stats.hitRate.toFixed(1)}%`);
  
  if (time2 < time1 * 0.1) {
    console.log('\n🎯 SUCCESS: Cache is working! Second request was much faster.');
  } else {
    console.log('\n⚠️  Cache might not be working as expected.');
  }
  
  // Clean up
  cache.stopReapLoop();
}

testCache().catch(console.error);
