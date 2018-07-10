import axios from "axios";
const qs = require("qs");
import {
	baseURL,
	hash,
	ts,
	apikey,
	optionalChaining,
	CharacterWhereInput,
	CharacterOrderBy,
	ComicWhereInput,
	ComicOrderBy,
	CreatorWhereInput,
	CreatorOrderBy,
	EventsWhereInput,
	EventsOrderBy,
	SeriesWhereInput,
	SeriesOrderBy,
	StoriesWhereInput,
	StoriesOrderBy
} from "../utils";
import {
	formatConnection,
	orderByDirectory,
	formatEnum
} from "../utils/formatters";

const marvel = axios.create({
	baseURL
});

export default class MarvelApiModel {
	constructor() {}
	async createParams(args: any) {
		return await qs.stringify({ ...args, hash, ts, apikey });
	}
	getFormattedEnum(arg) {
		if (!arg) {
			return null;
		}
		return formatEnum[arg];
	}
	getOrderBy(arg, type) {
		if (!arg) {
			return null;
		}
		return orderByDirectory[type[arg]];
	}
	async characters(
		where: CharacterWhereInput,
		orderBy: CharacterOrderBy,
		offset: number,
		limit: number
	) {
		try {
			const params = await this.createParams({
				...where,
				orderBy: this.getOrderBy(orderBy, "characters"),
				offset,
				limit
			});

			const response = await marvel.get(`/characters?${params}`);
			return await formatConnection["characters"](response.data.data.results);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async comics(
		where: ComicWhereInput,
		orderBy: ComicOrderBy,
		offset: number,
		limit: number
	) {
		try {
			const format = optionalChaining(() => where.format)
				? this.getFormattedEnum(where.format)
				: null;
			const formatType = optionalChaining(() => where.formatType)
				? this.getFormattedEnum(where.formatType)
				: null;
			let input = { ...where };
			if (format) {
				input.format = format;
			}
			if (formatType) {
				input.formatType = formatType;
			}
			const params = await this.createParams({
				...input,
				orderBy: this.getOrderBy(orderBy, "comics"),
				offset,
				limit
			});
			const response = await marvel.get(`/comics?${params}`);
			return await formatConnection["comics"](response.data.data.results);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async creators(
		where: CreatorWhereInput,
		orderBy: CreatorOrderBy,
		offset: number,
		limit: number
	) {
		try {
			const params = await this.createParams({
				...where,
				orderBy: this.getOrderBy(orderBy, "creators"),
				offset,
				limit
			});
			const response = await marvel.get(`/creators?${params}`);
			return await formatConnection["creators"](response.data.data.results);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async events(
		where: EventsWhereInput,
		orderBy: EventsOrderBy,
		offset: number,
		limit: number
	) {
		try {
			const params = await this.createParams({
				...where,
				orderBy: this.getOrderBy(orderBy, "events"),
				offset,
				limit
			});
			const response = await marvel.get(`/events?${params}`);
			return await formatConnection["events"](response.data.data.results);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async series(
		where: SeriesWhereInput,
		orderBy: SeriesOrderBy,
		offset: number,
		limit: number
	) {
		try {
			const seriesType = optionalChaining(() => where.seriesType)
				? this.getFormattedEnum(where.seriesType)
				: null;
			const contains = optionalChaining(() => where.contains)
				? this.getFormattedEnum(where.contains)
				: null;
			let input = { ...where };
			if (seriesType) {
				input.seriesType = seriesType;
			}
			if (contains) {
				input.contains = contains;
			}
			const params = await this.createParams({
				...input,
				orderBy: this.getOrderBy(orderBy, "series"),
				offset,
				limit
			});
			const response = await marvel.get(`/series?${params}`);
			return await formatConnection["series"](response.data.data.results);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async stories(
		where: StoriesWhereInput,
		orderBy: StoriesOrderBy,
		offset: number,
		limit: number
	) {
		try {
			const params = await this.createParams({
				...where,
				orderBy: this.getOrderBy(orderBy, "stories"),
				offset,
				limit
			});
			const response = await marvel.get(`/stories?${params}`);
			return await formatConnection["stories"](response.data.data.results);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
}
