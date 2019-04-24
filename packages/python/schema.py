from graphene import ObjectType, String, Boolean, ID, List, Field, Int, InputObjectType, Argument, AbstractType, Date, Enum
import marvelous
import json
import os
from collections import namedtuple

import getData as getData
import marvelTypes as types


def _json_object_hook(d):
    return namedtuple('X', d.keys())(*d.values())


def json2obj(data):
    return json.loads(data, object_hook=_json_object_hook)


class Query(ObjectType):
    characters = List(types.Character)
    getCharacter = List(types.Character, name=String(required=False),
        nameStartsWith=String(required=False),modifiedSince=String(required=False),
        comics=List(ID),series=List(ID),events=List(ID),stories=List(ID),orderBy=List(types.CharacterOrderBy),
        limit=Int(required=False), offset=Int(required=False))

    comics = List(types.Comic)
    getComic = List(types.Comic, title=String(required=False), titleStartsWith=String(required=False),
        startYear=Int(required=False),issueNumber=Int(required=False),diamondCode=String(required=False),
        digitalId=Int(required=False),upc=String(required=False), isbn=String(required=False),
        ean=String(required=False),issn=String(required=False),hasDigitalIssue=Boolean(required=False),
        modifiedSince=String(required=False),creators=List(ID), characters=List(ID),
        series=List(ID), events=List(ID), stories=List(ID),sharedAppearances=List(ID),
        collaborators=List(ID), format= types.Format(required=False), 
        formatType = types.FormatType(required=False), orderBy=List(types.ComicOrderBy),
        limit=Int(required=False), offset=Int(required=False))

    creators = List(types.Creator)
    getCreator = List(types.Creator, firstName=String(required=False),middleName=String(required=False), lastName=String(required=False),
        suffix=String(required=False), nameStartsWith=String(required=False), firstNameStartsWith=String(required=False),
        middleNameStartsWith=String(required=False),
        lastNameStartsWith=String(required=False), modifiedSince=String(required=False),
        comics=List(ID),series=List(ID),events=List(ID),stories=List(ID), 
        orderBy=List(types.CreatorOrderBy), limit=Int(required=False),
        offset=Int(required=False))

    events = List(types.Event)
    getEvent = List(types.Event, name=String(required=False), nameStartsWith=String(required=False),
        modifiedSince=String(required=False), creators=List(ID), characters=List(ID),
        series=List(ID), comics=List(ID), stories=List(ID), 
        orderBy=List(types.EventOrderBy), limit=Int(required=False), offset=Int(required=False))

    series = List(types.Series)
    getSeries = List(types.Series, title=String(required=False),titleStartsWith=String(required=False), startYear=String(required=False),
        modifiedSince=String(required=False), comics=List(ID),
        stories=List(ID),events=List(ID), creators=List(ID),characters=List(ID),
        seriesType=types.SeriesType(required=False), contains=List(types.Format), 
        orderBy=List(types.SeriesOrderBy), limit=Int(required=False),
        offset=Int(required=False))

    stories = List(types.Story)
    getStory = List(types.Story, modifiedSince=String(required=False),comics= List(ID), 
        series=List(ID), events=List(ID),creators=List(ID), characters=List(ID), 
        orderBy = List(types.StoryOrderBy), limit=Int(required=False),offset=Int(required=False))

    def resolve_characters(self, info):
        characters = getData.accessData('characters')
        return json2obj(json.dumps(characters))

    def resolve_getCharacter(_, info, **kwargs):
        name = nameStartsWith = modifiedSince = comics = series = None
        events = stories = orderBy = limit = offset = None

        parameters = [name, nameStartsWith, modifiedSince, comics, series, 
                      events, stories, orderBy, limit, offset]
        stringParameters = ['name', 'nameStartsWith','modifiedSince', 'comics', 'series', 
                            'events', 'stories', 'orderBy','limit', 'offset']
    
        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]

        character = getData.getCharacter(name=parameters[0], nameStartsWith=parameters[1], 
            modifiedSince=parameters[2], comics =parameters[3], series=parameters[4], events=parameters[5], 
            stories=parameters[6], orderBy=parameters[7], limit=parameters[8],
            offset=parameters[9])

        return json2obj(json.dumps(character))

    def resolve_comics(self, info):
        comics = getData.accessData('comics')
        return json2obj(json.dumps(comics))

    def resolve_getComic(_, info, **kwargs):
        title = titleStartsWith = startYear = issueNumber = None
        diamondCode = upc = isbn = ean = issn = hasDigitalIssue = None
        modifiedSince = characters = series = events = None
        creators = stories = sharedAppearances = collaborators = format = formatType = None
        orderBy = limit = offset = None

        parameters = [title, titleStartsWith, startYear, issueNumber, 
            diamondCode, upc, isbn, ean, issn, hasDigitalIssue, modifiedSince, 
            creators, characters,series, events,stories, 
            sharedAppearances,collaborators, format, formatType , orderBy, limit, offset]

        stringParameters = ['title', 'titleStartsWith', 'startYear', 'issueNumber', 
                'diamondCode', 'upc', 'isbn', 'ean', 'issn', 'hasDigitalIssue', 'modifiedSince'
                ,'creators', 'characters','series','events','stories', 'sharedAppearances',
                'collaborators', 'format', 'formatType','orderBy', 'limit', 'offset']

        
        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]
        
        comics = getData.getComic(title=parameters[0], titleStartsWith=parameters[1], startYear=parameters[2],
            issueNumber =parameters[3], diamondCode=parameters[4], upc=parameters[5], isbn=parameters[6],
            ean = parameters[7],issn=parameters[8], hasDigitalIssue=parameters[9],modifiedSince=parameters[10],
            creators=parameters[11], characters=parameters[12],series=parameters[13],
            events=parameters[14],stories=parameters[15], sharedAppearances = parameters[16],
            collaborators=parameters[17], format = parameters[18], formatType = parameters[19], 
            orderBy = parameters[20],limit =parameters[21], offset=parameters[22])

        return json2obj(json.dumps(comics))
        

    def resolve_creators(self, info):
        creators = getData.accessData('creators')
        return json2obj(json.dumps(creators))

    def resolve_getCreator(_, info, **kwargs):
        firstName = middleName = lastName = suffix = nameStartsWith = firstNameStartsWith = None
        middleNameStartsWith = lastNameStartsWith = modifiedSince = comics = None
        series = events = stories = orderBy = limit = offset = None

        parameters = [firstName, middleName, lastName, suffix, nameStartsWith, firstNameStartsWith, 
            middleNameStartsWith,
            lastNameStartsWith, modifiedSince, comics, series, events, stories, orderBy, limit, offset ]

        stringParameters =  ['firstName', 'middleName', 'lastName', 'suffix', 'nameStartsWith', 
            'firstNameStartsWith', 'middleNameStartsWith', 'lastNameStartsWith', 'modifiedSince',
            'comics', 'series', 'events', 'stories', 'orderBy', 'limit', 'offset' ]
        
        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]
        
        creator = getData.getCreator(firstName=parameters[0], middleName=parameters[1], lastName=parameters[2],
            suffix =parameters[3], nameStartsWith=parameters[4], firstNameStartsWith=parameters[5], middleNameStartsWith=parameters[6],
            lastNameStartsWith = parameters[7],modifiedSince=parameters[8], comics=parameters[9],series=parameters[10],
            events=parameters[11],stories=parameters[12], orderBy=parameters[13], limit=parameters[14], offset=parameters[15])

        return json2obj(json.dumps(creator))

    def resolve_events(self, info):
        events = getData.accessData('events')
        return json2obj(json.dumps(events))

    def resolve_getEvent(_, info, **kwargs):
        name = nameStartsWith = modifiedSince = creators = characters = series = None
        comics = stories = orderBy = limit = offset = None

        parameters = [name, nameStartsWith, modifiedSince, creators, characters, series, 
            comics, stories, orderBy, limit, offset]

        stringParameters = ['name','nameStartsWith', 'modifiedSince', 'creators', 'characters', 'series', 'comics', 'stories'
            ,'orderBy','limit', 'offset']

        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]

        event = getData.getEvent(name=parameters[0], nameStartsWith=parameters[1], modifiedSince=parameters[2],
            creators =parameters[3], characters=parameters[4], series=parameters[5],comics=parameters[6], stories=parameters[7],
            orderBy=parameters[8], limit=parameters[9], offset=parameters[10])

        return json2obj(json.dumps(event))

    def resolve_series(self, info):
        series = getData.accessData('series')
        return json2obj(json.dumps(series))

    def resolve_getSeries(_, info, **kwargs):
        title = titleStartsWith = startYear = modifiedSince = comics = stories = events = creators = None
        characters = seriesType = contains = orderBy = limit = offset = None

        parameters = [title, titleStartsWith, startYear, modifiedSince, comics, stories, events, creators,characters,seriesType,contains,
            orderBy, limit, offset]

        stringParameters = ['title', 'titleStartsWith', 'startYear', 'modifiedSince', 'comics', 
            'stories', 'events', 'creators','characters','seriesType','contains', 'orderBy', 'limit', 'offset']

        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]

        series = getData.getSeries(title=parameters[0], titleStartsWith=parameters[1], startYear=parameters[2], 
            modifiedSince=parameters[3],comics=parameters[4],stories=parameters[5],
            events=parameters[6],creators=parameters[7], characters=parameters[8],
            seriesType=parameters[9],contains=parameters[10], orderBy=parameters[11], limit=parameters[12],
            offset=parameters[13])

        return json2obj(json.dumps(series))

    def resolve_stories(self, info):
        stories = getData.accessData('stories')
        return json2obj(json.dumps(stories))

    def resolve_getStory(_, info, **kwargs):
        modifiedSince = comics = series = events = creators = characters = orderBy = limit = offset = None

        parameters = [modifiedSince,comics, series, events, creators, characters, orderBy, limit, offset]
        stringParameters =  ['modifiedSince','comics', 'series', 'events', 'creators', 'characters',
            'orderBy', 'limit', 'offset']

        for p in range(len(stringParameters)):
            if(stringParameters[p] in kwargs):
                parameters[p] = kwargs[stringParameters[p]]

        
        story = getData.getStory(modifiedSince=parameters[0], comics=parameters[1], 
            series=parameters[2], events=parameters[3], creators=parameters[4],
            characters=parameters[5], orderBy=parameters[6], limit=parameters[7], offset=parameters[8])

        return json2obj(json.dumps(story))
