import marvelous

public_key = 'ba0613cb148841f5091cb0075b5076d2'
private_key = '140a52c97a8ef92f028d89a543e83d711f9e80a0'

m = marvelous.api(
    public_key,
    private_key,
)


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
                                        'events': kwargs['events'], 'stories': kwargs['stories'], 'orderBy': kwargs['orderBy'],
                                        'limit': kwargs['limit'], 'offset': kwargs['offset']})

    return(character['data']['results'])


def getComic(**kwargs):
    comic = m.call(['comics'], {'title': kwargs['title'], 'titleStartsWith': kwargs['titleStartsWith'],
                                'diamondCode': kwargs['diamondCode'], 'upc': kwargs['upc'], 'isbn': kwargs['isbn'],
                                'ean': kwargs['ean'], 'issn': kwargs['issn'], 'modifiedSince': kwargs['modifiedSince'],
                                'hasDigitalIssue': kwargs['hasDigitalIssue'], 'startYear': kwargs['startYear'],
                                'creators': kwargs['creators'], 'characters': kwargs['characters'],
                                'series': kwargs['series'], 'events': kwargs['events'], 'stories': kwargs['stories'],
                                'sharedAppearances': kwargs['sharedAppearances'], 'collaborators': kwargs['collaborators'],
                                'format': kwargs['format'], 'formatType': kwargs['formatType'], 'orderBy': kwargs['orderBy'],
                                'limit': kwargs['limit'], 'offset': kwargs['offset']

                                })

    return(comic['data']['results'])


def getCreator(**kwargs):
    creator = m.call(['creators'], {'firstName': kwargs['firstName'], 'middleName': kwargs['middleName'],
                                    'lastName': kwargs['lastName'], 'suffix': kwargs['suffix'], 'nameStartsWith': kwargs['nameStartsWith'],
                                    'firstNameStartsWith': kwargs['firstNameStartsWith'], 'middleNameStartsWith': kwargs['middleNameStartsWith'],
                                    'lastNameStartsWith': kwargs['lastNameStartsWith'], 'modifiedSince': kwargs['modifiedSince'],
                                    'comics': kwargs['comics'], 'series': kwargs['series'], 'events': kwargs['events'], 'stories': kwargs['stories'],
                                    'orderBy': kwargs['orderBy'], 'limit': kwargs['limit'], 'offset': kwargs['offset']
                                    })

    return(creator['data']['results'])


def getEvent(**kwargs):
    event = m.call(['events'], {'name': kwargs['name'], 'nameStartsWith': kwargs['nameStartsWith'],
                                'modifiedSince': kwargs['modifiedSince'], 'creators': kwargs['creators'], 'characters': kwargs['characters'],
                                'series': kwargs['series'], 'comics': kwargs['comics'], 'stories': kwargs['stories'], 'orderBy': kwargs['orderBy'],
                                'limit': kwargs['limit'], 'offset': kwargs['offset']})

    return(event['data']['results'])


def getSeries(**kwargs):
    series = m.call(['series'], {'title': kwargs['title'], 'titleStartsWith': kwargs['titleStartsWith'], 'startYear': kwargs['startYear'],
                                 'modifiedSince': kwargs['modifiedSince'], 'comics': kwargs['comics'], 'stories': kwargs['stories'], 'events': kwargs['events'],
                                 'creators': kwargs['creators'], 'characters': kwargs['characters'], 'seriesType': kwargs['seriesType'], 'contains': kwargs['contains'],
                                 'orderBy': kwargs['orderBy'], 'limit': kwargs['limit'], 'offset': kwargs['offset']})

    return(series['data']['results'])


def getStory(**kwargs):
    stories = m.call(['stories'], {'modifiedSince': kwargs['modifiedSince'], 'comics': kwargs['comics'], 'series': kwargs['series'],
                                   'events': kwargs['events'], 'creators': kwargs['creators'], 'characters': kwargs['characters'],
                                   'orderBy': kwargs['orderBy'], 'limit': kwargs['limit'], 'offset': kwargs['offset']})

    return(stories['data']['results'])
