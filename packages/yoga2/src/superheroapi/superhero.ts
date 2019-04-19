import { Url } from 'url'

export interface PowerStats {
  intelligence: string
  strength: string
  speed: string
  durability: string
  power: string
  combat: string
}

export interface Appearance {
  gender: 'Male' | 'Female'
  race: string
  height: string[]
  weight: string[]
  eyeColor: string
  hairColor: string
}

export interface Work {
  occupation: string
  base: string
}

export interface Image {
  url: Url
}

export interface Connections {
  groupAffiliation: string
  relatives: string
}

export interface Biography {
  fullName: string

  alterEgos: string

  aliases: string[]

  placeOfBirth: string

  firstAppearance: string

  publisher: string

  alignment: string
}
export interface ErrorResponse {
  response: string
  error: string
}

export interface Response {
  response?: string
  id?: string
  name?: string
}

export interface SearchResponsePacket {
  response: string
  'results-for': string
  results: ResponsePacket[]
}
export interface ResponsePacket extends Response {
  powerstats: PowerStats
  biography: Biography
  appearance: Appearance
  work: Work
  connections: Connections
  image: Image
}

export interface PowerStatsResponse extends PowerStats {
  response: string
  id: string
}

export interface SuperHeroAPI {
  '/:id': {
    GET: {
      params: {
        id: string
      }
      response: {
        data: ResponsePacket
      }
    }
  }
  '/:id/powerstats': {
    GET: {
      params: {
        id: string
      }
      response: {
        data: PowerStatsResponse
      }
    }
  }
  '/search/:name': {
    GET: {
      params: {
        name: string
      }
      response: {
        data: SearchResponsePacket
      }
    }
  }
}
