export interface IOpenWeatherGeoResponse {
	name: string;
	lat: number;
	lon: number;
	country: string;
	countryCode?: string;
	state: string;
	stateCode?: string;
}
