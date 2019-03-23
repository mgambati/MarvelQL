import MarvelApiModel from './MarvelApiModel';
import { formatThumbnail, getSummary } from '../utils/formatters';
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { Context } from '../utils/getContext';
import { CreatorCreateInput } from 'packages/prisma';
export default class CreatorModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context, {
			singularRef: "creator",
			pluralRef: "creators"
		});
	}
	async getOne(where: NexusGenInputs["CreatorWhereInput"]) {
		try {
			const params = {
				...where
			};
			const response = await this.get(`/creators`, { params });
			response.results.map(this.storeApiData)
			return await this.formatApiData(response.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getById(id: any) {
		try {
			const response = await this.get(`/creators/${id}`);
			response.results.map(this.storeApiData)
			return this.formatApiData(response.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getMany(args: {
		where: NexusGenInputs["CreatorWhereInput"],
		orderBy: NexusGenEnums["CreatorOrderBy"],
		offset: number,
		limit: number
	}) {
		const {
			where,
			orderBy,
			offset,
			limit,
		} = args;
		try {
			const params = {
				...where,
				orderBy: this.getOrderBy(orderBy, 'creators'),
				offset,
				limit
			};
			const response = await this.get(`/creators`, { params });
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
			getCached: () => this.context.db.series({
				marvelId
			}),
			addToCache: async () => {
				let inputData: CreatorCreateInput = {
					marvelId,
					firstName: apiData.firstName,
					middleName: apiData.middleName,
					lastName: apiData.lastName,
					suffix: apiData.suffix,
					fullName: apiData.fullName,
					thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",
					resourceURI: apiData.resourceURI,
					urls: apiData.urls,
				};
				const upserted = await this.context.db.upsertCreator({
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
