import axios from 'axios';
const qs = require('qs');
import { baseURL, hash, ts, apikey } from '../utils';
import { orderByDirectory, formatEnum, getSummary } from '../utils/formatters';
import { Context } from '../utils/getContext';

export default class MarvelApiModel {
	marvel;
	context: Context;
	singularRef: string;
	pluralRef: string;
	constructor(context?: Context, opts: { singularRef?: string; pluralRef?: string } = {}) {
		this.marvel = axios.create({
			baseURL
		});
		this.context = context;
		this.singularRef = opts.singularRef;
		this.pluralRef = opts.pluralRef;
	}
	async createParams(args?: any) {
		return await qs.stringify({ ...args, hash, ts, apikey });
	}
	getFormattedEnum(arg) {
		if (!arg) {
			return null;
		}
		return formatEnum[arg];
	}
	getOrderBy(arg, type) {
		if (!arg) {
			return null;
		}
		return orderByDirectory[type][arg];
	}
	async get(endpoint, opts: { params: any } = { params: undefined }) {
		const { params } = opts;
		const qs = await this.createParams(params);
		const response = await this.marvel.get(`${endpoint}?${qs}`);
		return response.data.data;
	}
	async cacheFallback(args: {
		fallback: () => any
		getFromCache: () => any
	}) {
		const { fallback, getFromCache } = args;
		const cached = await getFromCache();
		if (cached) {
			return this.convertCached(cached);
		}
		return await fallback();
	}
	extractId(resourceUri = "") {
		return resourceUri.split("/").pop()
	}
	async getCachedConnections(args: {
		dbType: string, summary: [{
			resourceURI: string;
		}]
	}) {
		const { dbType, summary } = args
		return (await Promise.all(summary.map(async (c) => {
			const id = this.extractId(c.resourceURI);
			const cachedItem = await this.context.db[dbType]({
				marvelId: id
			});
			if (cachedItem) {
				return {
					id: cachedItem.id
				};
			}
			return null;
		}))).filter(o => o);
	}
	async makeConnections(args: {
		targets: Array<{
			singularRef?: string;
			pluralRef?: string;
			connectionType?: "one" | "many"
		}>
		apiData: any;
	}) {
		const {
			targets,
			apiData: data
		} = args;

		const res = {};
		await Promise.all(targets.map(async ({ singularRef: singular, pluralRef: plural, connectionType = "many" }) => {
			const summary = connectionType === "many" ? getSummary[plural](data) : [data[singular]];
			res[`_${connectionType === "many" ? plural : singular}`] = summary;
			const existingConnections = await this.getCachedConnections({
				dbType: singular,
				summary
			});
			if (existingConnections.length > 0) {
				res[plural] = {
					connect: connectionType === "many" ? existingConnections : existingConnections[0]
				}
			}
		}))
		return res;
	}
	convertCached(item = {}) {
		const connections = Object.keys(item).filter((key: string) => {
			return key.startsWith("_")
		}).reduce((accumulator, key) => {
			if (typeof item[key] === "object") {
				accumulator[key.substring(1, key.length)] = item[key];
			}
			return accumulator;
		}, {})
		return {
			...item,
			...connections
		}
	}
}
