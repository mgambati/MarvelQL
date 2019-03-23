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
			const params = {
				...input
			}

			const response = await this.get(`/comics`, { params });
			response.results.map(this.storeApiData)
			return this.formatApiData(response.results[0]);
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
	storeApiData = (apiData): Promise<any> => {
		const marvelId = `${apiData.id}`;
		return this.updateCache({
			getCached: () => this.context.db.comic({
				marvelId
			}),
			addToCache: async () => {
				let inputData: ComicCreateInput = {
					marvelId,
					digitalId: apiData.digitalId,
					title: apiData.title,
					issueNumber: apiData.issueNumber,
					variantDescription: apiData.variantDescription,
					description: apiData.description,
					isbn: apiData.isbn,
					upc: apiData.upc,
					diamondCode: apiData.diamondCode,
					ean: apiData.ean,
					issn: apiData.issn,
					format: apiData.format,
					resourceURI: apiData.resourceURI,
					thumbnail: apiData.thumbnail && apiData.thumbnail.path ? `${apiData.thumbnail.path}.${apiData.thumbnail.extension}` : "",
					textObjects: apiData.textObjects,
					urls: apiData.urls,
					dates: apiData.dates,
					images: apiData.images
				};

				const upserted = await this.context.db.upsertComic({
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
		const params = ({
			...input,
			orderBy: this.getOrderBy(orderBy, 'comics'),
			offset,
			limit
		});
		const response = await this.get(`/comics`, { params });
		response.results.map(this.storeApiData)
		return await response.results.map((comic) =>
			this.formatApiData(comic)
		);
	}

	formatApiData(comic) {
		return {
			...comic,
			thumbnail: formatThumbnail(comic.thumbnail),
			// characters: getSummary['characters'](comic),
			// events: getSummary['events'](comic),
			// creators: getSummary['creators'](comic),
			// stories: getSummary['stories'](comic)
		};
	}
}
