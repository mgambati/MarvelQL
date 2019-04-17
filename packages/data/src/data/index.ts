// import { writeFileSync } from 'fs';
// import DataLoader from 'dataloader';

// var path = require("path");
// export default (dataType) => {
// var normalizedPath = path.join(__dirname, `./${dataType}`);

// const data = {};
// require("fs").readdirSync(normalizedPath).forEach(function (file) {
//     Object.assign(data, require(`./${dataType}/${file}`));
// });
// const dataLoader = new DataLoader(async keys => {
//     const existingData = require(`./${dataType}/_jit.json`);
//     keys.map((key: any) => {
//         existingData[key.key] = key.value;
//     })
//     writeFileSync(
//         path.join(__dirname, `./${dataType}/_jit.json`),
//         JSON.stringify(existingData, null, 2),
//         'utf-8'
//     );
//     return keys.map((k: any) => k.value);
// }, { cache: false, batch: true, maxBatchSize: 1000 })
// return {
// ...data,
// add(key, value) {
// return dataLoader.load({
//     key,
//     value
// }).catch(console.error)
// }
// };
// }

function createConnection(
  rootType: string,
  typeName: string,
  uri?: string,
): any[] {
  const obj = require(`./${rootType}/${rootType}.json`);
  const conn = [];
  const data = Object.keys(obj).map(key => obj[key]);
  if (uri) {
    for (let i = 0; i < data.length - 1; i++) {
      const currObj = data[i];
      currObj[typeName] &&
        currObj[typeName].map(c => {
          const connection = {
            id: currObj.id,
          };
          connection[`${typeName}Id`] = c.resourceURI.replace(
            `http://gateway.marvel.com/v1/public/${uri}/`,
            '',
          );
          return conn.push(connection);
        });
    }
    return conn;
  }
  for (let i = 0; i < data.length - 1; i++) {
    const currObj = data[i];
    currObj[typeName] &&
      currObj[typeName].items.map(c => {
        const connection = {
          id: currObj.id,
        };
        connection[`${typeName}Id`] = c.resourceURI.replace(
          `http://gateway.marvel.com/v1/public/${typeName}/`,
          '',
        );
        return conn.push(connection);
      });
  }
  console.log(conn);
  return conn;
}

function characters() {
  const obj = require('./characters/characters.json');
  const data = Object.keys(obj).map(key => obj[key]);
  return data.map(datum => ({
    id: datum.id,
    name: datum.name,
    description: datum.description,
    modified: datum.modified,
    thumbnail: `${datum.thumbnail.path}/${datum.thumbnail.extension}`,
    marvelURI: datum.resourceURI,
  }));
}

function comics() {
  const obj = require('./comics/comics.json');
  const data = Object.keys(obj).map(key => obj[key]);
  return data.map(datum => {
    const textObjects = datum.textObjects.map(val => ({
      issueSolicitText: val.type === 'issue_solicit_text' && val.text,
      issuePreviewText: val.type === 'issue_preview_text' && val.text,
    }));
    const dates = datum.dates.map(p => ({
      digitalPurchaseDate: p.type === 'digitalPurchaseDate' && p.date,
      onsaleDate: p.type === 'onsaleDate' && p.date,
      focDate: p.type === 'focDate' && p.date,
      unlimitedDate: p.type === 'unlimitedDate' && p.date,
    }));
    const prices = datum.prices.map(p => ({
      digitalPurchasePrice: p.type === 'digitalPurchasePrice' && p.price,
      printPrice: p.type === 'printPrice' && p.price,
    }));
    return {
      id: datum.id,
      digitalId: datum.digitalId,
      title: datum.title,
      issueNumber: datum.issueNumber,
      variantDescription: datum.variantDescription,
      description: datum.description,
      modified: datum.modified,
      isbn: datum.isbn,
      upc: datum.upc,
      diamondCode: datum.diamondCode,
      ean: datum.ean,
      issn: datum.issn,
      format: datum.format,
      pageCount: datum.pageCount,
      ...textObjects[0],
      marvelURI: datum.resourceURI,
      ...dates[0],
      ...prices[0],
      thumbnail: `${datum.thumbnail.path}/${datum.thumbnail.extension}`,
    };
  });
}

function series() {
  const obj = require('./series/series.json');
  const data = Object.keys(obj).map(key => obj[key]);
  return data.map(datum => ({
    id: datum.id,
    title: datum.title,
    description: datum.description,
    marvelURI: datum.resourceURI,
    startYear: datum.startYear,
    endYear: datum.endYear,
    rating: datum.rating,
    type: datum.type,
    modified: datum.modified,
    thumbnail: `${datum.thumbnail.path}/${datum.thumbnail.extension}`,
  }));
}

function stories() {
  const obj = require('./stories/stories.json');
  const data = Object.keys(obj).map(key => obj[key]);
  return data.map(datum => ({
    id: datum.id,
    title: datum.title,
    description: datum.description,
    marvelURI: datum.resourceURI,
    type: datum.type,
    modified: datum.modified,
    originalIssue:
      datum.originalIssue &&
      datum.originalIssue.resourceURI.replace(
        'http://gateway.marvel.com/v1/public/comics/',
        '',
      ),
  }));
}

function events() {
  const obj = require('./events/events.json');
  const data = Object.keys(obj).map(key => obj[key]);
  return data.map(datum => ({
    id: datum.id,
    title: datum.title,
    description: datum.description,
    marvelURI: datum.resourceURI,
    modified: datum.modified,
    start: datum.start,
    end: datum.end,
    thumbnail: `${datum.thumbnail.path}/${datum.thumbnail.extension}`,
    next:
      datum.next &&
      datum.next.resourceURI.replace(
        'http://gateway.marvel.com/v1/public/events/',
        '',
      ),
    previous:
      datum.previous &&
      datum.previous.resourceURI.replace(
        'http://gateway.marvel.com/v1/public/events/',
        '',
      ),
  }));
}

function creators() {
  const obj = require('./creators/creators.json');
  const data = Object.keys(obj).map(key => obj[key]);
  return data.map(datum => ({
    id: datum.id,
    firstName: datum.firstName,
    middleName: datum.middleName,
    lastName: datum.lastName,
    suffix: datum.suffix,
    fullName: datum.fullName,
    modified: datum.modified,
    thumbnail: `${datum.thumbnail.path}/${datum.thumbnail.extension}`,
    marvelURI: datum.resourceURI,
  }));
}

export const getDataset = key => {
  switch (key) {
    case 'characters':
      return characters();
    case 'comics':
      return comics();
    case 'creators':
      return creators();
    case 'events':
      return events();
    case 'series':
      return series();
    case 'stories':
      return stories();
    case 'charComics':
      return createConnection('characters', 'comics');
    case 'charSeries':
      return createConnection('characters', 'series');
    case 'charEvents':
      return createConnection('characters', 'events');
    case 'charStories':
      return createConnection('characters', 'stories');
    case 'creatorSeries':
      return createConnection('creators', 'series');
    case 'creatorStories':
      return createConnection('creators', 'stories');
    case 'creatorComics':
      return createConnection('creators', 'comics');
    case 'creatorEvents':
      return createConnection('creators', 'events');
    case 'comicCharacters':
      return createConnection('comics', 'characters');
    case 'comicEvents':
      return createConnection('comics', 'events');
    case 'comicStories':
      return createConnection('comics', 'stories');
    case 'comicCreators':
      return createConnection('comics', 'creators');
    case 'comicsCollectedIssues':
      return createConnection('comics', 'collectedIssues', 'comics');
    case 'comicsCollections':
      return createConnection('comics', 'collections', 'comics');
    case 'eventsSeries':
      return createConnection('events', 'series');
    case 'eventsStories':
      return createConnection('events', 'stories');
    case 'eventsComics':
      return createConnection('events', 'comics');
    case 'eventsCharacters':
      return createConnection('events', 'characters');
    case 'eventsCreators':
      return createConnection('events', 'creators');
    case 'seriesComics':
      return createConnection('series', 'comics');
    case 'seriesStories':
      return createConnection('series', 'stories');
    case 'seriesEvents':
      return createConnection('series', 'events');
    case 'seriesCharacters':
      return createConnection('series', 'characters');
    case 'seriesCreators':
      return createConnection('series', 'creators');
    case 'storiesComics':
      return createConnection('stories', 'comics');
    case 'storiesSeries':
      return createConnection('stories', 'series');
    case 'storiesEvents':
      return createConnection('stories', 'events');
    case 'storiesCharacters':
      return createConnection('stories', 'characters');
    default:
      throw new Error(
        'Key must be one of characters, comics, creators, events, series, stories',
      );
  }
};
