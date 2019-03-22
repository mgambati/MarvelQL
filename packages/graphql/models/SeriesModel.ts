import MarvelApiModel from './MarvelApiModel';
import { optionalChaining } from '../utils';
import { formatThumbnail, getSummary } from '../utils/formatters';
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { Context } from '../utils/getContext';
import { SeriesCreateInput } from 'packages/prisma';

export default class SeriesModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context);
	}
	getWhereArgs(where) {
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
		return input;
	}
	async getOne(where: NexusGenInputs["SeriesWhereInput"]) {
		try {
			const input = this.getWhereArgs(where);
			const params = await this.createParams({
				...input
			});

			const response = await this.marvel.get(`/series?${params}`);
			return this.formatApiData(response.data.data.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getById(id: any) {
		return await this.cacheFallback({
			getFromCache: async () => {
				return await this.context.db.series({
					marvelId: id
				})
			},
			fallback: async () => {
				const response = await this.get(`/series/${id}`);
				return this.storeApiData(response.results[0]);
			}
		})
	}
	async storeApiData(series) {
		let seriesData: SeriesCreateInput = {
			marvelId: `${series.id}`,
			title: series.title,
			description: series.description,
			resourceURI: series.resourceURI,
			urls: series.urls,
			startYear: series.startYear,
			endYear: series.endYear,
			rating: series.rating,
			type: series.type,
			thumbnail: series.thumbnail && series.thumbnail.path ? `${series.thumbnail.path}.${series.thumbnail.extension}` : "",
		};
		Object.assign(seriesData, await this.makeConnections({
			targets: [
				{
					singularRef: "creator",
					pluralRef: "creators",
				},
				{
					singularRef: "character",
					pluralRef: "characters",
				},
				{
					singularRef: "story",
					pluralRef: "stories",
				},
				{
					singularRef: "comic",
					pluralRef: "comics",
				},
				{
					singularRef: "event",
					pluralRef: "events"
				}
			],
			apiData: series
		}))
		const created = await this.context.db.createSeries(seriesData)

		return this.convertCached(created);
		// console.log(series)
		// return this.formatApiData(series);
	}
	async getMany(args: {
		where: NexusGenInputs["SeriesWhereInput"],
		orderBy: NexusGenEnums["SeriesOrderBy"],
		offset: number,
		limit: number
	}) {
		const {
			where,
			orderBy,
			limit,
			offset
		} = args;
		const input = this.getWhereArgs(where);
		const params = await this.createParams({
			...input,
			orderBy: this.getOrderBy(orderBy, 'series'),
			offset,
			limit
		});
		const response = await this.marvel.get(`/series?${params}`);
		return await response.data.data.results.map((item) =>
			this.formatApiData(item)
		);
	}
	catch(error) {
		console.error(error);
		throw new Error(error);
	}
	formatApiData(item) {
		return {
			...item,
			thumbnail: formatThumbnail(item.thumbnail),
			events: getSummary['events'](item),
			comics: getSummary['comics'](item),
			stories: getSummary['stories'](item),
			characters: getSummary['characters'](item),
			creators: getSummary['creators'](item)
		};
	}
}
