import MarvelApiModel from './MarvelApiModel';
import { optionalChaining } from '../utils';
import { formatThumbnail, getSummary } from '../utils/formatters';
import { NexusGenInputs, NexusGenEnums } from "../schema/typegen";
import { Context } from '../utils/getContext';
import { ComicCreateInput } from 'packages/prisma';


export default class ComicModel extends MarvelApiModel {
	constructor(context: Context) {
		super(context, {
			singularRef: "comic",
			pluralRef: "comics"
		});
	}
	getWhereArgs(where) {
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
		return input;
	}
	async getOne(where: NexusGenInputs["ComicWhereInput"]) {
		try {
			const input = this.getWhereArgs(where);
			const params = await this.createParams({
				...input
			});

			const response = await this.marvel.get(`/comics?${params}`);
			return this.formatApiData(response.data.data.results[0]);
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
	async getById(id: any) {
		return await this.cacheFallback({
			getFromCache: async () => {
				return await this.context.db.comic({
					marvelId: id
				})
			},
			fallback: async () => {
				const response = await this.get(`/comics/${id}`);
				return await this.storeApiData(response.results[0]);
			}
		})
	}
	async storeApiData(comic) {
		let comicData: ComicCreateInput = {
			marvelId: `${comic.id}`,
			digitalId: comic.digitalId,
			title: comic.title,
			issueNumber: comic.issueNumber,
			variantDescription: comic.variantDescription,
			description: comic.description,
			isbn: comic.isbn,
			upc: comic.upc,
			diamondCode: comic.diamondCode,
			ean: comic.ean,
			issn: comic.issn,
			format: comic.format,
			resourceURI: comic.resourceURI,
			thumbnail: comic.thumbnail && comic.thumbnail.path ? `${comic.thumbnail.path}.${comic.thumbnail.extension}` : "",
			textObjects: comic.textObjects,
			urls: comic.urls,
			dates: comic.dates,
			images: comic.images
		};
		Object.assign(comicData, await this.makeConnections({
			targets: [
				{
					singularRef: "character",
					pluralRef: "characters",
				},
				{
					singularRef: "story",
					pluralRef: "stories",
				},
				{
					singularRef: "event",
					pluralRef: "events",
				},
				{
					singularRef: "creator",
					pluralRef: "creators",
				},
				{
					singularRef: "series",
					pluralRef: "series",
					connectionType: "one"
				}
			],
			apiData: comic
		}))

		const created = await this.context.db.createComic(comicData)

		return this.convertCached(created);
	}

	async getMany(args: {
		where: NexusGenInputs["ComicWhereInput"],
		orderBy: NexusGenEnums["ComicOrderBy"],
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
			orderBy: this.getOrderBy(orderBy, 'comics'),
			offset,
			limit
		});
		const response = await this.marvel.get(`/comics?${params}`);
		return await response.data.data.results.map((comic) =>
			this.formatApiData(comic)
		);
	}

	formatApiData(comic) {
		return {
			...comic,
			thumbnail: formatThumbnail(comic.thumbnail),
			characters: getSummary['characters'](comic),
			events: getSummary['events'](comic),
			creators: getSummary['creators'](comic),
			stories: getSummary['stories'](comic)
		};
	}
}
