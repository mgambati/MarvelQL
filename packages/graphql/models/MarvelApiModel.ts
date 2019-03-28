import axios from 'axios';
const qs = require('qs');
import { baseURL, hash, ts, apikey } from '../utils';
import { orderByDirectory, formatEnum, getSummary, toPascalCase } from '../utils/formatters';
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
		return this.convertCached(await fallback());
	}
	async updateCache(args: {
		getCached: () => any;
		addToCache: () => any;
	}) {
		const { getCached, addToCache } = args;
		let cached = null;
		try {
			cached = await getCached()
		} catch (e) { }
		if (!cached) {
			cached = await addToCache()
		}
		return this.convertCached(cached);
	}
	extractId(resourceUri = "") {
		return resourceUri.split("/").pop()
	}
	convertCached(item: any = {}) {
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
			...connections,
			id: item.marvelId || item.id
		}
	}
	async getConnection(args: {
		data: any;
		connectionName: string;
		connectionType?: string;
		cardinality?: "one-one" | 'one-many' | 'many-one' | "many-many"
	}) {
		const {
			data,
			connectionName,
			cardinality = "many-many",
			connectionType = connectionName
		} = args;
		const srcCardinality = cardinality.split("-")[0]
		const targetCardinality = cardinality.split("-")[1]
		const marvelId = `${data.id}`
		if (!data[connectionName] || data[connectionName].length === 0) {
			return data[connectionName];
		}
		if (srcCardinality === "one") {
			const targetId = this.extractId(data[connectionName].resourceURI);
			const singleData = await this.context[`${connectionType}Model`].getById(targetId);
			await this.connectEdge({
				connectionName,
				connectionType,
				connectionData: singleData,
				sourceId: marvelId
			});
			return this.convertCached(singleData);
		}
		const dbConnectionName = getDbConnectionName(connectionType);
		const aggregate = await this.context.db[`${dbConnectionName}Connection`]({
			where: {
				[`${this.pluralRef}${targetCardinality === "many" ? "_some" : ""}`]: {
					marvelId: marvelId
				}
			}
		}).aggregate()
		if (data[connectionName].available === 0) {
			return []
		}
		if (aggregate.count >= data[connectionName].available) {
			return (await this.context.db[this.singularRef]({ marvelId: marvelId })[connectionType]()).map(this.convertCached)
		} else {
			const firstRes = await this.get(`/${this.pluralRef}/${marvelId}/${connectionName}`)
			await Promise.all(firstRes.results.map(result => this.connectEdge({
				connectionName,
				connectionType,
				connectionData: result,
				sourceId: marvelId
			})
			));
			(async () => {
				let res = {
					...firstRes
				}
				while ((res.offset + res.limit) < res.total) {
					res = await this.get(`/${this.pluralRef}/${marvelId}/${connectionName}`, {
						params: {
							offset: res.offset + res.limit,
							limit: res.limit,
						}
					})
					await Promise.all(res.results.map(async result => {
						return await this.connectEdge({
							connectionName,
							connectionType,
							connectionData: result,
							sourceId: marvelId
						});
					}))
				}
			})()
			return firstRes.results;
		}
	}
	private async connectEdge(args: { connectionName: string, connectionType?: string, connectionData: any, sourceId: string }) {
		const {
			connectionName,
			connectionType = connectionName,
			connectionData: result,
			sourceId: marvelId
		} = args;
		const cached = await this.context[`${connectionType}Model`].storeApiData(result);
		await this.context.db[`update${toPascalCase(this.singularRef)}`]({
			where: {
				marvelId: marvelId
			},
			data: {
				[connectionName]: {
					connect: {
						marvelId: `${cached.id}`
					}
				}
			}
		});
	}
}

function getDbConnectionName(name) {
	const DB_CONNECTION_MAP = {
		series: "serieses"
	}
	return DB_CONNECTION_MAP[name] || name;
}