from graphene import ObjectType, String, Boolean, ID, List, Field, Int, InputObjectType, Argument, AbstractType, Date
import marvelous
import json
import os
from collections import namedtuple

public_key = 'ba0613cb148841f5091cb0075b5076d2'
private_key = '140a52c97a8ef92f028d89a543e83d711f9e80a0'

m = marvelous.api(
    public_key,
    private_key,
)


def _json_object_hook(d):
    return namedtuple('X', d.keys())(*d.values())


def json2obj(data):
    return json.loads(data, object_hook=_json_object_hook)


def accessData(name):
    if(name == "characters"):
        characters = m.call(['characters'],
                            {'limit': 10})
        return characters['data']['results']

    elif(name == "comics"):
        comics = m.call(['comics'], {'limit': 10})
        return comics['data']['results']
    elif(name == "creators"):
        creators = m.call(['creators'], {'limit': 10})
        return creators['data']['results']
    elif(name == "events"):
        events = m.call(['events'], {'limit': 10})
        return events['data']['results']
    elif(name == "series"):
        events = m.call(['series'], {'limit': 10})
        return events['data']['results']


def getCharacter(name):
    character = m.call(['characters'], {'nameStartsWith': name})


def getComic(title):
    comic = m.call(['comics'], {'titleStartsWith': title})
    for i in range(len(comic['data']['results'])):
        if(title.lower() in comic['data']['results'][i]['title'].lower()):
            return(comic['data']['results'][i])


def getCreator(name):
    creator = m.call(['creators'], {'nameStartsWith': name})
    for i in range(len(creator['data']['results'])):
        if(name.lower() in creator['data']['results'][i]['fullName'].lower()):
            return(creator['data']['results'][i])


def getEvent(name):
    event = m.call(['events'], {'nameStartsWith': name})
    for i in range(len(event['data']['results'])):
        if(name.lower() in event['data']['results'][i]['title'].lower()):
            return(event['data']['results'][i])


def getSeries(title):
    series = m.call(['series'], {'titleStartsWith': title})
    for i in range(len(series['data']['results'])):
        if(title.lower() in series['data']['results'][i]['title'].lower()):
            return(series['data']['results'][i])


class MarvelUrl(ObjectType):
    type = String()
    url = String()


class Summary(ObjectType):
    name = String()
    resourceURI = String()
    role = String()
    type = String()


class ComicDate(ObjectType):
    date = String()
    type = String()


class ComicImage(ObjectType):
    extension = String()
    path = String()


class ComicPrice(ObjectType):
    price = Int()
    type = String()


class TextObject(ObjectType):
    language = String()
    text = String()
    type = String()


class AllList(ObjectType):
    available = Int()
    returned = Int()
    collectionURI = String()
    items = List(Summary)


class Image(ObjectType):
    path = String()
    extension = String()


class Comic(ObjectType):
    id = ID()
    digitalId = Int()
    title = String()
    issueNumber = Int()
    variantDescription = String()
    description = String()
    modified = String()
    isbn = String()
    upc = String()
    diamondCode = String()
    ean = String()
    issn = String()
    format = String()
    pageCount = Int()
    textObjects = List(TextObject)
    resourceURI = String()
    urls = List(MarvelUrl)
    series = Field(Summary)
    variants = List(Summary)
    collections = List(Summary)
    collectedIssues = List(Summary)
    dates = List(ComicDate)
    prices = List(ComicPrice)
    thumbnail = String()
    images = List(ComicImage)
    creators = Field(AllList)
    characters = Field(AllList)
    stories = Field(AllList)
    events = Field(AllList)


class Character(ObjectType):
    id = ID()
    name = String()
    description = String()
    resourceURI = String()
    thumbnail = String()
    comics = Field(AllList)
    events = Field(AllList)
    series = Field(AllList)
    stories = Field(AllList)
    urls = List(MarvelUrl)
    has_profile_pic = Boolean()
    id = ID()
    picture_url = String()
    smart_name = String()
    thumbnail_url = String()


class Creator(ObjectType):
    id = ID()
    firstName = String()
    middleName = String()
    lastName = String()
    suffic = String()
    fullName = String()
    resourceURI = String()
    urls = List(MarvelUrl)
    thumbnail = Field(Image)
    series = Field(AllList)
    stories = Field(AllList)
    comics = Field(AllList)
    events = Field(AllList)


class Event(ObjectType):
    id = ID()
    title = String()
    description = String()
    resourceURI = String()
    urls = List(MarvelUrl)
    start = Date()
    end = Date()
    thumbnail = Field(Image)
    comics = Field(AllList)
    stories = Field(AllList)
    series = Field(AllList)
    characters = Field(AllList)
    creators = Field(AllList)
    next = Field(Summary)
    previous = Field(Summary)


class Series(ObjectType):
    id = ID()
    title = String()
    description = String()
    resourceURI = String()
    urls = List(MarvelUrl)
    startYear = Int()
    endYear = Int()
    rating = String()
    modified = Date()
    thumbnail = Field(Image)
    comics = Field(AllList)
    stories = Field(AllList)
    events = Field(AllList)
    characters = Field(AllList)
    creators = Field(AllList)
    next = Field(Summary)
    previous = Field(Summary)


class Query(ObjectType):
    characters = List(Character)
    getCharacter = Field(Character, name=String(required=True))

    comics = List(Comic)
    getComic = Field(Comic, title=String(required=True))

    creators = List(Creator)
    getCreator = Field(Creator, name=String(required=True))

    events = List(Event)
    getEvent = Field(Event, name=String(required=True))

    series = List(Series)
    getSeries = Field(Series, title=String(required=True))

    def resolve_characters(self, info):
        characters = accessData('characters')
        return json2obj(json.dumps(characters))

    def resolve_getCharacter(_, info, name):
        character = getCharacter(name)
        return json2obj(json.dumps(character))

    def resolve_comics(self, info):
        comics = accessData('comics')
        return json2obj(json.dumps(comics))

    def resolve_getComic(_, info, title):
        comic = getComic(title)
        return json2obj(json.dumps(comic))

    def resolve_creators(self, info):
        creators = accessData('creators')
        return json2obj(json.dumps(creators))

    def resolve_getCreator(_, info, name):
        creator = getCreator(name)
        return json2obj(json.dumps(creator))

    def resolve_events(self, info):
        events = accessData('events')
        return json2obj(json.dumps(events))

    def resolve_getEvent(_, info, name):
        event = getEvent(name)
        return json2obj(json.dumps(event))

    def resolve_series(self, info):
        series = accessData('series')
        return json2obj(json.dumps(series))

    def resolve_getSeries(_, info, title):
        series = getSeries(title)
        return json2obj(json.dumps(series))
