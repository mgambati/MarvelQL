const stage = process.env.STAGE || 'staging';

const config = {
  baseURL: '',
  stage,
  engine: {
    schemaTag: process.env.ENGINE_TAG || 'staging',
    apiKey: process.env.ENGINE_API_KEY || '',
  },
  production: {
    SUPERHERO_API_KEY: process.env.SUPERHERO_API_KEY || '2436127913064283',
    PRISMA_ENDPOINT:
      process.env.PRISMA_ENDPOINT || 'https://marvelql.herokuapp.com/yoga2/dev',
  },
  staging: {
    SUPERHERO_API_KEY: process.env.SUPERHERO_API_KEY || '2436127913064283',
    PRISMA_ENDPOINT: process.env.PRISMA_ENDPOINT || 'http://localhost:4466',
  },
};

export default {
  ...config,
  ...(config[stage] || {}),
};
