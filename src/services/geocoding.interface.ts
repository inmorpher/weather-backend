export interface IGeocodingResponse {
	lat: string;
	lon: string;
	city: string;
	country: string;
	countryCode: string;
	state: string;
	stateCode: string;
}

export interface IGeocodingService {
	forwardSearch(query: string): Promise<IGeocodingResponse[]>;
	reverseSearch(lat: number | string, lon: number | string): Promise<IGeocodingResponse[]>;
	autocompleteSearch(query: string): Promise<IGeocodingResponse[]>;
}
