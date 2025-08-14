export class PokeAPI {
    private static readonly baseURL = "https://pokeapi.co/api/v2";

    constructor() { }

    async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
        const url = pageURL || `${PokeAPI.baseURL}/location-area/`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    async fetchLocation(locationName: string): Promise<Location> {
        const url = `${PokeAPI.baseURL}/location-area/${locationName}/`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
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