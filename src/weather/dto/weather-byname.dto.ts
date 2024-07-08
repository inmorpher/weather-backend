import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherByNameDTO {
	@IsString({ message: 'Query parameter "q" is required and cannot be empty.' })
	@IsNotEmpty({ message: 'Query parameter "q" is required and cannot be empty.' })
	q: string | undefined;
}
