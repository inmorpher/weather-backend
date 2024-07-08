import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherByGeoDTO {
	@IsString({ message: 'Query parameter "lat" is required and cannot be empty.' })
	@IsNotEmpty({ message: 'Query parameter "lat" is required and cannot be empty.' })
	lat: string | undefined;

	@IsString({ message: 'Query parameter "lng" is required and cannot be empty.' })
	@IsNotEmpty({ message: 'Query parameter "lng" is required and cannot be empty.' })
	lon: string | undefined;
}
