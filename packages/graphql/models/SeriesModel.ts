import MarvelApiModel from './MarvelApiModel';
import { optionalChaining } from '../utils';
import { formatThumbnail, getSummary } from '../utils/formatters';
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { Context } from '../utils/getContext';
import { SeriesCreateInput } from 'packages/prisma';

export default class SeriesModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context, {
			singularRef: "series",
			pluralRef: "series",
		});
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
			const params = ({
				...input
			});

			const response = await this.get(`/series`, { params });
			if (response.results.length > 0) {
				response.results.map(this.storeApiData);
				return this.formatApiData(response.results[0]);
			} else {
				return null;
			}
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
		const params = ({
			...input,
			orderBy: this.getOrderBy(orderBy, 'series'),
			offset,
			limit
		});
		const response = await this.get(`/series`, { params });
		response.results.map(this.storeApiData);
		return await response.results.map((item) =>
			this.formatApiData(item)
		);
	}
	storeApiData = async (apiData) => {
		const marvelId = `${apiData.id}`;
		return this.updateCache({
			getCached: () => this.context.db.series({
				marvelId
			}),
			addToCache: async () => {
				let inputData: SeriesCreateInput = {
					marvelId: `${apiData.id}`,
					title: apiData.title,
					description: apiData.description,
					resourceURI: apiData.resourceURI,
					urls: apiData.urls,
					startYear: apiData.startYear,
					endYear: apiData.endYear,
					rating: apiData.rating,
					type: apiData.type,
					thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",
				};
				if (apiData.next && apiData.next.resourceURI) {
					// inputData._next = apiData.next;
					const id = this.extractId(apiData.next.resourceURI);
					const existing = await this.context.db.series({
						marvelId: id
					});
					if (existing) {
						inputData.next = {
							connect: {
								id: existing.id
							}
						}
					}
				}
				if (apiData.previous && apiData.previous.resourceURI) {
					// inputData._previous = apiData.previous;
					const id = this.extractId(apiData.previous.resourceURI);
					const existing = await this.context.db.series({
						marvelId: id
					});
					if (existing) {
						inputData.previous = {
							connect: {
								id: existing.id
							}
						}
					}
				}
				const upserted = await this.context.db.upsertSeries({
					where: {
						marvelId: inputData.marvelId
					},
					create: inputData,
					update: inputData
				})
				return upserted;
			}
		})
	}
	formatApiData(item) {
		return {
			...item,
			thumbnail: formatThumbnail(item.thumbnail),
		};
	}
}
