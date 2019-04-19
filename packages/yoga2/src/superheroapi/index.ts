import axios from 'restyped-axios'
import { SuperHeroAPI } from './superhero'
import * as camelcase from 'camelcase-keys'

const client = axios.create<SuperHeroAPI>({
  baseURL: 'https://superheroapi.com/api/2436127913064283',
})

export default class SuperHero {
  async getOne(id) {
    const stats = await client.get<'/:id'>(`/${id}`).then(res => res)
    // console.log('STATS RESPONSE', stats)
    return camelcase(stats.data, { deep: true })
  }
}
