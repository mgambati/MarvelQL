import MarvelApiModel from './MarvelApiModel';
import { formatThumbnail, getSummary } from '../utils/formatters';
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { Context } from '../utils/getContext';
import { StoryCreateInput } from 'packages/prisma';

export default class StoryModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context, {
			singularRef: "story",
			pluralRef: "stories"
		});
	}
	async getOne(where: NexusGenInputs["StoriesWhereInput"]) {
		try {
			const params = await this.createParams({
				...where
			});
			const response = await this.marvel.get(`/stories?${params}`);
			return await this.formatApiData(response.data.data.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getById(id: any) {
		return await this.cacheFallback({
			getFromCache: async () => {
				return await this.context.db.story({
					marvelId: id
				})
			},
			fallback: async () => {
				const response = await this.get(`/stories/${id}`);
				return await this.storeApiData(response.results[0]);
			}
		})
	}
	async storeApiData(apiData) {
		const inputData: StoryCreateInput = {
			marvelId: `${apiData.id}`,
			title: apiData.title,
			description: apiData.description,
			resourceURI: apiData.resourceURI,
			type: apiData.type,
			thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",

		};
		Object.assign(inputData, await this.makeConnections({
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
					singularRef: "series",
					pluralRef: "series",
				},
				{
					singularRef: "comic",
					pluralRef: "comics",
				},
				{
					singularRef: "event",
					pluralRef: "events",
				},
			],
			apiData: apiData
		}))
		const created = await this.context.db.createEvent(inputData)

		return this.convertCached(created);
	}
	async getMany(args: {
		where: NexusGenInputs["StoriesWhereInput"],
		orderBy: NexusGenEnums["StoriesOrderBy"],
		offset: number,
		limit: number
	}) {
		const {
			where,
			orderBy,
			limit,
			offset
		} = args;
		try {
			const params = await this.createParams({
				...where,
				orderBy: this.getOrderBy(orderBy, 'stories'),
				offset,
				limit
			});
			const response = await this.marvel.get(`/stories?${params}`);
			return await response.data.data.results.map((item) =>
				this.formatApiData(item)
			);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
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
