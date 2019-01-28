import axios from 'axios';
const qs = require('qs');
import { baseURL, hash, ts, apikey } from '../utils';
import { orderByDirectory, formatEnum } from '../utils/formatters';

// todo: Refactor get to include hash and ts;
export default class MarvelApiModel {
	marvel;
	constructor() {
		this.marvel = axios.create({
			baseURL
		});
	}
	createParams(args?: any) {
		return qs.stringify({ ...args, hash, ts, apikey });
	}

	async getConnections(resourceUri) {
		const params = this.createParams();
		const response = await this.marvel.get(
			`${resourceUri.replace(baseURL)}?${params}`
		);
		return response.data.data.results[0];
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
}
