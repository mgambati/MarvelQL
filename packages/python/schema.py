from graphene import ObjectType, String, Boolean, ID, List, Field, Int, InputObjectType, Argument, AbstractType, Date, Enum
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
        series = m.call(['series'], {'limit': 10})
        return series['data']['results']
    elif(name == "stories"):
        stories = m.call(['stories'], {'limit': 10})
        return stories['data']['results']


def getCharacter(**kwargs):
    
    # returns character matching specific name
     character = m.call(['characters'], {'name': kwargs['name'], 'nameStartsWith': kwargs['nameStartsWith'],
        'modifiedSince': kwargs['modifiedSince'], 'comics': kwargs['comics'], 'series': kwargs['series'],
        'events': kwargs['events'], 'stories': kwargs['stories']})
     
     return(character['data']['results'])
    


def getComic(**kwargs):
    comic = m.call(['comics'], {'title': kwargs['title'], 'titleStartsWith': kwargs['titleStartsWith'],
        'diamondCode': kwargs['diamondCode'], 'upc': kwargs['upc'], 'isbn': kwargs['isbn'],
        'ean' : kwargs['ean'], 'issn': kwargs['issn'], 'modifiedSince': kwargs['modifiedSince'],
        'hasDigitalIssue': kwargs['hasDigitalIssue'], 'startYear':kwargs['startYear'],
        'creators':kwargs['creators'], 'characters':kwargs['characters'],
        'series': kwargs['series'], 'events':kwargs['events'], 'stories': kwargs['stories'],
        'sharedAppearances': kwargs['sharedAppearances'], 'collaborators': kwargs['collaborators'],
        'format': kwargs['format'], 'formatType': kwargs['formatType']

    })
    
    return(comic['data']['results'])


def getCreator(**kwargs):
    creator = m.call(['creators'],{'firstName': kwargs['firstName'],'middleName': kwargs['middleName'],
    'lastName': kwargs['lastName'], 'suffix': kwargs['suffix'], 'nameStartsWith': kwargs['nameStartsWith'],
    'firstNameStartsWith': kwargs['firstNameStartsWith'], 'middleNameStartsWith': kwargs['middleNameStartsWith'],
    'lastNameStartsWith': kwargs['lastNameStartsWith'], 'modifiedSince': kwargs['modifiedSince'],
    'comics':kwargs['comics'], 'series': kwargs['series'], 'events': kwargs['events'], 'stories': kwargs['stories']})

    return(creator['data']['results'])


def getEvent(**kwargs):
    event = m.call(['events'],{'name':kwargs['name'], 'nameStartsWith': kwargs['nameStartsWith'], 
    'modifiedSince': kwargs['modifiedSince'], 'creators':kwargs['creators'], 'characters':kwargs['characters'],
    'series':kwargs['series'], 'comics':kwargs['comics'], 'stories':kwargs['stories'], })
    
    return(event(['data']['results']))


def getSeries(title):
    series = m.call(['series'], {'titleStartsWith': title})
    for i in range(len(series['data']['results'])):
        if(title.lower() in series['data']['results'][i]['title'].lower()):
            return(series['data']['results'][i])


def getStory(modifiedDate):
    stories = m.call(['stories'], {'modifiedSince': modifiedDate})
    for i in range(len(stories['data']['results'])):
        if(modifiedDate in stories['data']['results'][i]['modified']):
            return(stories['data']['results'][i])


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
    modified = Date()


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


class Story(ObjectType):
    id = ID()
    title = String()
    description = String()
    resourceURI = String()
    type = String()
    modified = Date()
    thumbnail = Field(Image)
    comics = Field(AllList)
    series = Field(AllList)
    events = Field(AllList)
    characters = Field(AllList)
    creators = Field(AllList)
    originalissue = Field(Summary)


class Format(Enum):
    COMIC = "comic"
    MAGAZINE = "magazine"
    TRADE_PAPERBACK = "trade paperback"
    HARDCOVER = "hardcover"
    DIGEST = "digest"
    GRAPHIC_NOVEL = "graphic novel"
    DIGITAL_COMIC = "digital comic"
    INFINITE_COMIC = "infinite comic"

class FormatType(Enum):
    COMIC = 'comic'
    COLLECTION = 'collection'
    

class Query(ObjectType):
    characters = List(Character)
    getCharacter = List(Character, name=String(required=False),
                        nameStartsWith=String(required=False),
                        modifiedSince=String(required=False),
                        comics=List(ID),
                        series=List(ID),
                        events=List(ID),
                        stories=List(ID))

    comics = List(Comic)
    getComic = List(Comic, title=String(required=False), titleStartsWith=String(required=False),
    startYear=Int(required=False),issueNumber=Int(required=False),diamondCode=String(required=False),
    digitalId=Int(required=False),upc=String(required=False), isbn=String(required=False),
    ean=String(required=False),issn=String(required=False),hasDigitalIssue=Boolean(required=False),
    modifiedSince=String(required=False),creators=List(ID), characters=List(ID),
    series=List(ID), events=List(ID), stories=List(ID),sharedAppearances=List(ID),
    collaborators=List(ID), format= Format(required=False), formatType = FormatType(required=False))

    creators = List(Creator)
    getCreator = List(Creator, firstName=String(required=False),middleName=String(required=False), lastName=String(required=False),
    suffix=String(required=False), nameStartsWith=String(required=False), firstNameStartsWith=String(required=False),
    middleNameStartsWith=String(required=False),lastNameStartsWith=String(required=False), modifiedSince=String(required=False),
    comics=String(required=False),series=String(required=False),events=String(required=False),stories=String(required=False),
    )

    events = List(Event)
    getEvent = Field(Event, name=String(required=True))

    series = List(Series)
    getSeries = Field(Series, title=String(required=True))

    stories = List(Story)
    getStory = Field(Series, modifiedDate=String(required=False))

    def resolve_characters(self, info):
        characters = accessData('characters')
        return json2obj(json.dumps(characters))

    def resolve_getCharacter(_, info, **kwargs):
        name = nameStartsWith = modifiedSince = comics = series = events = stories = None

        parameters = [name, nameStartsWith, modifiedSince, comics, series, events, stories]
        stringParameters = ['name', 'nameStartsWith','modifiedSince', 'comics', 'series', 'events', 'stories']
    
        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]

        character = getCharacter(name=parameters[0], nameStartsWith=parameters[1], modifiedSince=parameters[2],
        comics =parameters[3], series=parameters[4], events=parameters[5], stories=parameters[6])
        return json2obj(json.dumps(character))

    def resolve_comics(self, info):
        comics = accessData('comics')
        return json2obj(json.dumps(comics))

    def resolve_getComic(_, info, **kwargs):
        title = titleStartsWith = startYear = issueNumber = diamondCode = upc = isbn = ean = issn = hasDigitalIssue = None
        modifiedSince = characters = series = events = creators = stories = sharedAppearances = collaborators = format = formatType = None

        parameters = [title, titleStartsWith, startYear, issueNumber, 
            diamondCode, upc, isbn, ean, issn, hasDigitalIssue, modifiedSince, creators, characters,series, events,stories, 
            sharedAppearances,collaborators, format, formatType ]

        stringParameters = ['title', 'titleStartsWith', 'startYear', 'issueNumber', 
                'diamondCode', 'upc', 'isbn', 'ean', 'issn', 'hasDigitalIssue', 'modifiedSince'
                ,'creators', 'characters','series','events','stories', 'sharedAppearances','collaborators', 'format', 'formatType' ]

        
        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]
        
        comics = getComic(title=parameters[0], titleStartsWith=parameters[1], startYear=parameters[2],
            issueNumber =parameters[3], diamondCode=parameters[4], upc=parameters[5], isbn=parameters[6],
            ean = parameters[7],issn=parameters[8], hasDigitalIssue=parameters[9],modifiedSince=parameters[10],
            creators=parameters[11], characters=parameters[12],series=parameters[13],
            events=parameters[14],stories=parameters[15], sharedAppearances = parameters[16],
            collaborators=parameters[17], format = parameters[18], formatType = parameters[19])

        return json2obj(json.dumps(comics))
        

    def resolve_creators(self, info):
        creators = accessData('creators')
        return json2obj(json.dumps(creators))

    def resolve_getCreator(_, info, **kwargs):
        firstName = middleName = lastName = suffix = nameStartsWith = firstNameStartsWith = middleNameStartsWith = None
        lastNameStartsWith = modifiedSince = comics = series = events = stories = None

        parameters = [firstName, middleName, lastName, suffix, nameStartsWith, firstNameStartsWith, middleNameStartsWith,
        lastNameStartsWith, modifiedSince, comics, series, events, stories ]

        stringParameters =  ['firstName', 'middleName', 'lastName', 'suffix', 'nameStartsWith', 'firstNameStartsWith', 'middleNameStartsWith',
        'lastNameStartsWith', 'modifiedSince', 'comics', 'series', 'events', 'stories' ]
        
        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]
        
        creator = getCreator(firstName=parameters[0], middleName=parameters[1], lastName=parameters[2],
            suffix =parameters[3], nameStartsWith=parameters[4], firstNameStartsWith=parameters[5], middleNameStartsWith=parameters[6],
            lastNameStartsWith = parameters[7],modifiedSince=parameters[8], comics=parameters[9],series=parameters[10],
            events=parameters[11],stories=parameters[12])

        return json2obj(json.dumps(creator))

    def resolve_events(self, info):
        events = accessData('events')
        return json2obj(json.dumps(events))

    def resolve_getEvent(_, info, **kwargs):
        name = nameStartsWith = modifiedSince = creators = characters = series = comics = stories = None

        parameters = [name, nameStartsWith, modifiedSince, creators, characters, series, comics, stories]

        stringParameters = ['name','nameStartsWith', 'modifiedSince', 'creators', 'characters', 'series', 'comics', 'stories']

        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]
        
        
        event = getEvent(name=parameters[0], nameStartsWith=parameters[1], modifiedSince=parameters[2],
            creators =parameters[3], characters=parameters[4], comics =parameters[5], stories=parameters[6])

        return json2obj(json.dumps(event))

    def resolve_series(self, info):
        series = accessData('series')
        return json2obj(json.dumps(series))

    def resolve_getSeries(_, info, title):
        series = getSeries(title)
        return json2obj(json.dumps(series))

    def resolve_stories(self, info):
        stories = accessData('stories')
        return json2obj(json.dumps(stories))

    def resolve_getStory(_, info, modifiedDate):
        story = getStory(modifiedDate)
        return json2obj(json.dumps(story))
