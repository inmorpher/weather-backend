import { AxiosInstance, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import { IGeoapifyResponse } from './geoapify.types';
import { IGeocodingResponse, IGeocodingService } from './geocoding.interface';

@injectable()
export class GeoapifyService implements IGeocodingService {
	constructor(@inject(TYPES.GeonamesAxiosInstance) private geoAPI: AxiosInstance) {}

	/**
	 * Performs a forward geocoding search to find a location by its address.
	 * @param {string} query - The address or location query to search for.
	 * @returns A Promise resolving to the geocoding result, including latitude, longitude, and other location details.
	 * @throws {HTTPError} Throws an HTTPError if the request fails.
	 */
	async forwardSearch(query: string) {
		try {
			const response: AxiosResponse<IGeoapifyResponse> = await this.geoAPI.get('/search', {
				params: {
					text: query,
					limit: 1,
				},
			});
			return this.convertData(response.data);
		} catch (error) {
			throw new HTTPError(error, 'GEOAPIFY SERVICE/FORWARD SEARCH', 'Internal server error');
		}
	}

	/**
	 * Performs a reverse geocoding search to find an address by its latitude and longitude.
	 * @param {number} lat - The latitude of the location.
	 * @param {number} lon - The longitude of the location.
	 * @returns A Promise resolving to the geocoding result, including address and location details.
	 * @throws {HTTPError} Throws an HTTPError if the request fails.
	 */
	async reverseSearch(lat: number | string, lon: number | string) {
		try {
			const response: AxiosResponse<IGeoapifyResponse> = await this.geoAPI.get('/reverse', {
				params: {
					lat,
					lon,
					limit: 1,
				},
			});

			return this.convertData(response.data);
		} catch (error) {
			throw new HTTPError(error, 'GEOAPIFY SERVICE/REVERSE SEARCH', 'Internal server error');
		}
	}

	async autocompleteSearch(query: string) {
		try {
			const response = await this.geoAPI.get('/autocomplete', {
				params: {
					text: query,
				},
			});
			return this.convertData(response.data);
		} catch (error) {
			throw new HTTPError(error, 'GEOAPIFY SERVICE/AUTOCOMPLETE SEARCH', 'Internal server error');
		}
	}

	/**
	 * Converts the raw Geoapify API response into a more usable format.
	 * @param {IGeoapifyResponse} data - The raw API response from Geoapify.
	 * @returns An object containing the formatted geocoding information.
	 */
	private convertData(data: IGeoapifyResponse) {
		const result = data.features
			.filter((feature) => feature.properties.city)
			.reduce<IGeocodingResponse[]>((acc, feature) => {
				const { lat, lon, city, country, country_code, state, state_code } = feature.properties;
				const exists = acc.some(
					(item) => item.city === city && item.country === country && item.state === state
				);
				if (!exists) {
					acc.push({
						lat: lat.toString(),
						lon: lon.toString(),
						city,
						country,
						countryCode: country_code,
						state,
						stateCode: state_code,
					});
				}
				return acc;
			}, []);

		return result;
	}
}
