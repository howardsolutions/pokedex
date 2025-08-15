import { Cache } from './pokecache';

export class PokeAPI {
    private static readonly baseURL = "https://pokeapi.co/api/v2";
    private cache: Cache;
    private cacheHits = 0;
    private cacheMisses = 0;

    constructor(cache: Cache) {
        this.cache = cache;
    }

    async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
        const url = pageURL || `${PokeAPI.baseURL}/location-area/`;
        
        console.log(`\n🔍 Requesting locations data...`);
        
        // Check cache first
        const cached = this.cache.get(url);
        if (cached) {
            this.cacheHits++;
            const age = Date.now() - cached.createdAt;
            console.log(`✅ CACHE HIT! Using cached data (age: ${Math.round(age / 1000)}s)`);
            console.log(`📊 Cache stats: ${this.cacheHits} hits, ${this.cacheMisses} misses`);
            return cached.val;
        }

        // Make request if not in cache
        this.cacheMisses++;
        console.log(`⏳ CACHE MISS! Fetching fresh data from API...`);
        
        const startTime = Date.now();
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const fetchTime = Date.now() - startTime;
        
        // Add to cache
        this.cache.add(url, data);
        console.log(`💾 Added to cache (fetch time: ${fetchTime}ms)`);
        console.log(`📊 Cache stats: ${this.cacheHits} hits, ${this.cacheMisses} misses`);
        
        return data;
    }

    async fetchLocation(locationName: string): Promise<Location> {
        const url = `${PokeAPI.baseURL}/location-area/${locationName}/`;
        
        console.log(`\n🔍 Requesting location data for: ${locationName}...`);
        
        // Check cache first
        const cached = this.cache.get(url);
        if (cached) {
            this.cacheHits++;
            const age = Date.now() - cached.createdAt;
            console.log(`✅ CACHE HIT! Using cached data (age: ${Math.round(age / 1000)}s)`);
            console.log(`📊 Cache stats: ${this.cacheHits} hits, ${this.cacheMisses} misses`);
            return cached.val;
        }

        // Make request if not in cache
        this.cacheMisses++;
        console.log(`⏳ CACHE MISS! Fetching fresh data from API...`);
        
        const startTime = Date.now();
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const fetchTime = Date.now() - startTime;
        
        // Add to cache
        this.cache.add(url, data);
        console.log(`💾 Added to cache (fetch time: ${fetchTime}ms)`);
        console.log(`📊 Cache stats: ${this.cacheHits} hits, ${this.cacheMisses} misses`);
        
        return data;
    }

    getCacheStats() {
        return {
            hits: this.cacheHits,
            misses: this.cacheMisses,
            hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) * 100
        };
    }
}

export type ShallowLocations = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
        name: string;
        url: string;
    }>;
};

export type Location = {
    id: number;
    name: string;
    game_index: number;
    encounter_method_rates: Array<{
        encounter_method: {
            name: string;
            url: string;
        };
        version_details: Array<{
            rate: number;
            version: {
                name: string;
                url: string;
            };
        }>;
    }>;
    location: {
        name: string;
        url: string;
    };
    names: Array<{
        language: {
            name: string;
            url: string;
        };
        name: string;
    }>;
    pokemon_encounters: Array<{
        pokemon: {
            name: string;
            url: string;
        };
        version_details: Array<{
            encounter_details: Array<{
                chance: number;
                condition_values: Array<{
                    name: string;
                    url: string;
                }>;
                max_level: number;
                method: {
                    name: string;
                    url: string;
                };
                min_level: number;
            }>;
            max_chance: number;
            version: {
                name: string;
                url: string;
            };
        }>;
    }>;
};