import MarvelApiModel from './MarvelApiModel';
import { formatThumbnail, getSummary } from '../utils/formatters';
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { Context } from '../utils/getContext';
import { EventCreateInput } from 'packages/prisma';

export default class EventModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context, {
			singularRef: "event",
			pluralRef: "events"
		});
	}
	async getOne(where: NexusGenInputs["EventsWhereInput"]) {
		try {
			const response = await this.get(`/events`, {
				params: {
					...where
				}
			});
			response.results.map(this.storeApiData);
			return await this.formatApiData(response.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getById(id: any) {
		return await this.cacheFallback({
			getFromCache: async () => {
				return await this.context.db.event({
					marvelId: id
				})
			},
			fallback: async () => {
				const response = await this.get(`/events/${id}`);
				return await this.storeApiData(response.results[0]);
			}
		})
	}
	async getMany(args: {
		where: NexusGenInputs["EventsWhereInput"],
		orderBy: NexusGenEnums["EventsOrderBy"],
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
			const params = ({
				...where,
				orderBy: this.getOrderBy(orderBy, 'events'),
				offset,
				limit
			});
			const response = await this.get(`/events`, { params });
			response.results.map(this.storeApiData);
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
			getCached: () => this.context.db.event({ marvelId }),
			addToCache: async () => {
				const inputData: EventCreateInput = {
					marvelId: marvelId,
					title: apiData.title,
					description: apiData.description,
					resourceURI: apiData.resourceURI,
					urls: apiData.urls,
					start: new Date(apiData.start),
					end: new Date(apiData.end),
					thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",
				};
				if (apiData.next && apiData.next.resourceURI) {
					// inputData._next = apiData.next;
					const id = this.extractId(apiData.next.resourceURI);
					const existingEvent = await this.context.db.event({
						marvelId: id
					});
					if (existingEvent) {
						inputData.next = {
							connect: {
								id: existingEvent.id
							}
						}
					}
				}
				if (apiData.previous && apiData.previous.resourceURI) {
					// inputData._previous = apiData.previous;
					const id = this.extractId(apiData.previous.resourceURI);
					const existingEvent = await this.context.db.event({
						marvelId: id
					});
					if (existingEvent) {
						inputData.previous = {
							connect: {
								id: existingEvent.id
							}
						}
					}
				}
				const created = await this.context.db.upsertEvent({
					where: {
						marvelId: marvelId
					},
					create: inputData,
					update: inputData,
				})

				return created;
			}
		})
	}
	formatApiData(item) {
		return {
			...item,
			thumbnail: formatThumbnail(item.thumbnail),
			series: getSummary['series'](item),
			comics: getSummary['comics'](item),
			stories: getSummary['stories'](item),
			characters: getSummary['characters'](item),
			creators: getSummary['creators'](item)
		};
	}
}
