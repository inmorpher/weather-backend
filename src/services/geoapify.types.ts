export interface IGeoapifyResponse {
	type: string;
	features: IFeature[];
	query: IQuery;
}

export interface IFeature {
	type: string;
	properties: IProperties;
	geometry: IGeometry;
	bbox: number[];
}

export interface IGeometry {
	type: string;
	coordinates: number[];
}

export interface IProperties {
	datasource: IDatasource;
	country: string;
	country_code: string;
	state: string;
	county: string;
	city: string;
	lon: number;
	lat: number;
	state_code: string;
	result_type: string;
	formatted: string;
	address_line1: string;
	address_line2: string;
	category: string;
	timezone: ITimezone;
	plus_code: string;
	plus_code_short: string;
	rank: IRank;
	place_id: string;
}

export interface IDatasource {
	sourcename: string;
	attribution: string;
	license: string;
	url: string;
}

export interface IRank {
	importance: number;
	popularity: number;
	confidence: number;
	confidence_city_level: number;
	match_type: string;
}

export interface ITimezone {
	name: string;
	offset_STD: string;
	offset_STD_seconds: number;
	offset_DST: string;
	offset_DST_seconds: number;
	abbreviation_STD: string;
	abbreviation_DST: string;
}

export interface IQuery {
	text: string;
	parsed: IParsed;
}

export interface IParsed {
	city: string;
	expected_type: string;
}
