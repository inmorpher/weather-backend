import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class WeatherAllDTO {
	@ValidateIf((o) => !o.lat || !o.lon)
	@IsString()
	@IsNotEmpty()
	q?: string;

	@ValidateIf((o) => !o.q)
	@IsString()
	@IsNotEmpty()
	lat?: string;

	@ValidateIf((o) => !o.q)
	@IsString()
	@IsNotEmpty()
	lon?: string;
}
