import { IsNotEmpty, IsString, Length } from 'class-validator';

export class WeatherAutoCompleteDTO {
	@IsString({ message: 'Query parameter "q" is required and cannot be empty.' })
	@IsNotEmpty({ message: 'Query parameter "q" is required and cannot be empty.' })
	@Length(3, 50, { message: 'Query parameter "q" must be between 3 and 50 characters.' })
	q: string | undefined;
}
