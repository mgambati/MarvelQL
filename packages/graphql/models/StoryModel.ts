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
			const params = ({
				...where
			});
			const response = await this.get(`/stories`, { params });
			response.results.map(this.storeApiData)
			return await this.formatApiData(response.results[0]);
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
			const params = {
				...where,
				orderBy: this.getOrderBy(orderBy, 'stories'),
				offset,
				limit
			};
			const response = await this.get(`/stories`, { params });
			response.results.map(this.storeApiData)
			return await response.results.map((item) =>
				this.formatApiData(item)
			);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	storeApiData = async (apiData) => {
		const marvelId = `${apiData.id}`;
		return this.updateCache({
			getCached: () => this.context.db.story({
				marvelId
			}),
			addToCache: async () => {
				const inputData: StoryCreateInput = {
					marvelId: marvelId,
					title: apiData.title,
					description: apiData.description,
					resourceURI: apiData.resourceURI,
					type: apiData.type,
					thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",
				};
				// if (apiData.originalIssue && apiData.originalIssue.resourceURI) {
				// 	const marvelId = this.context.comicsModel.extractId(apiData.originalIssue.resourceURI);
				// 	const originalIssue = await this.context.db.comic({
				// 		marvelId
				// 	});
				// 	inputData._originalIssue = apiData.originalIssue;
				// 	if (originalIssue) {
				// 		inputData.originalIssue = {
				// 			connect: {
				// 				id: originalIssue.id
				// 			}
				// 		}
				// 	}
				// }
				const cached = await this.context.db.upsertStory({
					where: {
						marvelId: marvelId
					},
					create: inputData,
					update: inputData,
				})
				return cached;
			}
		})
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
