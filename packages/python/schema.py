from graphene import ObjectType, String, Boolean, ID, List, Field, Int
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
                            {'limit': 2})
        return characters['data']['results']
    if(name == "comics"):
        comics = m.call(['comics'], {'limit': 2})
        return comics['data']['results']


class MarvelUrl(ObjectType):
    type = String()
    url = String()


class Summary(ObjectType):
    name = String()
    resourceURI = String()
    role = String()
    type = String()


class Character(ObjectType):
    id = ID()
    name = String()
    description = String()
    resourceURI = String()
    thumbnail = String()
    comics = Field(Summary)
    events = Field(Summary)
    series = Field(Summary)
    stories = Field(Summary)
    urls = Field(MarvelUrl)
    has_profile_pic = Boolean()
    id = ID()
    picture_url = String()
    smart_name = String()
    thumbnail_url = String()


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


class Comic(ObjectType):
    id = ID()
    characters = Field(Summary)
    collectedIssues = Field(Summary)
    collections = Field(Summary)
    creators = Field(Summary)
    events = Field(Summary)
    stories = Field(Summary)
    series = Field(Summary)
    variants = Field(Summary())
    dates = Field(ComicDate)
    images = Field(ComicImage)
    prices = Field(ComicPrice)
    textObjects = Field(TextObject)
    description = String()
    diamondCode = String()
    digitalId = Int()
    ean = String()
    format = String()
    isbn = String()
    issn = String()
    issueNumber = Int()
    modified = String()
    resourceURI = String()
    thumbnail = String()
    title = String()
    upc = String()
    urls = Field(MarvelUrl)
    variantDescription = String()


class Query(ObjectType):
    characters = List(Character)

    def resolve_characters(self, info):
        characters = accessData('characters')

        return json2obj(json.dumps(characters))

    def resolve_comics(self, info):
        comics = accessData('comics')
        return json2obj(json.dumps(comics))
