import { AxiosInstance, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import { IGeocodingResponse, IGeocodingService } from './geocoding.interface';
import { IOpenWeatherGeoResponse } from './openweathergeo.types';

@injectable()
export class OpenWeatherGeoService implements IGeocodingService {
	constructor(@inject(TYPES.OpenWeatherAxiosInstance) private geoAPI: AxiosInstance) {}

	async forwardSearch(query: string) {
		try {
			const response: AxiosResponse<IOpenWeatherGeoResponse[]> = await this.geoAPI.get(
				'/geo/1.0/direct',
				{
					params: {
						q: query,
						limit: 1,
					},
				}
			);

			return this.convertData(response.data);
		} catch (error) {
			throw new HTTPError(error, 'OPENWEATHERGEO SERVICE/FORWARD SEARCH', 'Internal server error');
		}
	}
	async reverseSearch(lat: string | number, lon: string | number) {
		try {
			const response: AxiosResponse<IOpenWeatherGeoResponse[]> = await this.geoAPI.get(
				'/geo/1.0/reverse',
				{
					params: {
						lat,
						lon,
						limit: 1,
					},
				}
			);

			return this.convertData(response.data);
		} catch (error) {
			throw new HTTPError(error, 'OPENWEATHERGEO SERVICE/REVERSE SEARCH', 'Internal server error');
		}
	}
	async autocompleteSearch(query: string) {
		try {
			const response: AxiosResponse<IOpenWeatherGeoResponse[]> = await this.geoAPI.get(
				'/geo/1.0/direct',
				{
					params: {
						q: query,
						limit: 15,
					},
				}
			);

			return this.convertData(response.data);
		} catch (error) {
			throw new HTTPError(error, 'OPENWEATHERGEO SERVICE/AUTOCOMPLETE', 'Internal server error');
		}
	}

	private convertData(data: IOpenWeatherGeoResponse[]) {
		const result = data.reduce<IGeocodingResponse[]>((acc, location) => {
			// Создание уникального ключа для каждой локации
			const uniqueKey = `${location.name}-${location.country}-${location.state || ''}`;
			// Проверка наличия этого ключа в аккумуляторе
			if (!acc.some((item) => `${item.city}-${item.country}-${item.state || ''}` === uniqueKey)) {
				acc.push({
					lat: location.lat.toString(),
					lon: location.lon.toString(),
					city: location.name,
					country: location.country,
					countryCode: location.country,
					state: location.state,
					stateCode: location.state,
				});
			}
			return acc;
		}, []);

		return result;
	}
}
