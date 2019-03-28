import MarvelApiModel from "./MarvelApiModel";
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { formatThumbnail, getSummary } from "../utils/formatters";
import { Context } from "../utils/getContext";
import { CharacterCreateInput } from "packages/prisma";

export default class CharacterModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context, {
			singularRef: "character",
			pluralRef: "characters"
		});
	}
	async getOne(where: NexusGenInputs['CharacterWhereInput']) {
		try {
			const response = await this.get(`/characters`, { params: where });
			response.results.map(this.storeApiData);
			return this.formatApiData(response.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getMany(args: {
		where: NexusGenInputs['CharacterWhereInput'],
		orderBy: NexusGenEnums["CharacterOrderBy"],
		offset: number,
		limit: number
	}) {
		const {
			where,
			orderBy,
			offset,
			limit
		} = args;
		const response = await this.get(`/characters`, {
			params: {
				...where,
				orderBy: this.getOrderBy(orderBy, "characters"),
				offset,
				limit
			}
		});
		response.results.map(item => this.storeApiData(item));
		return response.results.map((item) => this.formatApiData(item));
	}
	storeApiData = async (apiData) => {
		const id = `${apiData.id}`;
		return super.updateCache({
			getCached: () => this.context.db.character({
				marvelId: id
			}),
			addToCache: () => {
				let inputData: CharacterCreateInput = {
					marvelId: id,
					name: apiData.name,
					description: apiData.description,
					thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",
					resourceURI: apiData.resourceURI,
					urls: apiData.urls
				};
				return this.context.db.upsertCharacter({
					where: {
						marvelId: id
					},
					create: inputData,
					update: inputData,
				})
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
