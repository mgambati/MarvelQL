import MarvelApiModel from "./MarvelApiModel";
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { formatThumbnail, getSummary } from "../utils/formatters";
import { Context } from "../utils/getContext";

export default class CharacterModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context);
	}
	async getOne(where: NexusGenInputs['CharacterWhereInput']) {
		try {
			const response = await this.marvel.get(`/characters`, { params: where });
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
		return response.results.map((item) => this.formatApiData(item));
	}
	formatApiData(item) {
		return {
			...item,
			thumbnail: formatThumbnail(item.thumbnail),
			comics: getSummary["comics"](item),
			events: getSummary["events"](item),
			series: getSummary["series"](item),
			stories: getSummary["stories"](item)
		};
	}
}
